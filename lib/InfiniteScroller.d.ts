import React, { Component } from 'react';
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import InfiniteElement from './InfiniteElement';
import InfiniteCalculator from './InfiniteCalculator';
import AnimationLogic from './AnimationLogic';
interface InfiniteScrollerProps<T> {
    dataset(start: number, count: number): Promise<T[]>;
    renderItem: (data: T | null) => React.ReactElement;
    style?: StyleProp<ViewStyle>;
    totalItemCount?: number | null;
    centerInWrapper?: boolean | null;
    startingPosition?: number | null;
    onScrollEnd?: (scrollPosition: number, data: T | null, scroller: InfiniteScroller<T>) => void | null;
    infiniteElementCount?: number | null;
    waitFor?: React.RefObject<any>[];
    simultaneousHandlers?: React.RefObject<any>[];
    springConfig?: Object;
    decayConfig?: Object;
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
export default class InfiniteScroller<T> extends Component<InfiniteScrollerProps<T>, InfiniteScrollerState> {
    infiniteCalculator: InfiniteCalculator<T>;
    infiniteElements: InfiniteElement<T>[];
    animationLogic: AnimationLogic;
    currentElement?: InfiniteElement<T> | null;
    panHandlerRef: React.RefObject<PanGestureHandler>;
    constructor(props: InfiniteScrollerProps<T>);
    componentDidUpdate(_prevProps: InfiniteScrollerProps<T>, prevState: InfiniteScrollerState): void;
    componentWillUnmount(): void;
    calculateCurrentIndex(moveXValue: number): number;
    getCurrentIndex(): number;
    goNext(withAnimation?: boolean): Promise<void>;
    goBack(withAnimation?: boolean): Promise<void>;
    scrollToIndex(itemOffset: number, withAnimation?: boolean): void;
    scrollToElement(element: InfiniteElement<T>, withAnimation?: boolean): void;
    findNearestInfiniteElement(comparator: (item: InfiniteElement<T>) => boolean): InfiniteElement<T> | undefined;
    scrollToItem(comparator: (item: T | null) => boolean, withAnimation?: boolean): void;
    onItemLayout: ({ nativeEvent: { layout: { width, height }, }, }: LayoutChangeEvent) => void;
    onWrapperLayout: ({ nativeEvent: { layout: { width, height }, }, }: LayoutChangeEvent) => void;
    render(): JSX.Element;
}
export {};
