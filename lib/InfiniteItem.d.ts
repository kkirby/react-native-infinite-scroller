import React from 'react';
import InfiniteElement from './InfiniteElement';
import { LayoutChangeEvent } from 'react-native';
interface ItemProps<T> {
    item: InfiniteElement<T>;
    renderItem: (data: T | null, elementIndex: number) => React.ReactElement;
    onLayout?: ((e: LayoutChangeEvent) => void) | null;
    elementIndex: number;
}
export default function InfiniteItem<T>({ item, renderItem, onLayout, elementIndex }: ItemProps<T>): JSX.Element;
export {};
