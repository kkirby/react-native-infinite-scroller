import { EventEmitter } from 'events';
export default class InfiniteElement<T> extends EventEmitter {
    left: number;
    data: T | null;
    phase: number;
    updateLeft(left: number): void;
    updateData(data: any): void;
}
