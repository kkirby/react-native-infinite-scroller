import re from '@kkirbatski/js-to-reanimated.macro';
import Animated from 'react-native-reanimated';

const {
	stopClock,
	defined,
	clockRunning,
	startClock,
	decay,
	debug,
	round,
	spring,
	SpringUtils,
} = Animated;

export const springHelper = (value, toValue, velocity) => {
	const clock = new Animated.Clock();
	const state = {
		finished: new Animated.Value(0),
		velocity: new Animated.Value(0),
		position: value,
		time: new Animated.Value(0),
		running: new Animated.Value(0),
	};

	const config = {
		...SpringUtils.makeDefaultConfig(),
		restDisplacementThreshold: 1,
		restSpeedThreshold: 1,
		toValue,
	};

	const tick = re(() => {
		if (clockRunning(clock) === 0) {
			state.running = 1;
			state.finished = 0;
			state.time = 0;
			state.velocity = velocity;
			startClock(clock);
		}
		spring(clock, state, config);

		if (state.finished === 1) {
			state.running = 0;
			stopClock(clock);
		}
		value;
	});

	const stop = re(() => {
		if (clockRunning(clock) === 1) {
			stopClock(clock);
			state.finished = 1;
			state.running = 0;
		}
	});

	return {tick, stop, ...state};
};

export const decayHelper = (value, velocity, deceleration) => {
	const clock = new Animated.Clock();
	const state = {
		finished: new Animated.Value(0),
		velocity: new Animated.Value(0),
		position: value,
		time: new Animated.Value(0),
		running: new Animated.Value(0),
	};

	const tick = re(() => {
		if (clockRunning(clock) === 0) {
			state.running = 1;
			state.finished = 0;
			state.time = 0;
			state.velocity = velocity;
			startClock(clock);
		}
		decay(clock, state, {
			deceleration,
		});
		if (state.finished === 1) {
			state.running = 0;
			stopClock(clock);
		}
		value;
	});

	const stop = re(() => {
		if (clockRunning(clock) === 1) {
			stopClock(clock);
			state.finished = 1;
			state.running = 0;
		}
	});

	return {tick, stop, ...state};
};
