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
      dataset(dataStart, cacheSize).then(value => this.updateCache(dataStart, value));
    }));
    this.dataset(this.dataStart, this.cacheSize).then(value => this.updateCache(this.dataStart, value));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9JbmZpbml0ZUNhbGN1bGF0b3IudHMiXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwib2JzZXJ2YWJsZSIsImNvbXB1dGVkIiwicmVhY3Rpb24iLCJJbmZpbml0ZUNhbGN1bGF0b3IiLCJpbmZpbml0ZVdpZHRoIiwiaW5maW5pdGVMZW5ndGgiLCJpbmZpbml0ZUVsZW1lbnRXaWR0aCIsImluZmluaXRlRWxlbWVudHMiLCJsZW5ndGgiLCJpbmZpbml0ZUNhY2hlQnVmZmVyIiwiTWF0aCIsInJvdW5kIiwiY2FjaGVTaXplIiwiZWxlbWVudHNQZXJQYWdlIiwiY2VpbCIsIndyYXBwZXJXaWR0aCIsImluZmluaXRlVXBwZXJCdWZmZXJTaXplIiwiZmxvb3IiLCJmaXJzdEVsZW1lbnRGdWxseVZpc2libGUiLCJ4IiwibWlub3JQaGFzZSIsIm1ham9yUGhhc2UiLCJtYWpvclBoYXNlRW5kIiwicGhhc2UiLCJjYWNoZVBoYXNlIiwiZGF0YVN0YXJ0IiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwiZGF0YXNldCIsImluZmluaXRlTGltaXQiLCJkaXNwb3NlcnMiLCJwdXNoIiwidXBkYXRlcyIsInJlb3JkZXJJbmZpbml0ZSIsInVwZGF0ZUNvbnRlbnQiLCJzY2hlZHVsZXIiLCJjYiIsInRoZW4iLCJ2YWx1ZSIsInVwZGF0ZUNhY2hlIiwiZGlzcG9zZSIsImZvckVhY2giLCJmIiwiaSIsImxlZnQiLCJfcGhhc2UiLCJ1cGRhdGVMZWZ0IiwiZWxlbWVudHMiLCJpbmZpbml0ZUNhY2hlIiwibCIsInVwZGF0ZURhdGEiLCJzdGFydCIsImRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxTQUFRQSxZQUFSLFFBQTJCLFFBQTNCO0FBRUEsU0FBUUMsVUFBUixFQUFvQkMsUUFBcEIsRUFBOEJDLFFBQTlCLFFBQTZELE1BQTdEO0lBU3FCQyxrQixzQkFBTixNQUFNQSxrQkFBTixTQUFvQ0osWUFBcEMsQ0FBaUQ7QUFhL0Q7OztBQUdBLE1BQWNLLGFBQWQs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QUksQ0FBQ1QsQ0FBRCxDQUFsQztBQUNBOztBQUNELFNBQUtULGFBQUwsQ0FBbUIsS0FBSzNCLGdCQUF4QjtBQUNBOztBQXJNOEQsQywyRUFDOURQLFU7Ozs7O1dBQXVCLEM7O2lGQUN2QkEsVTs7Ozs7V0FBbUMsQzs7d0ZBQ25DQSxVOzs7OztXQUEwQyxDOztvRkFDMUNBLFU7Ozs7O1dBQW9ELEU7O2dGQUNwREEsVTs7Ozs7V0FBa0MsQzs7NkVBQ2xDQSxVOzs7OztXQUErQixDOztrRUFVL0JDLFEseUpBT0FBLFEsK0pBT0FBLFEsZ0tBT0FBLFEsb0tBT0FBLFEsNktBT0FBLFEsZ0tBT0FBLFEsa0pBT0FBLFEscUpBT0FBLFEsZ0pBT0FBLFEsNklBSUFBLFEsaUpBSUFBLFE7U0F2Rm1CRSxrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IEluZmluaXRlRWxlbWVudCBmcm9tICcuL0luZmluaXRlRWxlbWVudCc7XG5pbXBvcnQge29ic2VydmFibGUsIGNvbXB1dGVkLCByZWFjdGlvbiwgdHJhY2UsIG9ic2VydmV9IGZyb20gJ21vYngnO1xuXG5pbnRlcmZhY2UgaVNjcm9sbE9wdGlvbnM8VD4ge1xuXHRpbmZpbml0ZUxpbWl0OiBudW1iZXI7XG5cdGluZmluaXRlRWxlbWVudHM6IEluZmluaXRlRWxlbWVudDxUPltdO1xuXHRjYWNoZVNpemU6IG51bWJlcjtcblx0ZGF0YXNldDogKHN0YXJ0OiBudW1iZXIsIGNvdW50OiBudW1iZXIpID0+IFByb21pc2U8VFtdPjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5maW5pdGVDYWxjdWxhdG9yPFQ+IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblx0QG9ic2VydmFibGUgeDogbnVtYmVyID0gMDtcblx0QG9ic2VydmFibGUgaW5maW5pdGVMaW1pdDogbnVtYmVyID0gMDtcblx0QG9ic2VydmFibGUgaW5maW5pdGVFbGVtZW50V2lkdGg6IG51bWJlciA9IDA7XG5cdEBvYnNlcnZhYmxlIGluZmluaXRlRWxlbWVudHM6IEluZmluaXRlRWxlbWVudDxUPltdID0gW107XG5cdEBvYnNlcnZhYmxlIHdyYXBwZXJXaWR0aDogbnVtYmVyID0gMDtcblx0QG9ic2VydmFibGUgY2FjaGVTaXplOiBudW1iZXIgPSA0O1xuXHRkYXRhc2V0OiAoc3RhcnQ6IG51bWJlciwgY291bnQ6IG51bWJlcikgPT4gUHJvbWlzZTxUW10+O1xuXG5cdGluZmluaXRlQ2FjaGU6IHtcblx0XHRba2V5OiBzdHJpbmddOiBUO1xuXHR9IHwgbnVsbCA9IG51bGw7XG5cblx0LyoqXG5cdCAqIFRoZSB3aWR0aCBvZiBhbGwgdGhlIGluZmluaXRlIGVsZW1lbnRzIHB1dCB0b2dldGhlci5cblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IGluZmluaXRlV2lkdGgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaW5maW5pdGVMZW5ndGggKiB0aGlzLmluZmluaXRlRWxlbWVudFdpZHRoO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0b3RhbCBudW1iZXIgb2YgaW5maW5pdGUgZWxlbWVudHMuXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBpbmZpbml0ZUxlbmd0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5pbmZpbml0ZUVsZW1lbnRzLmxlbmd0aDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgY2FjaGUgc2l6ZSBkaXZpZGllZCBieSA0LlxuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgaW5maW5pdGVDYWNoZUJ1ZmZlcigpIHtcblx0XHRyZXR1cm4gTWF0aC5yb3VuZCh0aGlzLmNhY2hlU2l6ZSAvIDQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSB0b3RhbCBudW1iZXIgb2YgZWxlbWVudHMgdGhhdCBmaXQgd2l0aGluIG91ciB3cmFwcGVyLlxuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgZWxlbWVudHNQZXJQYWdlKCkge1xuXHRcdHJldHVybiBNYXRoLmNlaWwodGhpcy53cmFwcGVyV2lkdGggLyB0aGlzLmluZmluaXRlRWxlbWVudFdpZHRoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgY291bnQgb2YgZWxlbWVudHMgdGhhdCBleGNlZWQgb3V0c2lkZSBvdXIgd3JhcHBlciwgZGl2aWRlZCBieSB0d29cblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IGluZmluaXRlVXBwZXJCdWZmZXJTaXplKCkge1xuXHRcdHJldHVybiBNYXRoLmZsb29yKCh0aGlzLmluZmluaXRlTGVuZ3RoIC0gdGhpcy5lbGVtZW50c1BlclBhZ2UpIC8gMik7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGluZGV4IG9mIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgaXMgZnVsbHkgdmlzaWJsZVxuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgZmlyc3RFbGVtZW50RnVsbHlWaXNpYmxlKCkge1xuXHRcdHJldHVybiBNYXRoLmZsb29yKC10aGlzLnggLyB0aGlzLmluZmluaXRlRWxlbWVudFdpZHRoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGdXJ0aGVzdCBsZWZ0IGVsZW1lbnQgaW5kZXggYmV5b25kIHRoZSB3cmFwcGVyIGJvdW5kc1xuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgbWlub3JQaGFzZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5maXJzdEVsZW1lbnRGdWxseVZpc2libGUgLSB0aGlzLmluZmluaXRlVXBwZXJCdWZmZXJTaXplO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlY3Rpb24gaW5kZXggYmFzZWQgb24gdGhlIG1pbm9yIHBoYXNlLlxuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgbWFqb3JQaGFzZSgpIHtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcih0aGlzLm1pbm9yUGhhc2UgLyB0aGlzLmluZmluaXRlTGVuZ3RoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRleCBvZiB0aGUgZW5kIG9mIHRoZSBzZWN0aW9uXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBtYWpvclBoYXNlRW5kKCkge1xuXHRcdHJldHVybiB0aGlzLm1ham9yUGhhc2UgKiB0aGlzLmluZmluaXRlTGVuZ3RoO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBwaGFzZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5taW5vclBoYXNlIC0gdGhpcy5tYWpvclBoYXNlRW5kO1xuXHR9XG5cblx0QGNvbXB1dGVkIGdldCBjYWNoZVBoYXNlKCkge1xuXHRcdHJldHVybiBNYXRoLmZsb29yKHRoaXMubWlub3JQaGFzZSAvIHRoaXMuaW5maW5pdGVDYWNoZUJ1ZmZlcik7XG5cdH1cblxuXHRAY29tcHV0ZWQgZ2V0IGRhdGFTdGFydCgpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0dGhpcy5jYWNoZVBoYXNlICogdGhpcy5pbmZpbml0ZUNhY2hlQnVmZmVyIC1cblx0XHRcdHRoaXMuaW5maW5pdGVDYWNoZUJ1ZmZlclxuXHRcdCk7XG5cdH1cblxuXHRkaXNwb3NlcnM6ICgoKSA9PiB2b2lkKVtdID0gW107XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczogaVNjcm9sbE9wdGlvbnM8VD4pIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuaW5maW5pdGVFbGVtZW50cyA9IG9wdGlvbnMuaW5maW5pdGVFbGVtZW50cztcblx0XHR0aGlzLmRhdGFzZXQgPSBvcHRpb25zLmRhdGFzZXQ7XG5cdFx0dGhpcy5jYWNoZVNpemUgPSBvcHRpb25zLmNhY2hlU2l6ZTtcblx0XHR0aGlzLmluZmluaXRlTGltaXQgPSBvcHRpb25zLmluZmluaXRlTGltaXQ7XG5cdFx0dGhpcy5kaXNwb3NlcnMucHVzaChcblx0XHRcdHJlYWN0aW9uKFxuXHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHVwZGF0ZXM6IHRoaXMucmVvcmRlckluZmluaXRlKCksXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSxcblx0XHRcdFx0KHt1cGRhdGVzfSkgPT4ge1xuXHRcdFx0XHRcdGlmICh1cGRhdGVzKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZUNvbnRlbnQodXBkYXRlcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c2NoZWR1bGVyKGNiKSB7XG5cdFx0XHRcdFx0XHRjYigpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0sXG5cdFx0XHQpLFxuXHRcdCk7XG5cblx0XHR0aGlzLmRpc3Bvc2Vycy5wdXNoKFxuXHRcdFx0cmVhY3Rpb24oXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0ZGF0YXNldDogdGhpcy5kYXRhc2V0LFxuXHRcdFx0XHRcdFx0ZGF0YVN0YXJ0OiB0aGlzLmRhdGFTdGFydCxcblx0XHRcdFx0XHRcdGNhY2hlU2l6ZTogdGhpcy5jYWNoZVNpemUsXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSxcblx0XHRcdFx0KHtkYXRhc2V0LCBkYXRhU3RhcnQsIGNhY2hlU2l6ZX0pID0+IHtcblx0XHRcdFx0XHRkYXRhc2V0KGRhdGFTdGFydCwgY2FjaGVTaXplKS50aGVuKHZhbHVlID0+XG5cdFx0XHRcdFx0XHR0aGlzLnVwZGF0ZUNhY2hlKGRhdGFTdGFydCwgdmFsdWUpLFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0sXG5cdFx0XHQpLFxuXHRcdCk7XG5cblx0XHR0aGlzLmRhdGFzZXQodGhpcy5kYXRhU3RhcnQsIHRoaXMuY2FjaGVTaXplKS50aGVuKHZhbHVlID0+XG5cdFx0XHR0aGlzLnVwZGF0ZUNhY2hlKHRoaXMuZGF0YVN0YXJ0LCB2YWx1ZSksXG5cdFx0KTtcblx0fVxuXG5cdGRpc3Bvc2UoKSB7XG5cdFx0dGhpcy5kaXNwb3NlcnMuZm9yRWFjaChmID0+IGYoKSk7XG5cdH1cblxuXHRyZW9yZGVySW5maW5pdGUoKSB7XG5cdFx0aWYgKHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGggPD0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgaSA9IDA7XG5cdFx0bGV0IHVwZGF0ZXMgPSBbXTtcblx0XHR3aGlsZSAoaSA8IHRoaXMuaW5maW5pdGVMZW5ndGgpIHtcblx0XHRcdGxldCBsZWZ0ID1cblx0XHRcdFx0aSAqIHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGggK1xuXHRcdFx0XHR0aGlzLm1ham9yUGhhc2UgKiB0aGlzLmluZmluaXRlV2lkdGg7XG5cblx0XHRcdGlmICh0aGlzLnBoYXNlIC0gdGhpcy5lbGVtZW50c1BlclBhZ2UgPiBpKSB7XG5cdFx0XHRcdGxlZnQgKz0gdGhpcy5pbmZpbml0ZUVsZW1lbnRXaWR0aCAqIHRoaXMuaW5maW5pdGVMZW5ndGg7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLmluZmluaXRlRWxlbWVudHNbaV0ubGVmdCAhPT0gbGVmdCkge1xuXHRcdFx0XHRsZXQgX3BoYXNlID0gbGVmdCAvIHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGg7XG5cdFx0XHRcdHRoaXMuaW5maW5pdGVFbGVtZW50c1tpXS5waGFzZSA9IF9waGFzZTtcblxuXHRcdFx0XHRpZiAoX3BoYXNlIDwgdGhpcy5pbmZpbml0ZUxpbWl0KSB7XG5cdFx0XHRcdFx0dGhpcy5pbmZpbml0ZUVsZW1lbnRzW2ldLnVwZGF0ZUxlZnQobGVmdCk7XG5cdFx0XHRcdFx0dXBkYXRlcy5wdXNoKHRoaXMuaW5maW5pdGVFbGVtZW50c1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aSsrO1xuXHRcdH1cblxuXHRcdHJldHVybiB1cGRhdGVzO1xuXHR9XG5cblx0dXBkYXRlQ29udGVudChlbGVtZW50czogSW5maW5pdGVFbGVtZW50PFQ+W10pIHtcblx0XHRpZiAodGhpcy5pbmZpbml0ZUNhY2hlID09IG51bGwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBsID0gZWxlbWVudHMubGVuZ3RoO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRlbGVtZW50c1tpXS51cGRhdGVEYXRhKHRoaXMuaW5maW5pdGVDYWNoZVtlbGVtZW50c1tpXS5waGFzZV0pO1xuXHRcdH1cblx0fVxuXG5cdHVwZGF0ZUNhY2hlKHN0YXJ0OiBudW1iZXIsIGRhdGE6IFRbXSkge1xuXHRcdHRoaXMuaW5maW5pdGVDYWNoZSA9IHt9O1xuXHRcdGNvbnN0IGwgPSBkYXRhLmxlbmd0aDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0dGhpcy5pbmZpbml0ZUNhY2hlW3N0YXJ0KytdID0gZGF0YVtpXTtcblx0XHR9XG5cdFx0dGhpcy51cGRhdGVDb250ZW50KHRoaXMuaW5maW5pdGVFbGVtZW50cyk7XG5cdH1cbn1cbiJdfQ==