import React, {useCallback, useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
import InfiniteScroller from '../InfiniteScroller';

interface ItemData {
	index: number;
}

export default function App() {
	const scroller = useRef<InfiniteScroller<ItemData> | null>(null);
	const dataset = useCallback(async (start: number, length: number) => {
		const result = [];
		for (let i = 0; i < length; i++) {
			result.push({index: start + i});
		}

		return result;
	}, []);

	const renderItem = useCallback((item: ItemData | null) => {
		if (!item) {
			return <View style={{width: 50, height: 100}} />;
		}
		if (item.index < 0 || item.index > 20) {
			//return <View style={{width: 50, height: 100}}></View>;
		}
		const onPress = () => {
			if (!scroller.current) {
				return;
			}
			scroller.current.scrollTo(item.index, true);
		};
		return (
			<TouchableOpacity onPress={onPress}>
				<View style={styles.item}>
					<Text>{item ? item.index : 'unknown'}</Text>
				</View>
			</TouchableOpacity>
		);
	}, []);

	const onScroll = useCallback((scroll: number) => {
		console.log({scroll});
	}, []);

	const goNext = useCallback(() => {
		if (scroller.current) {
			scroller.current.goNext();
		}
	}, [scroller]);

	return (
		<View style={{flex: 1}}>
			<View style={{flex: 1}}>
				<InfiniteScroller<ItemData>
					ref={scroller}
					dataset={dataset}
					onScrollEnd={onScroll}
					centerInWrapper={true}
					renderItem={renderItem}
					startingPosition={50}
					style={styles.scrollContainer}
				/>
			</View>
			<View style={{marginBottom: 50}}>
				<Button onPress={goNext} title="Go Next" />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		marginBottom: 100,
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		marginTop: 100,
		height: 100,
	},
	scrollContainer: {
		backgroundColor: '#123',
	},
	item: {
		width: 50,
		height: 100,
		borderWidth: 1,
		borderColor: 'red',
		backgroundColor: '#555',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
