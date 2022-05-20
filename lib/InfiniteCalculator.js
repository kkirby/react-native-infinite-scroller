var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

import { EventEmitter } from 'events';
import { observable, computed, reaction } from 'mobx';
let InfiniteCalculator = (_class = class InfiniteCalculator extends EventEmitter {
  /**
   * The width of all the infinite elements put together.
   **/
  get infiniteWidth() {
    return this.infiniteLength * this.infiniteElementWidth;
  }
  /**
   * The total number of infinite elements.
   **/


  get infiniteLength() {
    return this.infiniteElements.length;
  }
  /**
   * The cache size dividied by 4.
   **/


  get infiniteCacheBuffer() {
    return Math.round(this.cacheSize / 4);
  }
  /**
   * The total number of elements that fit within our wrapper.
   **/


  get elementsPerPage() {
    return Math.ceil(this.wrapperWidth / this.infiniteElementWidth);
  }
  /**
   * The count of elements that exceed outside our wrapper, divided by two
   **/


  get infiniteUpperBufferSize() {
    return Math.floor((this.infiniteLength - this.elementsPerPage) / 2);
  }
  /**
   * The index of the first element that is fully visible
   **/


  get firstElementFullyVisible() {
    return Math.floor(-this.x / this.infiniteElementWidth);
  }
  /**
   * Furthest left element index beyond the wrapper bounds
   **/


  get minorPhase() {
    return this.firstElementFullyVisible - this.infiniteUpperBufferSize;
  }
  /**
   * Section index based on the minor phase.
   **/


  get majorPhase() {
    return Math.floor(this.minorPhase / this.infiniteLength);
  }
  /**
   * Index of the end of the section
   **/


  get majorPhaseEnd() {
    return this.majorPhase * this.infiniteLength;
  }
  /**
   *
   **/


  get phase() {
    return this.minorPhase - this.majorPhaseEnd;
  }

  get cachePhase() {
    return Math.floor(this.minorPhase / this.infiniteCacheBuffer);
  }

  get dataStart() {
    return this.cachePhase * this.infiniteCacheBuffer - this.infiniteCacheBuffer;
  }

  constructor(options) {
    super();

    _initializerDefineProperty(this, "x", _descriptor, this);

    _initializerDefineProperty(this, "infiniteLimit", _descriptor2, this);

    _initializerDefineProperty(this, "infiniteElementWidth", _descriptor3, this);

    _initializerDefineProperty(this, "infiniteElements", _descriptor4, this);

    _initializerDefineProperty(this, "wrapperWidth", _descriptor5, this);

    _initializerDefineProperty(this, "cacheSize", _descriptor6, this);

    _defineProperty(this, "dataset", void 0);

    _defineProperty(this, "infiniteCache", null);

    _defineProperty(this, "disposers", []);

    this.infiniteElements = options.infiniteElements;
    this.dataset = options.dataset;
    this.cacheSize = options.cacheSize;
    this.infiniteLimit = options.infiniteLimit;
    this.disposers.push(reaction(() => {
      return {
        updates: this.reorderInfinite()
      };
    }, ({
      updates
    }) => {
      if (updates) {
        this.updateContent(updates);
      }
    }, {
      scheduler(cb) {
        cb();
      }

    }));
    this.disposers.push(reaction(() => {
      return {
        dataset: this.dataset,
        dataStart: this.dataStart,
        cacheSize: this.cacheSize
      };
    }, ({
      dataset,
      dataStart,
      cacheSize
    }) => {
      this.updateDataset();
    }));
    this.updateDataset();
  }

  updateDataset(dataset) {
    if (dataset != null) {
      this.dataset = dataset;
    }

    const dataStart = this.dataStart;
    this.dataset(dataStart, this.cacheSize).then(value => {
      this.updateCache(dataStart, value);
    });
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
      let left = i * this.infiniteElementWidth + this.majorPhase * this.infiniteWidth;

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

  updateContent(elements) {
    if (this.infiniteCache == null) {
      return;
    }

    const l = elements.length;

    for (let i = 0; i < l; i++) {
      elements[i].updateData(this.infiniteCache[elements[i].phase]);
    }
  }

  updateCache(start, data) {
    this.infiniteCache = {};
    const l = data.length;

    for (let i = 0; i < l; i++) {
      this.infiniteCache[start++] = data[i];
    }

    this.updateContent(this.infiniteElements);
  }

}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "x", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "infiniteLimit", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "infiniteElementWidth", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "infiniteElements", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return [];
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "wrapperWidth", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "cacheSize", [observable], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 4;
  }
}), _applyDecoratedDescriptor(_class.prototype, "infiniteWidth", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "infiniteWidth"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "infiniteLength", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "infiniteLength"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "infiniteCacheBuffer", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "infiniteCacheBuffer"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "elementsPerPage", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "elementsPerPage"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "infiniteUpperBufferSize", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "infiniteUpperBufferSize"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "firstElementFullyVisible", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "firstElementFullyVisible"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "minorPhase", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "minorPhase"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "majorPhase", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "majorPhase"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "majorPhaseEnd", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "majorPhaseEnd"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "phase", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "phase"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "cachePhase", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "cachePhase"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "dataStart", [computed], Object.getOwnPropertyDescriptor(_class.prototype, "dataStart"), _class.prototype)), _class);
export { InfiniteCalculator as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFdmVudEVtaXR0ZXIiLCJvYnNlcnZhYmxlIiwiY29tcHV0ZWQiLCJyZWFjdGlvbiIsIkluZmluaXRlQ2FsY3VsYXRvciIsImluZmluaXRlV2lkdGgiLCJpbmZpbml0ZUxlbmd0aCIsImluZmluaXRlRWxlbWVudFdpZHRoIiwiaW5maW5pdGVFbGVtZW50cyIsImxlbmd0aCIsImluZmluaXRlQ2FjaGVCdWZmZXIiLCJNYXRoIiwicm91bmQiLCJjYWNoZVNpemUiLCJlbGVtZW50c1BlclBhZ2UiLCJjZWlsIiwid3JhcHBlcldpZHRoIiwiaW5maW5pdGVVcHBlckJ1ZmZlclNpemUiLCJmbG9vciIsImZpcnN0RWxlbWVudEZ1bGx5VmlzaWJsZSIsIngiLCJtaW5vclBoYXNlIiwibWFqb3JQaGFzZSIsIm1ham9yUGhhc2VFbmQiLCJwaGFzZSIsImNhY2hlUGhhc2UiLCJkYXRhU3RhcnQiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJkYXRhc2V0IiwiaW5maW5pdGVMaW1pdCIsImRpc3Bvc2VycyIsInB1c2giLCJ1cGRhdGVzIiwicmVvcmRlckluZmluaXRlIiwidXBkYXRlQ29udGVudCIsInNjaGVkdWxlciIsImNiIiwidXBkYXRlRGF0YXNldCIsInRoZW4iLCJ2YWx1ZSIsInVwZGF0ZUNhY2hlIiwiZGlzcG9zZSIsImZvckVhY2giLCJmIiwiaSIsImxlZnQiLCJfcGhhc2UiLCJ1cGRhdGVMZWZ0IiwiZWxlbWVudHMiLCJpbmZpbml0ZUNhY2hlIiwibCIsInVwZGF0ZURhdGEiLCJzdGFydCIsImRhdGEiXSwic291cmNlcyI6WyIuLi9zcmMvSW5maW5pdGVDYWxjdWxhdG9yLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IEluZmluaXRlRWxlbWVudCBmcm9tICcuL0luZmluaXRlRWxlbWVudCc7XG5pbXBvcnQge29ic2VydmFibGUsIGNvbXB1dGVkLCByZWFjdGlvbn0gZnJvbSAnbW9ieCc7XG5cbnR5cGUgRGF0YVNldEZuPFQ+ID0gKHN0YXJ0OiBudW1iZXIsIGNvdW50OiBudW1iZXIpID0+IFByb21pc2U8VFtdPjtcblxuaW50ZXJmYWNlIGlTY3JvbGxPcHRpb25zPFQ+IHtcblx0aW5maW5pdGVMaW1pdDogbnVtYmVyO1xuXHRpbmZpbml0ZUVsZW1lbnRzOiBJbmZpbml0ZUVsZW1lbnQ8VD5bXTtcblx0Y2FjaGVTaXplOiBudW1iZXI7XG5cdGRhdGFzZXQ6IERhdGFTZXRGbjxUPjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5maW5pdGVDYWxjdWxhdG9yPFQ+IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblx0QG9ic2VydmFibGUgeDogbnVtYmVyID0gMDtcblx0QG9ic2VydmFibGUgaW5maW5pdGVMaW1pdDogbnVtYmVyID0gMDtcblx0QG9ic2VydmFibGUgaW5maW5pdGVFbGVtZW50V2lkdGg6IG51bWJlciA9IDA7XG5cdEBvYnNlcnZhYmxlIGluZmluaXRlRWxlbWVudHM6IEluZmluaXRlRWxlbWVudDxUPltdID0gW107XG5cdEBvYnNlcnZhYmxlIHdyYXBwZXJXaWR0aDogbnVtYmVyID0gMDtcblx0QG9ic2VydmFibGUgY2FjaGVTaXplOiBudW1iZXIgPSA0O1xuXHRkYXRhc2V0OiBEYXRhU2V0Rm48VD47XG5cblx0aW5maW5pdGVDYWNoZToge1xuXHRcdFtrZXk6IHN0cmluZ106IFQ7XG5cdH0gfCBudWxsID0gbnVsbDtcblxuXHQvKipcblx0ICogVGhlIHdpZHRoIG9mIGFsbCB0aGUgaW5maW5pdGUgZWxlbWVudHMgcHV0IHRvZ2V0aGVyLlxuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgaW5maW5pdGVXaWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5pbmZpbml0ZUxlbmd0aCAqIHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGg7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRvdGFsIG51bWJlciBvZiBpbmZpbml0ZSBlbGVtZW50cy5cblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IGluZmluaXRlTGVuZ3RoKCkge1xuXHRcdHJldHVybiB0aGlzLmluZmluaXRlRWxlbWVudHMubGVuZ3RoO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBjYWNoZSBzaXplIGRpdmlkaWVkIGJ5IDQuXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBpbmZpbml0ZUNhY2hlQnVmZmVyKCkge1xuXHRcdHJldHVybiBNYXRoLnJvdW5kKHRoaXMuY2FjaGVTaXplIC8gNCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRvdGFsIG51bWJlciBvZiBlbGVtZW50cyB0aGF0IGZpdCB3aXRoaW4gb3VyIHdyYXBwZXIuXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBlbGVtZW50c1BlclBhZ2UoKSB7XG5cdFx0cmV0dXJuIE1hdGguY2VpbCh0aGlzLndyYXBwZXJXaWR0aCAvIHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBjb3VudCBvZiBlbGVtZW50cyB0aGF0IGV4Y2VlZCBvdXRzaWRlIG91ciB3cmFwcGVyLCBkaXZpZGVkIGJ5IHR3b1xuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgaW5maW5pdGVVcHBlckJ1ZmZlclNpemUoKSB7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoKHRoaXMuaW5maW5pdGVMZW5ndGggLSB0aGlzLmVsZW1lbnRzUGVyUGFnZSkgLyAyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgaW5kZXggb2YgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBpcyBmdWxseSB2aXNpYmxlXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBmaXJzdEVsZW1lbnRGdWxseVZpc2libGUoKSB7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoLXRoaXMueCAvIHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZ1cnRoZXN0IGxlZnQgZWxlbWVudCBpbmRleCBiZXlvbmQgdGhlIHdyYXBwZXIgYm91bmRzXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBtaW5vclBoYXNlKCkge1xuXHRcdHJldHVybiB0aGlzLmZpcnN0RWxlbWVudEZ1bGx5VmlzaWJsZSAtIHRoaXMuaW5maW5pdGVVcHBlckJ1ZmZlclNpemU7XG5cdH1cblxuXHQvKipcblx0ICogU2VjdGlvbiBpbmRleCBiYXNlZCBvbiB0aGUgbWlub3IgcGhhc2UuXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBtYWpvclBoYXNlKCkge1xuXHRcdHJldHVybiBNYXRoLmZsb29yKHRoaXMubWlub3JQaGFzZSAvIHRoaXMuaW5maW5pdGVMZW5ndGgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGV4IG9mIHRoZSBlbmQgb2YgdGhlIHNlY3Rpb25cblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IG1ham9yUGhhc2VFbmQoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFqb3JQaGFzZSAqIHRoaXMuaW5maW5pdGVMZW5ndGg7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IHBoYXNlKCkge1xuXHRcdHJldHVybiB0aGlzLm1pbm9yUGhhc2UgLSB0aGlzLm1ham9yUGhhc2VFbmQ7XG5cdH1cblxuXHRAY29tcHV0ZWQgZ2V0IGNhY2hlUGhhc2UoKSB7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IodGhpcy5taW5vclBoYXNlIC8gdGhpcy5pbmZpbml0ZUNhY2hlQnVmZmVyKTtcblx0fVxuXG5cdEBjb21wdXRlZCBnZXQgZGF0YVN0YXJ0KCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHR0aGlzLmNhY2hlUGhhc2UgKiB0aGlzLmluZmluaXRlQ2FjaGVCdWZmZXIgLVxuXHRcdFx0dGhpcy5pbmZpbml0ZUNhY2hlQnVmZmVyXG5cdFx0KTtcblx0fVxuXG5cdGRpc3Bvc2VyczogKCgpID0+IHZvaWQpW10gPSBbXTtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOiBpU2Nyb2xsT3B0aW9uczxUPikge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5pbmZpbml0ZUVsZW1lbnRzID0gb3B0aW9ucy5pbmZpbml0ZUVsZW1lbnRzO1xuXHRcdHRoaXMuZGF0YXNldCA9IG9wdGlvbnMuZGF0YXNldDtcblx0XHR0aGlzLmNhY2hlU2l6ZSA9IG9wdGlvbnMuY2FjaGVTaXplO1xuXHRcdHRoaXMuaW5maW5pdGVMaW1pdCA9IG9wdGlvbnMuaW5maW5pdGVMaW1pdDtcblx0XHR0aGlzLmRpc3Bvc2Vycy5wdXNoKFxuXHRcdFx0cmVhY3Rpb24oXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dXBkYXRlczogdGhpcy5yZW9yZGVySW5maW5pdGUoKSxcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQoe3VwZGF0ZXN9KSA9PiB7XG5cdFx0XHRcdFx0aWYgKHVwZGF0ZXMpIHtcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlQ29udGVudCh1cGRhdGVzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzY2hlZHVsZXIoY2IpIHtcblx0XHRcdFx0XHRcdGNiKCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSxcblx0XHRcdCksXG5cdFx0KTtcblxuXHRcdHRoaXMuZGlzcG9zZXJzLnB1c2goXG5cdFx0XHRyZWFjdGlvbihcblx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRkYXRhc2V0OiB0aGlzLmRhdGFzZXQsXG5cdFx0XHRcdFx0XHRkYXRhU3RhcnQ6IHRoaXMuZGF0YVN0YXJ0LFxuXHRcdFx0XHRcdFx0Y2FjaGVTaXplOiB0aGlzLmNhY2hlU2l6ZSxcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQoe2RhdGFzZXQsIGRhdGFTdGFydCwgY2FjaGVTaXplfSkgPT4ge1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlRGF0YXNldCgpO1xuXHRcdFx0XHR9LFxuXHRcdFx0KSxcblx0XHQpO1xuXHRcdFxuXHRcdHRoaXMudXBkYXRlRGF0YXNldCgpO1xuXHR9XG5cdFxuXHR1cGRhdGVEYXRhc2V0KGRhdGFzZXQ/OiBEYXRhU2V0Rm48VD4gfCBudWxsKXtcblx0XHRpZihkYXRhc2V0ICE9IG51bGwpe1xuXHRcdFx0dGhpcy5kYXRhc2V0ID0gZGF0YXNldDtcblx0XHR9XG5cdFx0Y29uc3QgZGF0YVN0YXJ0ID0gdGhpcy5kYXRhU3RhcnQ7XG5cdFx0dGhpcy5kYXRhc2V0KGRhdGFTdGFydCwgdGhpcy5jYWNoZVNpemUpLnRoZW4odmFsdWUgPT4ge1xuXHRcdFx0dGhpcy51cGRhdGVDYWNoZShkYXRhU3RhcnQsIHZhbHVlKTtcblx0XHR9KTtcblx0fVxuXG5cdGRpc3Bvc2UoKSB7XG5cdFx0dGhpcy5kaXNwb3NlcnMuZm9yRWFjaChmID0+IGYoKSk7XG5cdH1cblxuXHRyZW9yZGVySW5maW5pdGUoKSB7XG5cdFx0aWYgKHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGggPD0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgaSA9IDA7XG5cdFx0bGV0IHVwZGF0ZXMgPSBbXTtcblx0XHR3aGlsZSAoaSA8IHRoaXMuaW5maW5pdGVMZW5ndGgpIHtcblx0XHRcdGxldCBsZWZ0ID1cblx0XHRcdFx0aSAqIHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGggK1xuXHRcdFx0XHR0aGlzLm1ham9yUGhhc2UgKiB0aGlzLmluZmluaXRlV2lkdGg7XG5cblx0XHRcdGlmICh0aGlzLnBoYXNlIC0gdGhpcy5lbGVtZW50c1BlclBhZ2UgPiBpKSB7XG5cdFx0XHRcdGxlZnQgKz0gdGhpcy5pbmZpbml0ZUVsZW1lbnRXaWR0aCAqIHRoaXMuaW5maW5pdGVMZW5ndGg7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLmluZmluaXRlRWxlbWVudHNbaV0ubGVmdCAhPT0gbGVmdCkge1xuXHRcdFx0XHRsZXQgX3BoYXNlID0gbGVmdCAvIHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGg7XG5cdFx0XHRcdHRoaXMuaW5maW5pdGVFbGVtZW50c1tpXS5waGFzZSA9IF9waGFzZTtcblxuXHRcdFx0XHRpZiAoX3BoYXNlIDwgdGhpcy5pbmZpbml0ZUxpbWl0KSB7XG5cdFx0XHRcdFx0dGhpcy5pbmZpbml0ZUVsZW1lbnRzW2ldLnVwZGF0ZUxlZnQobGVmdCk7XG5cdFx0XHRcdFx0dXBkYXRlcy5wdXNoKHRoaXMuaW5maW5pdGVFbGVtZW50c1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aSsrO1xuXHRcdH1cblxuXHRcdHJldHVybiB1cGRhdGVzO1xuXHR9XG5cblx0dXBkYXRlQ29udGVudChlbGVtZW50czogSW5maW5pdGVFbGVtZW50PFQ+W10pIHtcblx0XHRpZiAodGhpcy5pbmZpbml0ZUNhY2hlID09IG51bGwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBsID0gZWxlbWVudHMubGVuZ3RoO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRlbGVtZW50c1tpXS51cGRhdGVEYXRhKHRoaXMuaW5maW5pdGVDYWNoZVtlbGVtZW50c1tpXS5waGFzZV0pO1xuXHRcdH1cblx0fVxuXG5cdHVwZGF0ZUNhY2hlKHN0YXJ0OiBudW1iZXIsIGRhdGE6IFRbXSkge1xuXHRcdHRoaXMuaW5maW5pdGVDYWNoZSA9IHt9O1xuXHRcdGNvbnN0IGwgPSBkYXRhLmxlbmd0aDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0dGhpcy5pbmZpbml0ZUNhY2hlW3N0YXJ0KytdID0gZGF0YVtpXTtcblx0XHR9XG5cdFx0dGhpcy51cGRhdGVDb250ZW50KHRoaXMuaW5maW5pdGVFbGVtZW50cyk7XG5cdH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLFNBQVFBLFlBQVIsUUFBMkIsUUFBM0I7QUFFQSxTQUFRQyxVQUFSLEVBQW9CQyxRQUFwQixFQUE4QkMsUUFBOUIsUUFBNkMsTUFBN0M7SUFXcUJDLGtCLGFBQU4sTUFBTUEsa0JBQU4sU0FBb0NKLFlBQXBDLENBQWlEO0VBYS9EO0FBQ0Q7QUFDQTtFQUM0QixJQUFiSyxh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