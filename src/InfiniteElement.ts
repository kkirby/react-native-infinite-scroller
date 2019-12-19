import {EventEmitter} from 'events';

export default class InfiniteElement<T> extends EventEmitter {
	left: number = 0;
	data: T | null = null;
	phase: number = 0;

	updateLeft(left: number) {
		if (left !== this.left) {
			this.left = left;
			this.emit('update');
		}
	}

	updateData(data: any) {
		if (data !== this.data) {
			this.data = data;
			this.emit('update');
		}
	}
}
