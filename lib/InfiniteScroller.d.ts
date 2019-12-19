import React, { Component } from 'react';
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
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
    onScrollEnd?: (scrollPosition: number, scroller: InfiniteScroller<T>) => void | null;
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
export default class InfiniteScroller<T> extends Component<InfiniteScrollerProps<T>, InfiniteScrollerState> {
    infiniteCalculator: InfiniteCalculator<T>;
    infiniteElements: InfiniteElement<T>[];
    animationLogic: AnimationLogic;
    constructor(props: InfiniteScrollerProps<T>);
    componentDidUpdate(_prevProps: InfiniteScrollerProps<T>, prevState: InfiniteScrollerState): void;
    getCurrentIndex(): number;
    goNext(withAnimation?: boolean): Promise<void>;
    goBack(withAnimation?: boolean): Promise<void>;
    scrollTo(itemOffset: number, withAnimation?: boolean): Promise<void>;
    onItemLayout: ({ nativeEvent: { layout: { width, height }, }, }: LayoutChangeEvent) => void;
    onWrapperLayout: ({ nativeEvent: { layout: { width, height }, }, }: LayoutChangeEvent) => void;
    render(): JSX.Element;
}
export {};
