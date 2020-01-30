import {EventEmitter} from 'events';
import Animated from 'react-native-reanimated';

interface AnimationLogic extends EventEmitter {
	/**
	 * The calculated transform X
	 **/
	x: Animated.Value<number>;
	gestureHandler: ReturnType<typeof Animated.event>;
	/**
	 * Defines wether or not to center items within the wrapper.
	 **/
	updateCenterScroll(value: boolean): void;
	/**
	 * Defines wether this is a max scroll value. If the value is 0, there is
	 * no max scroll and the scroll will be infinite. Values should more than
	 * likely be negative.
	 **/
	updateMaxScroll(value: number): void;
	updateItemWidth(value: number): void;
	updateWrapperWidth(value: number): void;
	scrollTo(value: number, withAnimation?: boolean): void;
}

interface Config {
	springConfig?: Object | null;
	decayConfig?: Object | null;
	itemWidth?: number | null;
	wrapperWidth?: number | null;
	centerScroll?: boolean | null;
	maxScroll?: number | null;
	startingPosition?: number | null;
}

declare const AnimationLogic: (config: Config) => AnimationLogic;

export default AnimationLogic;
