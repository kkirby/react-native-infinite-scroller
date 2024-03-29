import React, { useCallback, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import InfiniteScroller from '../InfiniteScroller';
export default function App() {
  const scroller = useRef(null);
  const dataset = useCallback(async (start, length) => {
    const result = [];

    for (let i = 0; i < length; i++) {
      result.push({
        index: start + i
      });
    }

    return result;
  }, []);
  const renderItem = useCallback(item => {
    if (!item) {
      return <View style={{
        width: 50,
        height: 100
      }} />;
    }

    if (item.index < 0 || item.index > 20) {//return <View style={{width: 50, height: 100}}></View>;
    }

    const onPress = () => {
      if (!scroller.current) {
        return;
      }

      scroller.current.scrollToIndex(item.index, true);
    };

    return <TouchableOpacity onPress={onPress}>
				<View style={styles.item}>
					<Text>{item ? item.index : 'unknown'}</Text>
				</View>
			</TouchableOpacity>;
  }, []);
  const onScroll = useCallback(scroll => {
    console.log({
      scroll
    });
  }, []);
  const goNext = useCallback(() => {
    if (scroller.current) {
      scroller.current.goNext();
    }
  }, [scroller]);
  return <View style={{
    flex: 1
  }}>
			<View style={{
      flex: 1
    }}>
				<InfiniteScroller ref={scroller} dataset={dataset} onScrollEnd={onScroll} centerInWrapper={true} renderItem={renderItem} startingPosition={50} style={styles.scrollContainer} />
			</View>
			<View style={{
      marginBottom: 50
    }}>
				<Button onPress={goNext} title="Go Next" />
			</View>
		</View>;
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    marginBottom: 100
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 100,
    height: 100
  },
  scrollContainer: {
    backgroundColor: '#123'
  },
  item: {
    width: 50,
    height: 100,
    borderWidth: 1,
    borderColor: 'red',
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsInVzZUNhbGxiYWNrIiwidXNlUmVmIiwiU3R5bGVTaGVldCIsIlRleHQiLCJWaWV3IiwiVG91Y2hhYmxlT3BhY2l0eSIsIkJ1dHRvbiIsIkluZmluaXRlU2Nyb2xsZXIiLCJBcHAiLCJzY3JvbGxlciIsImRhdGFzZXQiLCJzdGFydCIsImxlbmd0aCIsInJlc3VsdCIsImkiLCJwdXNoIiwiaW5kZXgiLCJyZW5kZXJJdGVtIiwiaXRlbSIsIndpZHRoIiwiaGVpZ2h0Iiwib25QcmVzcyIsImN1cnJlbnQiLCJzY3JvbGxUb0luZGV4Iiwic3R5bGVzIiwib25TY3JvbGwiLCJzY3JvbGwiLCJjb25zb2xlIiwibG9nIiwiZ29OZXh0IiwiZmxleCIsInNjcm9sbENvbnRhaW5lciIsIm1hcmdpbkJvdHRvbSIsImNyZWF0ZSIsInBhZ2UiLCJjb250YWluZXIiLCJiYWNrZ3JvdW5kQ29sb3IiLCJtYXJnaW5Ub3AiLCJib3JkZXJXaWR0aCIsImJvcmRlckNvbG9yIiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V4YW1wbGUvaW5kZXgudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge3VzZUNhbGxiYWNrLCB1c2VSZWZ9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7U3R5bGVTaGVldCwgVGV4dCwgVmlldywgVG91Y2hhYmxlT3BhY2l0eSwgQnV0dG9ufSBmcm9tICdyZWFjdC1uYXRpdmUnO1xuaW1wb3J0IEluZmluaXRlU2Nyb2xsZXIgZnJvbSAnLi4vSW5maW5pdGVTY3JvbGxlcic7XG5cbmludGVyZmFjZSBJdGVtRGF0YSB7XG5cdGluZGV4OiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCgpIHtcblx0Y29uc3Qgc2Nyb2xsZXIgPSB1c2VSZWY8SW5maW5pdGVTY3JvbGxlcjxJdGVtRGF0YT4gfCBudWxsPihudWxsKTtcblx0Y29uc3QgZGF0YXNldCA9IHVzZUNhbGxiYWNrKGFzeW5jIChzdGFydDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcikgPT4ge1xuXHRcdGNvbnN0IHJlc3VsdCA9IFtdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdHJlc3VsdC5wdXNoKHtpbmRleDogc3RhcnQgKyBpfSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSwgW10pO1xuXG5cdGNvbnN0IHJlbmRlckl0ZW0gPSB1c2VDYWxsYmFjaygoaXRlbTogSXRlbURhdGEgfCBudWxsKSA9PiB7XG5cdFx0aWYgKCFpdGVtKSB7XG5cdFx0XHRyZXR1cm4gPFZpZXcgc3R5bGU9e3t3aWR0aDogNTAsIGhlaWdodDogMTAwfX0gLz47XG5cdFx0fVxuXHRcdGlmIChpdGVtLmluZGV4IDwgMCB8fCBpdGVtLmluZGV4ID4gMjApIHtcblx0XHRcdC8vcmV0dXJuIDxWaWV3IHN0eWxlPXt7d2lkdGg6IDUwLCBoZWlnaHQ6IDEwMH19PjwvVmlldz47XG5cdFx0fVxuXHRcdGNvbnN0IG9uUHJlc3MgPSAoKSA9PiB7XG5cdFx0XHRpZiAoIXNjcm9sbGVyLmN1cnJlbnQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0c2Nyb2xsZXIuY3VycmVudC5zY3JvbGxUb0luZGV4KGl0ZW0uaW5kZXgsIHRydWUpO1xuXHRcdH07XG5cdFx0cmV0dXJuIChcblx0XHRcdDxUb3VjaGFibGVPcGFjaXR5IG9uUHJlc3M9e29uUHJlc3N9PlxuXHRcdFx0XHQ8VmlldyBzdHlsZT17c3R5bGVzLml0ZW19PlxuXHRcdFx0XHRcdDxUZXh0PntpdGVtID8gaXRlbS5pbmRleCA6ICd1bmtub3duJ308L1RleHQ+XG5cdFx0XHRcdDwvVmlldz5cblx0XHRcdDwvVG91Y2hhYmxlT3BhY2l0eT5cblx0XHQpO1xuXHR9LCBbXSk7XG5cblx0Y29uc3Qgb25TY3JvbGwgPSB1c2VDYWxsYmFjaygoc2Nyb2xsOiBudW1iZXIpID0+IHtcblx0XHRjb25zb2xlLmxvZyh7c2Nyb2xsfSk7XG5cdH0sIFtdKTtcblxuXHRjb25zdCBnb05leHQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG5cdFx0aWYgKHNjcm9sbGVyLmN1cnJlbnQpIHtcblx0XHRcdHNjcm9sbGVyLmN1cnJlbnQuZ29OZXh0KCk7XG5cdFx0fVxuXHR9LCBbc2Nyb2xsZXJdKTtcblxuXHRyZXR1cm4gKFxuXHRcdDxWaWV3IHN0eWxlPXt7ZmxleDogMX19PlxuXHRcdFx0PFZpZXcgc3R5bGU9e3tmbGV4OiAxfX0+XG5cdFx0XHRcdDxJbmZpbml0ZVNjcm9sbGVyPEl0ZW1EYXRhPlxuXHRcdFx0XHRcdHJlZj17c2Nyb2xsZXJ9XG5cdFx0XHRcdFx0ZGF0YXNldD17ZGF0YXNldH1cblx0XHRcdFx0XHRvblNjcm9sbEVuZD17b25TY3JvbGx9XG5cdFx0XHRcdFx0Y2VudGVySW5XcmFwcGVyPXt0cnVlfVxuXHRcdFx0XHRcdHJlbmRlckl0ZW09e3JlbmRlckl0ZW19XG5cdFx0XHRcdFx0c3RhcnRpbmdQb3NpdGlvbj17NTB9XG5cdFx0XHRcdFx0c3R5bGU9e3N0eWxlcy5zY3JvbGxDb250YWluZXJ9XG5cdFx0XHRcdC8+XG5cdFx0XHQ8L1ZpZXc+XG5cdFx0XHQ8VmlldyBzdHlsZT17e21hcmdpbkJvdHRvbTogNTB9fT5cblx0XHRcdFx0PEJ1dHRvbiBvblByZXNzPXtnb05leHR9IHRpdGxlPVwiR28gTmV4dFwiIC8+XG5cdFx0XHQ8L1ZpZXc+XG5cdFx0PC9WaWV3PlxuXHQpO1xufVxuXG5jb25zdCBzdHlsZXMgPSBTdHlsZVNoZWV0LmNyZWF0ZSh7XG5cdHBhZ2U6IHtcblx0XHRmbGV4OiAxLFxuXHRcdG1hcmdpbkJvdHRvbTogMTAwLFxuXHR9LFxuXHRjb250YWluZXI6IHtcblx0XHRmbGV4OiAxLFxuXHRcdGJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuXHRcdG1hcmdpblRvcDogMTAwLFxuXHRcdGhlaWdodDogMTAwLFxuXHR9LFxuXHRzY3JvbGxDb250YWluZXI6IHtcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjMTIzJyxcblx0fSxcblx0aXRlbToge1xuXHRcdHdpZHRoOiA1MCxcblx0XHRoZWlnaHQ6IDEwMCxcblx0XHRib3JkZXJXaWR0aDogMSxcblx0XHRib3JkZXJDb2xvcjogJ3JlZCcsXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnIzU1NScsXG5cdFx0YWxpZ25JdGVtczogJ2NlbnRlcicsXG5cdFx0anVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuXHR9LFxufSk7XG4iXSwibWFwcGluZ3MiOiJBQUFBLE9BQU9BLEtBQVAsSUFBZUMsV0FBZixFQUE0QkMsTUFBNUIsUUFBeUMsT0FBekM7QUFDQSxTQUFRQyxVQUFSLEVBQW9CQyxJQUFwQixFQUEwQkMsSUFBMUIsRUFBZ0NDLGdCQUFoQyxFQUFrREMsTUFBbEQsUUFBK0QsY0FBL0Q7QUFDQSxPQUFPQyxnQkFBUCxNQUE2QixxQkFBN0I7QUFNQSxlQUFlLFNBQVNDLEdBQVQsR0FBZTtFQUM3QixNQUFNQyxRQUFRLEdBQUdSLE1BQU0sQ0FBb0MsSUFBcEMsQ0FBdkI7RUFDQSxNQUFNUyxPQUFPLEdBQUdWLFdBQVcsQ0FBQyxPQUFPVyxLQUFQLEVBQXNCQyxNQUF0QixLQUF5QztJQUNwRSxNQUFNQyxNQUFNLEdBQUcsRUFBZjs7SUFDQSxLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdGLE1BQXBCLEVBQTRCRSxDQUFDLEVBQTdCLEVBQWlDO01BQ2hDRCxNQUFNLENBQUNFLElBQVAsQ0FBWTtRQUFDQyxLQUFLLEVBQUVMLEtBQUssR0FBR0c7TUFBaEIsQ0FBWjtJQUNBOztJQUVELE9BQU9ELE1BQVA7RUFDQSxDQVAwQixFQU94QixFQVB3QixDQUEzQjtFQVNBLE1BQU1JLFVBQVUsR0FBR2pCLFdBQVcsQ0FBRWtCLElBQUQsSUFBMkI7SUFDekQsSUFBSSxDQUFDQSxJQUFMLEVBQVc7TUFDVixPQUFPLENBQUMsSUFBRCxDQUFNLE1BQU0sQ0FBQztRQUFDQyxLQUFLLEVBQUUsRUFBUjtRQUFZQyxNQUFNLEVBQUU7TUFBcEIsQ0FBRCxDQUFaLEdB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