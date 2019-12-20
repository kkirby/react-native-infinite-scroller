import React, {Component} from 'react';
import {LayoutChangeEvent, StyleProp, ViewStyle} from 'react-native';

import Animated from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import InfiniteElement from './InfiniteElement';
import InfiniteCalculator from './InfiniteCalculator';
import InfiniteItem from './InfiniteItem';
import AnimationLogic from './AnimationLogic';

interface InfiniteScrollerProps<T> {
	dataset(start: number, count: number): Promise<T[]>;
	renderItem: (data: T | null) => React.ReactElement;
	style?: StyleProp<ViewStyle>;
	totalItemCount?: number | null;
	centerInWrapper?: boolean | null;
	startingPosition?: number | null;
	onScrollEnd?: (
		scrollPosition: number,
		scroller: InfiniteScroller<T>,
	) => void | null;
	infiniteElementCount?: number | null;
}

interface InfiniteScrollerState {
	itemLayout: {
		width: number;
		height: number;
	};
	wrapperLayout: {
		width: number;
		height: number;
	};
	ready: boolean;
}

export default class InfiniteScroller<T> extends Component<
	InfiniteScrollerProps<T>,
	InfiniteScrollerState
> {
	infiniteCalculator: InfiniteCalculator<T>;
	infiniteElements: InfiniteElement<T>[] = [];
	animationLogic: AnimationLogic;

	constructor(props: InfiniteScrollerProps<T>) {
		super(props);
		this.state = {
			itemLayout: {
				width: 0,
				height: 0,
			},
			wrapperLayout: {
				width: 0,
				height: 0,
			},
			ready: false,
		};
		this.infiniteElements = [];

		for (let i = 0; i < (props.infiniteElementCount || 100); i++) {
			this.infiniteElements.push(new InfiniteElement<T>());
		}

		this.infiniteCalculator = new InfiniteCalculator({
			...props,
			infiniteLimit: Math.floor(2147483645 / 1000),
			infiniteElements: this.infiniteElements,
			cacheSize: this.infiniteElements.length * 2,
		});

		this.animationLogic = AnimationLogic();
		this.animationLogic.on('change', value => {
			this.infiniteCalculator.x = value;
		});
		this.animationLogic.on('scrollEnd', _value => {
			if (this.props.onScrollEnd) {
				this.props.onScrollEnd(this.getCurrentIndex(), this);
			}
		});

		if (props.centerInWrapper != null) {
			this.animationLogic.updateCenterScroll(props.centerInWrapper);
		}
	}

	componentDidUpdate(
		_prevProps: InfiniteScrollerProps<T>,
		prevState: InfiniteScrollerState,
	) {
		if (
			prevState.wrapperLayout.width !== this.state.wrapperLayout.width ||
			prevState.itemLayout.width !== this.state.itemLayout.width
		) {
			this.infiniteCalculator.infiniteElementWidth = this.state.itemLayout.width;
			this.infiniteCalculator.wrapperWidth = this.state.wrapperLayout.width;
		}

		if (_prevProps.centerInWrapper !== this.props.centerInWrapper) {
			const centerInWrapper = this.props.centerInWrapper;
			this.animationLogic.updateCenterScroll(
				centerInWrapper != null ? centerInWrapper : false,
			);
		}

		if (
			this.state.wrapperLayout.width !== 0 &&
			this.state.itemLayout.width !== 0 &&
			this.state.ready === false
		) {
			if (this.props.startingPosition != null) {
				this.scrollTo(this.props.startingPosition, false);
			}
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState({
				ready: true,
			});
		}

		if (this.state.itemLayout.width && this.props.totalItemCount != null) {
			this.animationLogic.updateMaxScroll(
				-1 * this.state.itemLayout.width * this.props.totalItemCount,
			);
		}
	}

	getCurrentIndex() {
		const moveXValue = this.infiniteCalculator.x;
		const itemWidth = this.state.itemLayout.width;
		const wrapperWidth = this.state.wrapperLayout.width;
		const centerInWrapper =
			this.props.centerInWrapper != null
				? this.props.centerInWrapper
				: false;
		const center = centerInWrapper ? wrapperWidth / 2 - itemWidth / 2 : 0;
		/**
		 * The value will be slighly off because our snap end threshhold is a
		 * bit high to ensure events are triggered in a timley manner.
		 **/
		return Math.round((center - moveXValue) / itemWidth);
	}

	async goNext(withAnimation: boolean = true) {
		const index = this.getCurrentIndex();
		return this.scrollTo(index + 1, withAnimation);
	}

	async goBack(withAnimation: boolean = true) {
		const index = this.getCurrentIndex();
		return this.scrollTo(index - 1, withAnimation);
	}

	async scrollTo(itemOffset: number, withAnimation: boolean = true) {
		this.animationLogic.scrollTo(
			-1 * itemOffset * this.state.itemLayout.width,
			withAnimation,
		);
	}

	onItemLayout = ({
		nativeEvent: {
			layout: {width, height},
		},
	}: LayoutChangeEvent) => {
		const {itemLayout} = this.state;
		if (itemLayout.width !== width || itemLayout.height !== height) {
			this.setState({
				itemLayout: {width, height},
			});
		}
		this.animationLogic.updateItemWidth(width);
		this.infiniteCalculator.infiniteElementWidth = width;
	};

	onWrapperLayout = ({
		nativeEvent: {
			layout: {width, height},
		},
	}: LayoutChangeEvent) => {
		const {wrapperLayout} = this.state;
		if (wrapperLayout.width !== width || wrapperLayout.height !== height) {
			this.setState({
				wrapperLayout: {width, height},
			});
		}
		this.infiniteCalculator.wrapperWidth = width;
		this.animationLogic.updateWrapperWidth(width);
	};

	render() {
		const style = {
			opacity: this.state.ready ? 1 : 0,
			height: this.state.itemLayout.height,
		};
		return (
			<PanGestureHandler
				onGestureEvent={this.animationLogic.gestureHandler}
				onHandlerStateChange={this.animationLogic.gestureHandler}>
				<Animated.View
					style={[this.props.style, style]}
					onLayout={this.onWrapperLayout}>
					<Animated.View
						style={{
							transform: [
								{translateX: this.animationLogic.x},
								{perspective: 1000}, // without this line this Animation will not render on Android while working fine on iOS
							],
						}}>
						{this.infiniteElements.map((item, i) => {
							return (
								<InfiniteItem<T>
									renderItem={this.props.renderItem}
									item={item}
									key={i}
									onLayout={this.onItemLayout}
								/>
							);
						})}
					</Animated.View>
				</Animated.View>
			</PanGestureHandler>
		);
	}
}
