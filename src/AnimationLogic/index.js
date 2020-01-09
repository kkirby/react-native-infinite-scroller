// @ts-nocheck

import re from '@kkirbatski/js-to-reanimated.macro';
import {State} from 'react-native-gesture-handler';
import EventEmitter from 'events';
import {decayHelper, springHelper} from './ReanimatedHelpers';
import Animated from 'react-native-reanimated';
const {call, stopClock, startClock, diff, debug, round} = Animated;

const LogicState = {
	IDLE: 0,
	DECAY: 1,
	SPRING: 2,
	GESTURE: 3,
	SCROLL_TO: 4,
};

export default function AnimationLogic() {
	const eventEmitter = new EventEmitter();
	const randomValue = new Animated.Value(0);
	/**
	 * This is used to determine velocity. The clock is started and stopped,
	 * and the time in between start and stops is used to calculate velocity.
	 **/
	let baseClock = new Animated.Clock();
	/**
	 * Stores the current state of our primary logic
	 **/
	let logicState = new Animated.Value(LogicState.IDLE);
	let previousLogicState = new Animated.Value(LogicState.IDLE);

	let x = new Animated.Value(0);
	let velocity = new Animated.Value(0);

	let itemWidth = new Animated.Value(0);
	let wrapperWidth = new Animated.Value(0);

	/**
	 * Holds the center offset
	 **/
	let center = re((wrapperWidth + itemWidth) / 2);
	let centerScroll = new Animated.Value(0);
	/**
	 * Holds the value of X + the center offset (if centerScroll is 1).
	 **/
	let xWithCenter = re(() => {
		if (centerScroll === 1) {
			x + center - itemWidth;
		} else {
			x;
		}
	});

	let maxScrollX = new Animated.Value(0);

	/**
	 * Holds the destination scroll value when `scrollTo` is called.
	 **/
	let scrollToValue = new Animated.Value(0);

	/**
	 * Holds wether or not the scroll to should be animated.
	 **/
	let scrollToWithAnimation = new Animated.Value(0);

	/**
	 * Handler for when the x value changes.
	 **/
	const onXChange = value => {
		eventEmitter.emit('change', value[0]);
	};

	/**
	 * Handler for when the scroll ends.
	 **/
	const onScrollEnd = ([scrollEndXWithCenter, scrollEndX]) => {
		eventEmitter.emit('scrollEnd', {
			xWithCenter: scrollEndXWithCenter,
			x: scrollEndX,
		});
	};

	/**
	 * Handler for when the scroll has settled and no more animations are playing.
	 **/
	const onScrollSettled = value => {
		eventEmitter.emit('scrollSettled', value[0]);
	};

	/**
	 * Handles spring related stuff.
	 **/
	const springState = (() => {
		let snapPoint = new Animated.Value(0);

		let snapPointWithCenter = re(() => {
			if (centerScroll === 1) {
				snapPoint + center - itemWidth;
			} else {
				snapPoint;
			}
		});

		const helper = springHelper(x, snapPoint, velocity);

		return {
			...helper,
			tick: re(() => {
				if (helper.running === 0) {
					snapPoint =
						round(
							(() => {
								if (logicState === LogicState.SPRING) {
									x;
								} else {
									scrollToValue;
								}
							}) / itemWidth,
						) * itemWidth;
					if (maxScrollX !== 0) {
						if (x > 0) {
							snapPoint = 0;
						} else if (x < maxScrollX) {
							snapPoint = maxScrollX;
						}
					}
					call([snapPointWithCenter, snapPoint], onScrollEnd);
				}
				helper.tick;
			}),
			stop: helper.stop,
		};
	})();

	/**
	 * Defines if we should spring or decay based on maxScrollX.
	 **/
	const shouldSpringInsteadOfDecay = re(() => {
		if (maxScrollX === 0) {
			0;
		} else if (x > 0) {
			1;
		} else if (x < maxScrollX) {
			1;
		} else {
			0;
		}
	});

	/**
	 * Handles decay related stuff.
	 **/
	const decayState = (() => {
		const helper = decayHelper(x, velocity, 0.997);
		/**
		 * Defines if the decay ended up going past our min/max x (if set)
		 **/
		let overshot = new Animated.Value(0);
		return {
			...helper,
			overshot,
			tick: re(() => {
				// If we're not running ,reset stuff.
				if (helper.running === 0) {
					// Reset overshot to 0
					overshot = 0;
					helper.tick;
				} else {
					if (maxScrollX !== 0 && (x > 0 || x < maxScrollX)) {
						// If we have a maxScroll set and we went passed it, set overshot to 1.
						overshot = 1;
						// Set our velocity to the decay's.
						velocity = helper.velocity;
						helper.stop;
					} else {
						helper.tick;
					}
				}
			}),
		};
	})();

	/**
	 * Handles everything related to gestures
	 **/
	const gestureState = (() => {
		let newX = new Animated.Value(0);
		let pointX = new Animated.Value(0);
		let distX = new Animated.Value(0);
		let deltaX = new Animated.Value(0);
		let startTime = new Animated.Value(0);
		let endTime = new Animated.Value(0);

		let data = {
			x: new Animated.Value(0),
			state: new Animated.Value(-1),
		};

		/**
		 * Handler for when the gesture starts.
		 **/
		let start = re(() => {
			startClock(baseClock);
			logicState = LogicState.GESTURE;
			distX = 0;
			startTime = baseClock;
			pointX = data.x;
		});

		/**
		 * Handler for gesture move.
		 **/
		let move = re(() => {
			deltaX = data.x - pointX;

			pointX = data.x;
			distX = distX + deltaX;
			newX = x + deltaX;
			if (maxScrollX !== 0) {
				if (newX > 0 || newX < maxScrollX) {
					newX = x + deltaX / 3;
				}
			}
			x = newX;
		});

		/**
		 * Handler for gesture end
		 **/
		let end = re(() => {
			stopClock(baseClock);
			endTime = baseClock;
			velocity = (distX / (endTime - startTime)) * 1000;
			if (shouldSpringInsteadOfDecay === 0) {
				logicState = LogicState.DECAY;
				decayState.tick;
			} else {
				logicState = LogicState.SPRING;
				springState.tick;
			}
		});

		return {data, start, move, end};
	})();

	/**
	 * Primary logic to determine the value of `x`.
	 **/
	const calculatedTransX = re(() => {
		if (logicState === LogicState.IDLE) {
			// We've started scrolling
			if (gestureState.data.state === State.ACTIVE) {
				gestureState.start;
			}
		} else if (logicState === LogicState.GESTURE) {
			// We're still scrolling
			if (gestureState.data.state === State.ACTIVE) {
				gestureState.move;
			}
			// Scrolling has ended
			else if (gestureState.data.state === State.END) {
				gestureState.end;
			}
		}
		// We're not idle and scrolling isn't active
		else {
			// We've started scrolling again
			if (gestureState.data.state === State.ACTIVE) {
				decayState.stop;
				springState.stop;
				gestureState.start;
			}
			// We're in the decay state
			else if (logicState === LogicState.DECAY) {
				springState.stop;
				decayState.tick;
				if (decayState.finished === 1) {
					if (decayState.overshot === 0) {
						velocity = 0;
					}
					logicState = LogicState.SPRING;
					springState.tick;
				}
			}
			// We're in the spring state
			else if (logicState === LogicState.SPRING) {
				decayState.stop;
				springState.tick;
				if (springState.finished === 1) {
					logicState = LogicState.IDLE;
				}
			}
			// We're in the scroll to state
			else if (logicState === LogicState.SCROLL_TO) {
				if (scrollToWithAnimation === 0) {
					decayState.stop;
					springState.stop;
					x = scrollToValue;
					logicState = LogicState.IDLE;
					call([xWithCenter, x], onScrollEnd);
				} else {
					// Set velocity to 0 since we're not scrolling
					velocity = 0;
					// This checks if the scrollToValue changed, or if the state changed from spring to scroll.
					if (
						diff(scrollToValue) !== 0 ||
						previousLogicState !== logicState
					) {
						// Stop everything, resetting it
						decayState.stop;
						springState.stop;
					}
					springState.tick;
					if (springState.finished === 1) {
						logicState = LogicState.IDLE;
					}
				}
			}
		}
		// Scroll has settled
		if (diff(logicState) !== 0 && logicState === LogicState.IDLE) {
			call([xWithCenter, logicState], onScrollSettled);
		}
		// X has changed
		call([xWithCenter], onXChange);
		previousLogicState = logicState;
		xWithCenter;
	});

	const gestureHandler = Animated.event([
		{
			nativeEvent: gestureState.data,
		},
	]);

	const result = Object.create(eventEmitter);

	Object.assign(result, {
		x: calculatedTransX,
		gestureHandler,
		updateItemWidth(value) {
			itemWidth.setValue(value);
		},
		updateWrapperWidth(value) {
			wrapperWidth.setValue(value);
		},
		updateCenterScroll(value) {
			centerScroll.setValue(value ? 1 : 0);
		},
		updateMaxScroll(value) {
			maxScrollX.setValue(value);
		},
		scrollTo(value, withAnimation = true) {
			scrollToValue.setValue(value);
			scrollToWithAnimation.setValue(withAnimation ? 1 : 0);
			logicState.setValue(LogicState.SCROLL_TO);
		},
	});

	return result;
}
