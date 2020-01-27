import React, {useState, useEffect, useMemo} from 'react';
import InfiniteElement from './InfiniteElement';
import {LayoutChangeEvent, View} from 'react-native';

interface ItemProps<T> {
	item: InfiniteElement<T>;
	renderItem: (data: T | null, elementIndex: number) => React.ReactElement;
	onLayout?: ((e: LayoutChangeEvent) => void) | null;
	elementIndex: number;
}

interface ItemState<T> {
	left: number;
	data: T | null;
}

interface StyleMemo {
	position: 'absolute';
	left: number;
}

export default function InfiniteItem<T>({
	item,
	renderItem,
	onLayout,
	elementIndex
}: ItemProps<T>) {
	const [state, setState] = useState<ItemState<T>>({
		left: item.left,
		data: item.data,
	});

	useEffect(() => {
		const onUpdate = () => {
			setState({
				data: item.data,
				left: item.left,
			});
		};

		item.on('update', onUpdate);

		return () => {
			item.off('update', onUpdate);
		};
	}, [item]);

	const style = useMemo<StyleMemo>(() => {
		return {
			position: 'absolute',
			left: state.left,
		};
	}, [state.left]);

	const props = {
		onLayout: onLayout != null ? onLayout : undefined,
	};

	return (
		<View style={style} {...props}>
			{renderItem(state.data,elementIndex)}
		</View>
	);
}
