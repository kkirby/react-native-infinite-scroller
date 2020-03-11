import React, {Component} from 'react';
import {LayoutChangeEvent, StyleProp, ViewStyle, View} from 'react-native';

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
		data: T | null,
		scroller: InfiniteScroller<T>,
	) => void | null;
	infiniteElementCount?: number | null;
	waitFor?: React.RefObject<any>[];
	simultaneousHandlers?: React.RefObject<any>[];
	springConfig?: Object;
	decayConfig?: Object;
	itemDimensions?: {
		width: number;
		height: number;
	} | null;
	wrapperDimensions?: {
		width: number;
		height: number;
	} | null;
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
	currentElement?: InfiniteElement<T> | null;
	panHandlerRef: React.RefObject<PanGestureHandler>;

	constructor(props: InfiniteScrollerProps<T>) {
		super(props);
		this.state = {
			itemLayout: props.itemDimensions || {
				width: 0,
				height: 0,
			},
			wrapperLayout: props.wrapperDimensions || {
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

		const startingPosition =
			props.startingPosition != null
				? -1 * props.startingPosition * this.state.itemLayout.width
				: 0;

		this.animationLogic = AnimationLogic({
			springConfig: props.springConfig || {},
			decayConfig: props.decayConfig || {},
			centerScroll:
				props.centerInWrapper != null ? props.centerInWrapper : false,
			wrapperWidth: this.state.wrapperLayout.width,
			itemWidth: this.state.itemLayout.width,
			maxScroll:
				this.state.itemLayout.width !== 0 &&
				props.totalItemCount != null
					? -1 * this.state.itemLayout.width * (props.totalItemCount - 1)
					: 0,
			startingPosition,
		});

		this.animationLogic.on('change', value => {
			this.infiniteCalculator.x = value;
		});
		this.animationLogic.on('scrollEnd', this.onScrollEnd);

		this.panHandlerRef = React.createRef();

		this.onUpdate(false);

		if (startingPosition !== 0) {
			this.onScrollEnd({x: startingPosition});
		}
	}

	onScrollEnd = ({x}: {x: number}) => {
		this.infiniteCalculator.x = x;
		if (this.props.onScrollEnd) {
			x *= -1;
			this.currentElement = this.infiniteElements.find(element => {
				return element.left === x;
			});
			if (this.currentElement != null) {
				this.props.onScrollEnd(
					this.currentElement.phase,
					this.currentElement.data,
					this,
				);
			} else {
				console.warn(
					'InfiniteScroller is unable to determine the current item after the scroll ended.',
				);
			}
		}
	};

	onUpdate(isMounted: boolean = true) {
		this.animationLogic.updateCenterScroll(
			this.props.centerInWrapper != null
				? this.props.centerInWrapper
				: false,
		);
		if (this.state.itemLayout.width !== 0) {
			this.infiniteCalculator.infiniteElementWidth = this.state.itemLayout.width;
			this.animationLogic.updateItemWidth(this.state.itemLayout.width);
		}

		if (this.state.wrapperLayout.width !== 0) {
			this.infiniteCalculator.wrapperWidth = this.state.wrapperLayout.width;
			this.animationLogic.updateWrapperWidth(
				this.state.wrapperLayout.width,
			);
		}

		if (this.state.itemLayout.width && this.props.totalItemCount != null) {
			this.animationLogic.updateMaxScroll(
				-1 * this.state.itemLayout.width * (this.props.totalItemCount - 1),
			);
		}

		this.infiniteCalculator.reorderInfinite();

		this.onReady(isMounted);
	}

	onReady(isMounted: boolean = true) {
		if (this.state.ready === false) {
			if (
				this.state.itemLayout.width !== 0 &&
				this.state.wrapperLayout.width !== 0
			) {
				if (isMounted) {
					this.setState({
						ready: true,
					});
				} else {
					this.state = {
						...this.state,
						ready: true,
					};
				}
			}
		}
	}

	componentDidUpdate(
		prevProps: InfiniteScrollerProps<T>,
		prevState: InfiniteScrollerState,
	) {
		let didChange = false;
		didChange =
			didChange ||
			prevState.itemLayout.width !== this.state.itemLayout.width;
		didChange =
			didChange ||
			prevState.wrapperLayout.width !== this.state.wrapperLayout.width;
		didChange = didChange || prevState.ready !== this.state.ready;
		didChange =
			didChange ||
			prevProps.centerInWrapper !== this.props.centerInWrapper;
		didChange =
			didChange || prevProps.totalItemCount !== this.props.totalItemCount;
		if (didChange) {
			this.onUpdate();
		}
		if(prevProps.dataset !== this.props.dataset){
			console.log('refresh dataset');
			this.datasetNeedsRefresh();
		}
	}
	
	datasetNeedsRefresh(){
		this.infiniteCalculator.updateDataset(this.props.dataset);
	}

	componentWillUnmount() {
		this.infiniteCalculator.dispose();
	}

	calculateCurrentIndex(moveXValue: number) {
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

	getCurrentIndex() {
		return this.calculateCurrentIndex(this.infiniteCalculator.x);
	}

	async goNext(withAnimation: boolean = true) {
		const index = this.getCurrentIndex();
		return this.scrollToIndex(index + 1, withAnimation);
	}

	async goBack(withAnimation: boolean = true) {
		const index = this.getCurrentIndex();
		return this.scrollToIndex(index - 1, withAnimation);
	}

	scrollToIndex(itemOffset: number, withAnimation: boolean = true) {
		this.animationLogic.scrollTo(
			-1 * itemOffset * this.state.itemLayout.width,
			withAnimation,
		);
	}

	scrollToElement(element: InfiniteElement<T>, withAnimation?: boolean) {
		return this.scrollToIndex(element.phase, withAnimation);
	}

	findNearestInfiniteElement(
		comparator: (item: InfiniteElement<T>) => boolean,
	): InfiniteElement<T> | undefined {
		const x = -1 * this.infiniteCalculator.x;
		let elements = [...this.infiniteElements].sort((a, b) => {
			const aDelta = Math.abs(x - a.left);
			const bDelta = Math.abs(x - b.left);
			return aDelta - bDelta;
		});
		return elements.find(item => comparator(item));
	}

	scrollToItem(
		comparator: (item: T | null) => boolean,
		withAnimation?: boolean,
	) {
		const element = this.findNearestInfiniteElement(elm =>
			elm.data != null ? comparator(elm.data) : false,
		);

		if (element) {
			return this.scrollToElement(element, withAnimation);
		}
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
	};

	render() {
		const style = {
			height: this.state.itemLayout.height,
			opacity: this.state.ready ? 1 : 0,
		};
		return (
			<PanGestureHandler
				ref={this.panHandlerRef}
				simultaneousHandlers={this.props.simultaneousHandlers}
				waitFor={this.props.waitFor}
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
									elementIndex={i}
									renderItem={this.props.renderItem}
									item={item}
									key={i}
									onLayout={
										i === 0 ? this.onItemLayout : null
									}
								/>
							);
						})}
					</Animated.View>
				</Animated.View>
			</PanGestureHandler>
		);
	}
}
