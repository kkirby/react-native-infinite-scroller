var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

import { EventEmitter } from 'events';
import { observable, computed, reaction } from 'mobx';
let InfiniteCalculator = (_class = (_temp = class InfiniteCalculator extends EventEmitter {
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

    this.infiniteElements = options.infiniteElements;
    this.dataset = options.dataset;
    this.cacheSize = options.cacheSize;
    this.infiniteLimit = options.infiniteLimit;
    reaction(() => {
      return {
        updates: this.reorderInfinite()
      };
    }, ({
      updates
    }) => {
      if (updates) {
        this.updateContent(updates);
      }
    });
    reaction(() => {
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
      dataset(dataStart, cacheSize).then(value => this.updateCache(dataStart, value));
    });
    this.dataset(this.dataStart, this.cacheSize).then(value => this.updateCache(this.dataStart, value));
  }

  reorderInfinite() {
    if (this.infiniteElementWidth <= 0) {
      return;
    }

    let i = 0;
    let updates = [];

    while (i < this.infiniteLength) {
      let left = i * this.infiniteElementWidth + this.majorPhase * this.infiniteWidth;

      if (this.phase > i) {
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

}, _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "x", [observable], {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9JbmZpbml0ZUNhbGN1bGF0b3IudHMiXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwib2JzZXJ2YWJsZSIsImNvbXB1dGVkIiwicmVhY3Rpb24iLCJJbmZpbml0ZUNhbGN1bGF0b3IiLCJpbmZpbml0ZVdpZHRoIiwiaW5maW5pdGVMZW5ndGgiLCJpbmZpbml0ZUVsZW1lbnRXaWR0aCIsImluZmluaXRlRWxlbWVudHMiLCJsZW5ndGgiLCJpbmZpbml0ZUNhY2hlQnVmZmVyIiwiTWF0aCIsInJvdW5kIiwiY2FjaGVTaXplIiwiZWxlbWVudHNQZXJQYWdlIiwiY2VpbCIsIndyYXBwZXJXaWR0aCIsImluZmluaXRlVXBwZXJCdWZmZXJTaXplIiwiZmxvb3IiLCJmaXJzdEVsZW1lbnRGdWxseVZpc2libGUiLCJ4IiwibWlub3JQaGFzZSIsIm1ham9yUGhhc2UiLCJtYWpvclBoYXNlRW5kIiwicGhhc2UiLCJjYWNoZVBoYXNlIiwiZGF0YVN0YXJ0IiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwiZGF0YXNldCIsImluZmluaXRlTGltaXQiLCJ1cGRhdGVzIiwicmVvcmRlckluZmluaXRlIiwidXBkYXRlQ29udGVudCIsInRoZW4iLCJ2YWx1ZSIsInVwZGF0ZUNhY2hlIiwiaSIsImxlZnQiLCJfcGhhc2UiLCJ1cGRhdGVMZWZ0IiwicHVzaCIsImVsZW1lbnRzIiwiaW5maW5pdGVDYWNoZSIsImwiLCJ1cGRhdGVEYXRhIiwic3RhcnQiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsU0FBUUEsWUFBUixRQUEyQixRQUEzQjtBQUVBLFNBQVFDLFVBQVIsRUFBb0JDLFFBQXBCLEVBQThCQyxRQUE5QixRQUE2QyxNQUE3QztJQVNxQkMsa0Isc0JBQU4sTUFBTUEsa0JBQU4sU0FBb0NKLFlBQXBDLENBQWlEO0FBYS9EOzs7QUFHQSxNQUFjSyxhQUFkLEdBQThCO0FBQzdCLFdBQU8sS0FBS0MsY0FBTCxHQUFzQixLQUFLQyxvQkFBbEM7QUFDQTtB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QU9BQSxRLGdKQU9BQSxRLDZJQUlBQSxRLGlKQUlBQSxRO1NBdkZtQkUsa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0V2ZW50RW1pdHRlcn0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCBJbmZpbml0ZUVsZW1lbnQgZnJvbSAnLi9JbmZpbml0ZUVsZW1lbnQnO1xuaW1wb3J0IHtvYnNlcnZhYmxlLCBjb21wdXRlZCwgcmVhY3Rpb259IGZyb20gJ21vYngnO1xuXG5pbnRlcmZhY2UgaVNjcm9sbE9wdGlvbnM8VD4ge1xuXHRpbmZpbml0ZUxpbWl0OiBudW1iZXI7XG5cdGluZmluaXRlRWxlbWVudHM6IEluZmluaXRlRWxlbWVudDxUPltdO1xuXHRjYWNoZVNpemU6IG51bWJlcjtcblx0ZGF0YXNldDogKHN0YXJ0OiBudW1iZXIsIGNvdW50OiBudW1iZXIpID0+IFByb21pc2U8VFtdPjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5maW5pdGVDYWxjdWxhdG9yPFQ+IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblx0QG9ic2VydmFibGUgeDogbnVtYmVyID0gMDtcblx0QG9ic2VydmFibGUgaW5maW5pdGVMaW1pdDogbnVtYmVyID0gMDtcblx0QG9ic2VydmFibGUgaW5maW5pdGVFbGVtZW50V2lkdGg6IG51bWJlciA9IDA7XG5cdEBvYnNlcnZhYmxlIGluZmluaXRlRWxlbWVudHM6IEluZmluaXRlRWxlbWVudDxUPltdID0gW107XG5cdEBvYnNlcnZhYmxlIHdyYXBwZXJXaWR0aDogbnVtYmVyID0gMDtcblx0QG9ic2VydmFibGUgY2FjaGVTaXplOiBudW1iZXIgPSA0O1xuXHRkYXRhc2V0OiAoc3RhcnQ6IG51bWJlciwgY291bnQ6IG51bWJlcikgPT4gUHJvbWlzZTxUW10+O1xuXG5cdGluZmluaXRlQ2FjaGU6IHtcblx0XHRba2V5OiBzdHJpbmddOiBUO1xuXHR9IHwgbnVsbCA9IG51bGw7XG5cblx0LyoqXG5cdCAqIFRoZSB3aWR0aCBvZiBhbGwgdGhlIGluZmluaXRlIGVsZW1lbnRzIHB1dCB0b2dldGhlci5cblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IGluZmluaXRlV2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaW5maW5pdGVMZW5ndGggKiB0aGlzLmluZmluaXRlRWxlbWVudFdpZHRoO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0b3RhbCBudW1iZXIgb2YgaW5maW5pdGUgZWxlbWVudHMuXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBpbmZpbml0ZUxlbmd0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5pbmZpbml0ZUVsZW1lbnRzLmxlbmd0aDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgY2FjaGUgc2l6ZSBkaXZpZGllZCBieSA0LlxuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgaW5maW5pdGVDYWNoZUJ1ZmZlcigpIHtcblx0XHRyZXR1cm4gTWF0aC5yb3VuZCh0aGlzLmNhY2hlU2l6ZSAvIDQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0b3RhbCBudW1iZXIgb2YgZWxlbWVudHMgdGhhdCBmaXQgd2l0aGluIG91ciB3cmFwcGVyLlxuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgZWxlbWVudHNQZXJQYWdlKCkge1xuXHRcdHJldHVybiBNYXRoLmNlaWwodGhpcy53cmFwcGVyV2lkdGggLyB0aGlzLmluZmluaXRlRWxlbWVudFdpZHRoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgY291bnQgb2YgZWxlbWVudHMgdGhhdCBleGNlZWQgb3V0c2lkZSBvdXIgd3JhcHBlciwgZGl2aWRlZCBieSB0d29cblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IGluZmluaXRlVXBwZXJCdWZmZXJTaXplKCkge1xuXHRcdHJldHVybiBNYXRoLmZsb29yKCh0aGlzLmluZmluaXRlTGVuZ3RoIC0gdGhpcy5lbGVtZW50c1BlclBhZ2UpIC8gMik7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGluZGV4IG9mIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgaXMgZnVsbHkgdmlzaWJsZVxuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgZmlyc3RFbGVtZW50RnVsbHlWaXNpYmxlKCkge1xuXHRcdHJldHVybiBNYXRoLmZsb29yKC10aGlzLnggLyB0aGlzLmluZmluaXRlRWxlbWVudFdpZHRoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGdXJ0aGVzdCBsZWZ0IGVsZW1lbnQgaW5kZXggYmV5b25kIHRoZSB3cmFwcGVyIGJvdW5kc1xuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgbWlub3JQaGFzZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5maXJzdEVsZW1lbnRGdWxseVZpc2libGUgLSB0aGlzLmluZmluaXRlVXBwZXJCdWZmZXJTaXplO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlY3Rpb24gaW5kZXggYmFzZWQgb24gdGhlIG1pbm9yIHBoYXNlLlxuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgbWFqb3JQaGFzZSgpIHtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcih0aGlzLm1pbm9yUGhhc2UgLyB0aGlzLmluZmluaXRlTGVuZ3RoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRleCBvZiB0aGUgZW5kIG9mIHRoZSBzZWN0aW9uXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBtYWpvclBoYXNlRW5kKCkge1xuXHRcdHJldHVybiB0aGlzLm1ham9yUGhhc2UgKiB0aGlzLmluZmluaXRlTGVuZ3RoO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBwaGFzZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5taW5vclBoYXNlIC0gdGhpcy5tYWpvclBoYXNlRW5kO1xuXHR9XG5cblx0QGNvbXB1dGVkIGdldCBjYWNoZVBoYXNlKCkge1xuXHRcdHJldHVybiBNYXRoLmZsb29yKHRoaXMubWlub3JQaGFzZSAvIHRoaXMuaW5maW5pdGVDYWNoZUJ1ZmZlcik7XG5cdH1cblxuXHRAY29tcHV0ZWQgZ2V0IGRhdGFTdGFydCgpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0dGhpcy5jYWNoZVBoYXNlICogdGhpcy5pbmZpbml0ZUNhY2hlQnVmZmVyIC0gdGhpcy5pbmZpbml0ZUNhY2hlQnVmZmVyXG5cdFx0KTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IGlTY3JvbGxPcHRpb25zPFQ+KSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLmluZmluaXRlRWxlbWVudHMgPSBvcHRpb25zLmluZmluaXRlRWxlbWVudHM7XG5cdFx0dGhpcy5kYXRhc2V0ID0gb3B0aW9ucy5kYXRhc2V0O1xuXHRcdHRoaXMuY2FjaGVTaXplID0gb3B0aW9ucy5jYWNoZVNpemU7XG5cdFx0dGhpcy5pbmZpbml0ZUxpbWl0ID0gb3B0aW9ucy5pbmZpbml0ZUxpbWl0O1xuXG5cdFx0cmVhY3Rpb24oXG5cdFx0XHQoKSA9PiB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dXBkYXRlczogdGhpcy5yZW9yZGVySW5maW5pdGUoKSxcblx0XHRcdFx0fTtcblx0XHRcdH0sXG5cdFx0XHQoe3VwZGF0ZXN9KSA9PiB7XG5cdFx0XHRcdGlmICh1cGRhdGVzKSB7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVDb250ZW50KHVwZGF0ZXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdCk7XG5cblx0XHRyZWFjdGlvbihcblx0XHRcdCgpID0+IHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRkYXRhc2V0OiB0aGlzLmRhdGFzZXQsXG5cdFx0XHRcdFx0ZGF0YVN0YXJ0OiB0aGlzLmRhdGFTdGFydCxcblx0XHRcdFx0XHRjYWNoZVNpemU6IHRoaXMuY2FjaGVTaXplLFxuXHRcdFx0XHR9O1xuXHRcdFx0fSxcblx0XHRcdCh7ZGF0YXNldCwgZGF0YVN0YXJ0LCBjYWNoZVNpemV9KSA9PiB7XG5cdFx0XHRcdGRhdGFzZXQoZGF0YVN0YXJ0LCBjYWNoZVNpemUpLnRoZW4odmFsdWUgPT5cblx0XHRcdFx0XHR0aGlzLnVwZGF0ZUNhY2hlKGRhdGFTdGFydCwgdmFsdWUpLFxuXHRcdFx0XHQpO1xuXHRcdFx0fSxcblx0XHQpO1xuXG5cdFx0dGhpcy5kYXRhc2V0KHRoaXMuZGF0YVN0YXJ0LCB0aGlzLmNhY2hlU2l6ZSkudGhlbih2YWx1ZSA9PlxuXHRcdFx0dGhpcy51cGRhdGVDYWNoZSh0aGlzLmRhdGFTdGFydCwgdmFsdWUpLFxuXHRcdCk7XG5cdH1cblxuXHRyZW9yZGVySW5maW5pdGUoKSB7XG5cdFx0aWYgKHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGggPD0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgaSA9IDA7XG5cdFx0bGV0IHVwZGF0ZXMgPSBbXTtcblx0XHR3aGlsZSAoaSA8IHRoaXMuaW5maW5pdGVMZW5ndGgpIHtcblx0XHRcdGxldCBsZWZ0ID1cblx0XHRcdFx0aSAqIHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGggKyB0aGlzLm1ham9yUGhhc2UgKiB0aGlzLmluZmluaXRlV2lkdGg7XG5cblx0XHRcdGlmICh0aGlzLnBoYXNlID4gaSkge1xuXHRcdFx0XHRsZWZ0ICs9IHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGggKiB0aGlzLmluZmluaXRlTGVuZ3RoO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5pbmZpbml0ZUVsZW1lbnRzW2ldLmxlZnQgIT09IGxlZnQpIHtcblx0XHRcdFx0bGV0IF9waGFzZSA9IGxlZnQgLyB0aGlzLmluZmluaXRlRWxlbWVudFdpZHRoO1xuXHRcdFx0XHR0aGlzLmluZmluaXRlRWxlbWVudHNbaV0ucGhhc2UgPSBfcGhhc2U7XG5cblx0XHRcdFx0aWYgKF9waGFzZSA8IHRoaXMuaW5maW5pdGVMaW1pdCkge1xuXHRcdFx0XHRcdHRoaXMuaW5maW5pdGVFbGVtZW50c1tpXS51cGRhdGVMZWZ0KGxlZnQpO1xuXHRcdFx0XHRcdHVwZGF0ZXMucHVzaCh0aGlzLmluZmluaXRlRWxlbWVudHNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGkrKztcblx0XHR9XG5cblx0XHRyZXR1cm4gdXBkYXRlcztcblx0fVxuXG5cdHVwZGF0ZUNvbnRlbnQoZWxlbWVudHM6IEluZmluaXRlRWxlbWVudDxUPltdKSB7XG5cdFx0aWYgKHRoaXMuaW5maW5pdGVDYWNoZSA9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgbCA9IGVsZW1lbnRzLmxlbmd0aDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0ZWxlbWVudHNbaV0udXBkYXRlRGF0YSh0aGlzLmluZmluaXRlQ2FjaGVbZWxlbWVudHNbaV0ucGhhc2VdKTtcblx0XHR9XG5cdH1cblxuXHR1cGRhdGVDYWNoZShzdGFydDogbnVtYmVyLCBkYXRhOiBUW10pIHtcblx0XHR0aGlzLmluZmluaXRlQ2FjaGUgPSB7fTtcblx0XHRjb25zdCBsID0gZGF0YS5sZW5ndGg7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdHRoaXMuaW5maW5pdGVDYWNoZVtzdGFydCsrXSA9IGRhdGFbaV07XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRlQ29udGVudCh0aGlzLmluZmluaXRlRWxlbWVudHMpO1xuXHR9XG59XG4iXX0=