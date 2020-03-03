import {EventEmitter} from 'events';
import InfiniteElement from './InfiniteElement';
import {observable, computed, reaction} from 'mobx';

interface iScrollOptions<T> {
	infiniteLimit: number;
	infiniteElements: InfiniteElement<T>[];
	cacheSize: number;
	dataset: (start: number, count: number) => Promise<T[]>;
}

export default class InfiniteCalculator<T> extends EventEmitter {
	@observable x: number = 0;
	@observable infiniteLimit: number = 0;
	@observable infiniteElementWidth: number = 0;
	@observable infiniteElements: InfiniteElement<T>[] = [];
	@observable wrapperWidth: number = 0;
	@observable cacheSize: number = 4;
	dataset: (start: number, count: number) => Promise<T[]>;

	infiniteCache: {
		[key: string]: T;
	} | null = null;

	/**
	 * The width of all the infinite elements put together.
	 **/
	@computed get infiniteWidth() {
		return this.infiniteLength * this.infiniteElementWidth;
	}

	/**
	 * The total number of infinite elements.
	 **/
	@computed get infiniteLength() {
		return this.infiniteElements.length;
	}

	/**
	 * The cache size dividied by 4.
	 **/
	@computed get infiniteCacheBuffer() {
		return Math.round(this.cacheSize / 4);
	}

	/**
	 * The total number of elements that fit within our wrapper.
	 **/
	@computed get elementsPerPage() {
		return Math.ceil(this.wrapperWidth / this.infiniteElementWidth);
	}

	/**
	 * The count of elements that exceed outside our wrapper, divided by two
	 **/
	@computed get infiniteUpperBufferSize() {
		return Math.floor((this.infiniteLength - this.elementsPerPage) / 2);
	}

	/**
	 * The index of the first element that is fully visible
	 **/
	@computed get firstElementFullyVisible() {
		return Math.floor(-this.x / this.infiniteElementWidth);
	}

	/**
	 * Furthest left element index beyond the wrapper bounds
	 **/
	@computed get minorPhase() {
		return this.firstElementFullyVisible - this.infiniteUpperBufferSize;
	}

	/**
	 * Section index based on the minor phase.
	 **/
	@computed get majorPhase() {
		return Math.floor(this.minorPhase / this.infiniteLength);
	}

	/**
	 * Index of the end of the section
	 **/
	@computed get majorPhaseEnd() {
		return this.majorPhase * this.infiniteLength;
	}

	/**
	 *
	 **/
	@computed get phase() {
		return this.minorPhase - this.majorPhaseEnd;
	}

	@computed get cachePhase() {
		return Math.floor(this.minorPhase / this.infiniteCacheBuffer);
	}

	@computed get dataStart() {
		return (
			this.cachePhase * this.infiniteCacheBuffer -
			this.infiniteCacheBuffer
		);
	}

	disposers: (() => void)[] = [];

	constructor(options: iScrollOptions<T>) {
		super();
		this.infiniteElements = options.infiniteElements;
		this.dataset = options.dataset;
		this.cacheSize = options.cacheSize;
		this.infiniteLimit = options.infiniteLimit;
		this.disposers.push(
			reaction(
				() => {
					return {
						updates: this.reorderInfinite(),
					};
				},
				({updates}) => {
					if (updates) {
						this.updateContent(updates);
					}
				},
				{
					scheduler(cb) {
						cb();
					},
				},
			),
		);

		this.disposers.push(
			reaction(
				() => {
					return {
						dataset: this.dataset,
						dataStart: this.dataStart,
						cacheSize: this.cacheSize,
					};
				},
				({dataset, dataStart, cacheSize}) => {
					this.updateDataset();
				},
			),
		);
		
		this.updateDataset();
	}
	
	updateDataset(){
		const dataStart = this.dataStart;
		this.dataset(dataStart, this.cacheSize).then(value =>
			this.updateCache(dataStart, value),
		);
	}

	dispose() {
		this.disposers.forEach(f => f());
	}

	reorderInfinite() {
		if (this.infiniteElementWidth <= 0) {
			return;
		}
		let i = 0;
		let updates = [];
		while (i < this.infiniteLength) {
			let left =
				i * this.infiniteElementWidth +
				this.majorPhase * this.infiniteWidth;

			if (this.phase - this.elementsPerPage > i) {
				left += this.infiniteElementWidth * this.infiniteLength;
			}

			if (this.infiniteElements[i].left !== left) {
				let _phase = left / this.infiniteElementWidth;
				this.infiniteElements[i].phase = _phase;

				if (_phase < this.infiniteLimit) {
					this.infiniteElements[i].updateLeft(left);
					updates.push(this.infiniteElements[i]);
				}
			}

			i++;
		}

		return updates;
	}

	updateContent(elements: InfiniteElement<T>[]) {
		if (this.infiniteCache == null) {
			return;
		}

		const l = elements.length;
		for (let i = 0; i < l; i++) {
			elements[i].updateData(this.infiniteCache[elements[i].phase]);
		}
	}

	updateCache(start: number, data: T[]) {
		this.infiniteCache = {};
		const l = data.length;
		for (let i = 0; i < l; i++) {
			this.infiniteCache[start++] = data[i];
		}
		this.updateContent(this.infiniteElements);
	}
}
