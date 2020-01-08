import React from 'react';
import InfiniteElement from './InfiniteElement';
import { LayoutChangeEvent } from 'react-native';
interface ItemProps<T> {
    item: InfiniteElement<T>;
    renderItem: (data: T | null) => React.ReactElement;
    onLayout?: ((e: LayoutChangeEvent) => void) | null;
}
export default function InfiniteItem<T>({ item, renderItem, onLayout, }: ItemProps<T>): JSX.Element;
export {};
