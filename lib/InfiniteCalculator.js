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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9JbmZpbml0ZUNhbGN1bGF0b3IudHMiXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwib2JzZXJ2YWJsZSIsImNvbXB1dGVkIiwicmVhY3Rpb24iLCJJbmZpbml0ZUNhbGN1bGF0b3IiLCJpbmZpbml0ZVdpZHRoIiwiaW5maW5pdGVMZW5ndGgiLCJpbmZpbml0ZUVsZW1lbnRXaWR0aCIsImluZmluaXRlRWxlbWVudHMiLCJsZW5ndGgiLCJpbmZpbml0ZUNhY2hlQnVmZmVyIiwiTWF0aCIsInJvdW5kIiwiY2FjaGVTaXplIiwiZWxlbWVudHNQZXJQYWdlIiwiY2VpbCIsIndyYXBwZXJXaWR0aCIsImluZmluaXRlVXBwZXJCdWZmZXJTaXplIiwiZmxvb3IiLCJmaXJzdEVsZW1lbnRGdWxseVZpc2libGUiLCJ4IiwibWlub3JQaGFzZSIsIm1ham9yUGhhc2UiLCJtYWpvclBoYXNlRW5kIiwicGhhc2UiLCJjYWNoZVBoYXNlIiwiZGF0YVN0YXJ0IiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwiZGF0YXNldCIsImluZmluaXRlTGltaXQiLCJkaXNwb3NlcnMiLCJwdXNoIiwidXBkYXRlcyIsInJlb3JkZXJJbmZpbml0ZSIsInVwZGF0ZUNvbnRlbnQiLCJzY2hlZHVsZXIiLCJjYiIsInVwZGF0ZURhdGFzZXQiLCJ0aGVuIiwidmFsdWUiLCJ1cGRhdGVDYWNoZSIsImRpc3Bvc2UiLCJmb3JFYWNoIiwiZiIsImkiLCJsZWZ0IiwiX3BoYXNlIiwidXBkYXRlTGVmdCIsImVsZW1lbnRzIiwiaW5maW5pdGVDYWNoZSIsImwiLCJ1cGRhdGVEYXRhIiwic3RhcnQiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsU0FBUUEsWUFBUixRQUEyQixRQUEzQjtBQUVBLFNBQVFDLFVBQVIsRUFBb0JDLFFBQXBCLEVBQThCQyxRQUE5QixRQUE2QyxNQUE3QztJQVdxQkMsa0Isc0JBQU4sTUFBTUEsa0JBQU4sU0FBb0NKLFlBQXBDLENBQWlEO0FBYS9EOzs7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RUFBdUJOLENBQUMsRUFBeEIsRUFBNEI7QUFDM0IsV0FBS0ssYUFBTCxDQUFtQkcsS0FBSyxFQUF4QixJQUE4QkMsSUFBSSxDQUFDVCxDQUFELENBQWxDO0FBQ0E7O0FBQ0QsU0FBS1YsYUFBTCxDQUFtQixLQUFLM0IsZ0JBQXhCO0FBQ0E7O0FBM004RCxDLDJFQUM5RFAsVTs7Ozs7V0FBdUIsQzs7aUZBQ3ZCQSxVOzs7OztXQUFtQyxDOzt3RkFDbkNBLFU7Ozs7O1dBQTBDLEM7O29GQUMxQ0EsVTs7Ozs7V0FBb0QsRTs7Z0ZBQ3BEQSxVOzs7OztXQUFrQyxDOzs2RUFDbENBLFU7Ozs7O1dBQStCLEM7O2tFQVUvQkMsUSx5SkFPQUEsUSwrSkFPQUEsUSxnS0FPQUEsUSxvS0FPQUEsUSw2S0FPQUEsUSxnS0FPQUEsUSxrSkFPQUEsUSxxSkFPQUEsUSxnSkFPQUEsUSw2SUFJQUEsUSxpSkFJQUEsUTtTQXZGbUJFLGtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFdmVudEVtaXR0ZXJ9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgSW5maW5pdGVFbGVtZW50IGZyb20gJy4vSW5maW5pdGVFbGVtZW50JztcbmltcG9ydCB7b2JzZXJ2YWJsZSwgY29tcHV0ZWQsIHJlYWN0aW9ufSBmcm9tICdtb2J4JztcblxudHlwZSBEYXRhU2V0Rm48VD4gPSAoc3RhcnQ6IG51bWJlciwgY291bnQ6IG51bWJlcikgPT4gUHJvbWlzZTxUW10+O1xuXG5pbnRlcmZhY2UgaVNjcm9sbE9wdGlvbnM8VD4ge1xuXHRpbmZpbml0ZUxpbWl0OiBudW1iZXI7XG5cdGluZmluaXRlRWxlbWVudHM6IEluZmluaXRlRWxlbWVudDxUPltdO1xuXHRjYWNoZVNpemU6IG51bWJlcjtcblx0ZGF0YXNldDogRGF0YVNldEZuPFQ+O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmZpbml0ZUNhbGN1bGF0b3I8VD4gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXHRAb2JzZXJ2YWJsZSB4OiBudW1iZXIgPSAwO1xuXHRAb2JzZXJ2YWJsZSBpbmZpbml0ZUxpbWl0OiBudW1iZXIgPSAwO1xuXHRAb2JzZXJ2YWJsZSBpbmZpbml0ZUVsZW1lbnRXaWR0aDogbnVtYmVyID0gMDtcblx0QG9ic2VydmFibGUgaW5maW5pdGVFbGVtZW50czogSW5maW5pdGVFbGVtZW50PFQ+W10gPSBbXTtcblx0QG9ic2VydmFibGUgd3JhcHBlcldpZHRoOiBudW1iZXIgPSAwO1xuXHRAb2JzZXJ2YWJsZSBjYWNoZVNpemU6IG51bWJlciA9IDQ7XG5cdGRhdGFzZXQ6IERhdGFTZXRGbjxUPjtcblxuXHRpbmZpbml0ZUNhY2hlOiB7XG5cdFx0W2tleTogc3RyaW5nXTogVDtcblx0fSB8IG51bGwgPSBudWxsO1xuXG5cdC8qKlxuXHQgKiBUaGUgd2lkdGggb2YgYWxsIHRoZSBpbmZpbml0ZSBlbGVtZW50cyBwdXQgdG9nZXRoZXIuXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBpbmZpbml0ZVdpZHRoKCkge1xuXHRcdHJldHVybiB0aGlzLmluZmluaXRlTGVuZ3RoICogdGhpcy5pbmZpbml0ZUVsZW1lbnRXaWR0aDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdG90YWwgbnVtYmVyIG9mIGluZmluaXRlIGVsZW1lbnRzLlxuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgaW5maW5pdGVMZW5ndGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaW5maW5pdGVFbGVtZW50cy5sZW5ndGg7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGNhY2hlIHNpemUgZGl2aWRpZWQgYnkgNC5cblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IGluZmluaXRlQ2FjaGVCdWZmZXIoKSB7XG5cdFx0cmV0dXJuIE1hdGgucm91bmQodGhpcy5jYWNoZVNpemUgLyA0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgdG90YWwgbnVtYmVyIG9mIGVsZW1lbnRzIHRoYXQgZml0IHdpdGhpbiBvdXIgd3JhcHBlci5cblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IGVsZW1lbnRzUGVyUGFnZSgpIHtcblx0XHRyZXR1cm4gTWF0aC5jZWlsKHRoaXMud3JhcHBlcldpZHRoIC8gdGhpcy5pbmZpbml0ZUVsZW1lbnRXaWR0aCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGNvdW50IG9mIGVsZW1lbnRzIHRoYXQgZXhjZWVkIG91dHNpZGUgb3VyIHdyYXBwZXIsIGRpdmlkZWQgYnkgdHdvXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBpbmZpbml0ZVVwcGVyQnVmZmVyU2l6ZSgpIHtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcigodGhpcy5pbmZpbml0ZUxlbmd0aCAtIHRoaXMuZWxlbWVudHNQZXJQYWdlKSAvIDIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBpbmRleCBvZiB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IGlzIGZ1bGx5IHZpc2libGVcblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IGZpcnN0RWxlbWVudEZ1bGx5VmlzaWJsZSgpIHtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcigtdGhpcy54IC8gdGhpcy5pbmZpbml0ZUVsZW1lbnRXaWR0aCk7XG5cdH1cblxuXHQvKipcblx0ICogRnVydGhlc3QgbGVmdCBlbGVtZW50IGluZGV4IGJleW9uZCB0aGUgd3JhcHBlciBib3VuZHNcblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IG1pbm9yUGhhc2UoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZmlyc3RFbGVtZW50RnVsbHlWaXNpYmxlIC0gdGhpcy5pbmZpbml0ZVVwcGVyQnVmZmVyU2l6ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZWN0aW9uIGluZGV4IGJhc2VkIG9uIHRoZSBtaW5vciBwaGFzZS5cblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IG1ham9yUGhhc2UoKSB7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IodGhpcy5taW5vclBoYXNlIC8gdGhpcy5pbmZpbml0ZUxlbmd0aCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5kZXggb2YgdGhlIGVuZCBvZiB0aGUgc2VjdGlvblxuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgbWFqb3JQaGFzZUVuZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5tYWpvclBoYXNlICogdGhpcy5pbmZpbml0ZUxlbmd0aDtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgcGhhc2UoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWlub3JQaGFzZSAtIHRoaXMubWFqb3JQaGFzZUVuZDtcblx0fVxuXG5cdEBjb21wdXRlZCBnZXQgY2FjaGVQaGFzZSgpIHtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcih0aGlzLm1pbm9yUGhhc2UgLyB0aGlzLmluZmluaXRlQ2FjaGVCdWZmZXIpO1xuXHR9XG5cblx0QGNvbXB1dGVkIGdldCBkYXRhU3RhcnQoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdHRoaXMuY2FjaGVQaGFzZSAqIHRoaXMuaW5maW5pdGVDYWNoZUJ1ZmZlciAtXG5cdFx0XHR0aGlzLmluZmluaXRlQ2FjaGVCdWZmZXJcblx0XHQpO1xuXHR9XG5cblx0ZGlzcG9zZXJzOiAoKCkgPT4gdm9pZClbXSA9IFtdO1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IGlTY3JvbGxPcHRpb25zPFQ+KSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLmluZmluaXRlRWxlbWVudHMgPSBvcHRpb25zLmluZmluaXRlRWxlbWVudHM7XG5cdFx0dGhpcy5kYXRhc2V0ID0gb3B0aW9ucy5kYXRhc2V0O1xuXHRcdHRoaXMuY2FjaGVTaXplID0gb3B0aW9ucy5jYWNoZVNpemU7XG5cdFx0dGhpcy5pbmZpbml0ZUxpbWl0ID0gb3B0aW9ucy5pbmZpbml0ZUxpbWl0O1xuXHRcdHRoaXMuZGlzcG9zZXJzLnB1c2goXG5cdFx0XHRyZWFjdGlvbihcblx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHR1cGRhdGVzOiB0aGlzLnJlb3JkZXJJbmZpbml0ZSgpLFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH0sXG5cdFx0XHRcdCh7dXBkYXRlc30pID0+IHtcblx0XHRcdFx0XHRpZiAodXBkYXRlcykge1xuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGVDb250ZW50KHVwZGF0ZXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHNjaGVkdWxlcihjYikge1xuXHRcdFx0XHRcdFx0Y2IoKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0KSxcblx0XHQpO1xuXG5cdFx0dGhpcy5kaXNwb3NlcnMucHVzaChcblx0XHRcdHJlYWN0aW9uKFxuXHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdGRhdGFzZXQ6IHRoaXMuZGF0YXNldCxcblx0XHRcdFx0XHRcdGRhdGFTdGFydDogdGhpcy5kYXRhU3RhcnQsXG5cdFx0XHRcdFx0XHRjYWNoZVNpemU6IHRoaXMuY2FjaGVTaXplLFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH0sXG5cdFx0XHRcdCh7ZGF0YXNldCwgZGF0YVN0YXJ0LCBjYWNoZVNpemV9KSA9PiB7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVEYXRhc2V0KCk7XG5cdFx0XHRcdH0sXG5cdFx0XHQpLFxuXHRcdCk7XG5cdFx0XG5cdFx0dGhpcy51cGRhdGVEYXRhc2V0KCk7XG5cdH1cblx0XG5cdHVwZGF0ZURhdGFzZXQoZGF0YXNldD86IERhdGFTZXRGbjxUPiB8IG51bGwpe1xuXHRcdGlmKGRhdGFzZXQgIT0gbnVsbCl7XG5cdFx0XHR0aGlzLmRhdGFzZXQgPSBkYXRhc2V0O1xuXHRcdH1cblx0XHRjb25zdCBkYXRhU3RhcnQgPSB0aGlzLmRhdGFTdGFydDtcblx0XHR0aGlzLmRhdGFzZXQoZGF0YVN0YXJ0LCB0aGlzLmNhY2hlU2l6ZSkudGhlbih2YWx1ZSA9PiB7XG5cdFx0XHR0aGlzLnVwZGF0ZUNhY2hlKGRhdGFTdGFydCwgdmFsdWUpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZGlzcG9zZSgpIHtcblx0XHR0aGlzLmRpc3Bvc2Vycy5mb3JFYWNoKGYgPT4gZigpKTtcblx0fVxuXG5cdHJlb3JkZXJJbmZpbml0ZSgpIHtcblx0XHRpZiAodGhpcy5pbmZpbml0ZUVsZW1lbnRXaWR0aCA8PSAwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGxldCBpID0gMDtcblx0XHRsZXQgdXBkYXRlcyA9IFtdO1xuXHRcdHdoaWxlIChpIDwgdGhpcy5pbmZpbml0ZUxlbmd0aCkge1xuXHRcdFx0bGV0IGxlZnQgPVxuXHRcdFx0XHRpICogdGhpcy5pbmZpbml0ZUVsZW1lbnRXaWR0aCArXG5cdFx0XHRcdHRoaXMubWFqb3JQaGFzZSAqIHRoaXMuaW5maW5pdGVXaWR0aDtcblxuXHRcdFx0aWYgKHRoaXMucGhhc2UgLSB0aGlzLmVsZW1lbnRzUGVyUGFnZSA+IGkpIHtcblx0XHRcdFx0bGVmdCArPSB0aGlzLmluZmluaXRlRWxlbWVudFdpZHRoICogdGhpcy5pbmZpbml0ZUxlbmd0aDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuaW5maW5pdGVFbGVtZW50c1tpXS5sZWZ0ICE9PSBsZWZ0KSB7XG5cdFx0XHRcdGxldCBfcGhhc2UgPSBsZWZ0IC8gdGhpcy5pbmZpbml0ZUVsZW1lbnRXaWR0aDtcblx0XHRcdFx0dGhpcy5pbmZpbml0ZUVsZW1lbnRzW2ldLnBoYXNlID0gX3BoYXNlO1xuXG5cdFx0XHRcdGlmIChfcGhhc2UgPCB0aGlzLmluZmluaXRlTGltaXQpIHtcblx0XHRcdFx0XHR0aGlzLmluZmluaXRlRWxlbWVudHNbaV0udXBkYXRlTGVmdChsZWZ0KTtcblx0XHRcdFx0XHR1cGRhdGVzLnB1c2godGhpcy5pbmZpbml0ZUVsZW1lbnRzW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpKys7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVwZGF0ZXM7XG5cdH1cblxuXHR1cGRhdGVDb250ZW50KGVsZW1lbnRzOiBJbmZpbml0ZUVsZW1lbnQ8VD5bXSkge1xuXHRcdGlmICh0aGlzLmluZmluaXRlQ2FjaGUgPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGwgPSBlbGVtZW50cy5sZW5ndGg7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdGVsZW1lbnRzW2ldLnVwZGF0ZURhdGEodGhpcy5pbmZpbml0ZUNhY2hlW2VsZW1lbnRzW2ldLnBoYXNlXSk7XG5cdFx0fVxuXHR9XG5cblx0dXBkYXRlQ2FjaGUoc3RhcnQ6IG51bWJlciwgZGF0YTogVFtdKSB7XG5cdFx0dGhpcy5pbmZpbml0ZUNhY2hlID0ge307XG5cdFx0Y29uc3QgbCA9IGRhdGEubGVuZ3RoO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHR0aGlzLmluZmluaXRlQ2FjaGVbc3RhcnQrK10gPSBkYXRhW2ldO1xuXHRcdH1cblx0XHR0aGlzLnVwZGF0ZUNvbnRlbnQodGhpcy5pbmZpbml0ZUVsZW1lbnRzKTtcblx0fVxufVxuIl19