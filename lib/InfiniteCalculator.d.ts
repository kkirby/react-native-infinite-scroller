import { EventEmitter } from 'events';
import InfiniteElement from './InfiniteElement';
interface iScrollOptions<T> {
    infiniteLimit: number;
    infiniteElements: InfiniteElement<T>[];
    cacheSize: number;
    dataset: (start: number, count: number) => Promise<T[]>;
}
export default class InfiniteCalculator<T> extends EventEmitter {
    x: number;
    infiniteLimit: number;
    infiniteElementWidth: number;
    infiniteElements: InfiniteElement<T>[];
    wrapperWidth: number;
    cacheSize: number;
    dataset: (start: number, count: number) => Promise<T[]>;
    infiniteCache: {
        [key: string]: T;
    } | null;
    /**
     * The width of all the infinite elements put together.
     **/
    get infiniteWidth(): number;
    /**
     * The total number of infinite elements.
     **/
    get infiniteLength(): number;
    /**
     * The cache size dividied by 4.
     **/
    get infiniteCacheBuffer(): number;
    /**
     * The total number of elements that fit within our wrapper.
     **/
    get elementsPerPage(): number;
    /**
     * The count of elements that exceed outside our wrapper, divided by two
     **/
    get infiniteUpperBufferSize(): number;
    /**
     * The index of the first element that is fully visible
     **/
    get firstElementFullyVisible(): number;
    /**
     * Furthest left element index beyond the wrapper bounds
     **/
    get minorPhase(): number;
    /**
     * Section index based on the minor phase.
     **/
    get majorPhase(): number;
    /**
     * Index of the end of the section
     **/
    get majorPhaseEnd(): number;
    /**
     *
     **/
    get phase(): number;
    get cachePhase(): number;
    get dataStart(): number;
    disposers: (() => void)[];
    constructor(options: iScrollOptions<T>);
    dispose(): void;
    reorderInfinite(): InfiniteElement<T>[] | undefined;
    updateContent(elements: InfiniteElement<T>[]): void;
    updateCache(start: number, data: T[]): void;
}
export {};
