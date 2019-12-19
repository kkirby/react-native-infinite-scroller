# @kkirbatski/react-native-infinite-scroller

## Intro

This library was created because I was unable to find a good infinite scrolling
component for react-native. The code in this library is heavily inspired by [cubiq](https://github.com/cubiq)'s [iScroll](https://github.com/cubiq/iscroll). A lot of the infinite logic has been ported from iScroll. See [src/InfiniteCalculator.ts](./src/InfiniteCalculator.ts).


## Usage

Take a look at the [example](./src/example/index.tsx).

Basically you can set wether or not the scroller is infinite, (if it's not
infinite you will need to pass a `totalItemCount` property). If you don't want
it to be infinite, it's your job to prevent rendering of the item in your render
function. If you are rendering an empty item, be sure that the layout of the
item matches that of other items. This library will infer the layout to calculate
item offsets, so if your non-rendered item has no layout, we can't figure out property
width/heights and item offsets.

### Config

```javascript
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
```

## Caveats

This library currently only works on the X-axis as that's all I needed.

## License

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.
