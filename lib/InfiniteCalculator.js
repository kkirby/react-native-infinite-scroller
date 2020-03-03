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

  updateDataset() {
    const dataStart = this.dataStart;
    this.dataset(dataStart, this.cacheSize).then(value => this.updateCache(dataStart, value));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9JbmZpbml0ZUNhbGN1bGF0b3IudHMiXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwib2JzZXJ2YWJsZSIsImNvbXB1dGVkIiwicmVhY3Rpb24iLCJJbmZpbml0ZUNhbGN1bGF0b3IiLCJpbmZpbml0ZVdpZHRoIiwiaW5maW5pdGVMZW5ndGgiLCJpbmZpbml0ZUVsZW1lbnRXaWR0aCIsImluZmluaXRlRWxlbWVudHMiLCJsZW5ndGgiLCJpbmZpbml0ZUNhY2hlQnVmZmVyIiwiTWF0aCIsInJvdW5kIiwiY2FjaGVTaXplIiwiZWxlbWVudHNQZXJQYWdlIiwiY2VpbCIsIndyYXBwZXJXaWR0aCIsImluZmluaXRlVXBwZXJCdWZmZXJTaXplIiwiZmxvb3IiLCJmaXJzdEVsZW1lbnRGdWxseVZpc2libGUiLCJ4IiwibWlub3JQaGFzZSIsIm1ham9yUGhhc2UiLCJtYWpvclBoYXNlRW5kIiwicGhhc2UiLCJjYWNoZVBoYXNlIiwiZGF0YVN0YXJ0IiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwiZGF0YXNldCIsImluZmluaXRlTGltaXQiLCJkaXNwb3NlcnMiLCJwdXNoIiwidXBkYXRlcyIsInJlb3JkZXJJbmZpbml0ZSIsInVwZGF0ZUNvbnRlbnQiLCJzY2hlZHVsZXIiLCJjYiIsInVwZGF0ZURhdGFzZXQiLCJ0aGVuIiwidmFsdWUiLCJ1cGRhdGVDYWNoZSIsImRpc3Bvc2UiLCJmb3JFYWNoIiwiZiIsImkiLCJsZWZ0IiwiX3BoYXNlIiwidXBkYXRlTGVmdCIsImVsZW1lbnRzIiwiaW5maW5pdGVDYWNoZSIsImwiLCJ1cGRhdGVEYXRhIiwic3RhcnQiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsU0FBUUEsWUFBUixRQUEyQixRQUEzQjtBQUVBLFNBQVFDLFVBQVIsRUFBb0JDLFFBQXBCLEVBQThCQyxRQUE5QixRQUE2QyxNQUE3QztJQVNxQkMsa0Isc0JBQU4sTUFBTUEsa0JBQU4sU0FBb0NKLFlBQXBDLENBQWlEO0FBYS9EOzs7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QUNBOztBQUNELFNBQUtWLGFBQUwsQ0FBbUIsS0FBSzNCLGdCQUF4QjtBQUNBOztBQXhNOEQsQywyRUFDOURQLFU7Ozs7O1dBQXVCLEM7O2lGQUN2QkEsVTs7Ozs7V0FBbUMsQzs7d0ZBQ25DQSxVOzs7OztXQUEwQyxDOztvRkFDMUNBLFU7Ozs7O1dBQW9ELEU7O2dGQUNwREEsVTs7Ozs7V0FBa0MsQzs7NkVBQ2xDQSxVOzs7OztXQUErQixDOztrRUFVL0JDLFEseUpBT0FBLFEsK0pBT0FBLFEsZ0tBT0FBLFEsb0tBT0FBLFEsNktBT0FBLFEsZ0tBT0FBLFEsa0pBT0FBLFEscUpBT0FBLFEsZ0pBT0FBLFEsNklBSUFBLFEsaUpBSUFBLFE7U0F2Rm1CRSxrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IEluZmluaXRlRWxlbWVudCBmcm9tICcuL0luZmluaXRlRWxlbWVudCc7XG5pbXBvcnQge29ic2VydmFibGUsIGNvbXB1dGVkLCByZWFjdGlvbn0gZnJvbSAnbW9ieCc7XG5cbmludGVyZmFjZSBpU2Nyb2xsT3B0aW9uczxUPiB7XG5cdGluZmluaXRlTGltaXQ6IG51bWJlcjtcblx0aW5maW5pdGVFbGVtZW50czogSW5maW5pdGVFbGVtZW50PFQ+W107XG5cdGNhY2hlU2l6ZTogbnVtYmVyO1xuXHRkYXRhc2V0OiAoc3RhcnQ6IG51bWJlciwgY291bnQ6IG51bWJlcikgPT4gUHJvbWlzZTxUW10+O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmZpbml0ZUNhbGN1bGF0b3I8VD4gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXHRAb2JzZXJ2YWJsZSB4OiBudW1iZXIgPSAwO1xuXHRAb2JzZXJ2YWJsZSBpbmZpbml0ZUxpbWl0OiBudW1iZXIgPSAwO1xuXHRAb2JzZXJ2YWJsZSBpbmZpbml0ZUVsZW1lbnRXaWR0aDogbnVtYmVyID0gMDtcblx0QG9ic2VydmFibGUgaW5maW5pdGVFbGVtZW50czogSW5maW5pdGVFbGVtZW50PFQ+W10gPSBbXTtcblx0QG9ic2VydmFibGUgd3JhcHBlcldpZHRoOiBudW1iZXIgPSAwO1xuXHRAb2JzZXJ2YWJsZSBjYWNoZVNpemU6IG51bWJlciA9IDQ7XG5cdGRhdGFzZXQ6IChzdGFydDogbnVtYmVyLCBjb3VudDogbnVtYmVyKSA9PiBQcm9taXNlPFRbXT47XG5cblx0aW5maW5pdGVDYWNoZToge1xuXHRcdFtrZXk6IHN0cmluZ106IFQ7XG5cdH0gfCBudWxsID0gbnVsbDtcblxuXHQvKipcblx0ICogVGhlIHdpZHRoIG9mIGFsbCB0aGUgaW5maW5pdGUgZWxlbWVudHMgcHV0IHRvZ2V0aGVyLlxuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgaW5maW5pdGVXaWR0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5pbmZpbml0ZUxlbmd0aCAqIHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGg7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRvdGFsIG51bWJlciBvZiBpbmZpbml0ZSBlbGVtZW50cy5cblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IGluZmluaXRlTGVuZ3RoKCkge1xuXHRcdHJldHVybiB0aGlzLmluZmluaXRlRWxlbWVudHMubGVuZ3RoO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBjYWNoZSBzaXplIGRpdmlkaWVkIGJ5IDQuXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBpbmZpbml0ZUNhY2hlQnVmZmVyKCkge1xuXHRcdHJldHVybiBNYXRoLnJvdW5kKHRoaXMuY2FjaGVTaXplIC8gNCk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRvdGFsIG51bWJlciBvZiBlbGVtZW50cyB0aGF0IGZpdCB3aXRoaW4gb3VyIHdyYXBwZXIuXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBlbGVtZW50c1BlclBhZ2UoKSB7XG5cdFx0cmV0dXJuIE1hdGguY2VpbCh0aGlzLndyYXBwZXJXaWR0aCAvIHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBjb3VudCBvZiBlbGVtZW50cyB0aGF0IGV4Y2VlZCBvdXRzaWRlIG91ciB3cmFwcGVyLCBkaXZpZGVkIGJ5IHR3b1xuXHQgKiovXG5cdEBjb21wdXRlZCBnZXQgaW5maW5pdGVVcHBlckJ1ZmZlclNpemUoKSB7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoKHRoaXMuaW5maW5pdGVMZW5ndGggLSB0aGlzLmVsZW1lbnRzUGVyUGFnZSkgLyAyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgaW5kZXggb2YgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBpcyBmdWxseSB2aXNpYmxlXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBmaXJzdEVsZW1lbnRGdWxseVZpc2libGUoKSB7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoLXRoaXMueCAvIHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZ1cnRoZXN0IGxlZnQgZWxlbWVudCBpbmRleCBiZXlvbmQgdGhlIHdyYXBwZXIgYm91bmRzXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBtaW5vclBoYXNlKCkge1xuXHRcdHJldHVybiB0aGlzLmZpcnN0RWxlbWVudEZ1bGx5VmlzaWJsZSAtIHRoaXMuaW5maW5pdGVVcHBlckJ1ZmZlclNpemU7XG5cdH1cblxuXHQvKipcblx0ICogU2VjdGlvbiBpbmRleCBiYXNlZCBvbiB0aGUgbWlub3IgcGhhc2UuXG5cdCAqKi9cblx0QGNvbXB1dGVkIGdldCBtYWpvclBoYXNlKCkge1xuXHRcdHJldHVybiBNYXRoLmZsb29yKHRoaXMubWlub3JQaGFzZSAvIHRoaXMuaW5maW5pdGVMZW5ndGgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGV4IG9mIHRoZSBlbmQgb2YgdGhlIHNlY3Rpb25cblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IG1ham9yUGhhc2VFbmQoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFqb3JQaGFzZSAqIHRoaXMuaW5maW5pdGVMZW5ndGg7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICoqL1xuXHRAY29tcHV0ZWQgZ2V0IHBoYXNlKCkge1xuXHRcdHJldHVybiB0aGlzLm1pbm9yUGhhc2UgLSB0aGlzLm1ham9yUGhhc2VFbmQ7XG5cdH1cblxuXHRAY29tcHV0ZWQgZ2V0IGNhY2hlUGhhc2UoKSB7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IodGhpcy5taW5vclBoYXNlIC8gdGhpcy5pbmZpbml0ZUNhY2hlQnVmZmVyKTtcblx0fVxuXG5cdEBjb21wdXRlZCBnZXQgZGF0YVN0YXJ0KCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHR0aGlzLmNhY2hlUGhhc2UgKiB0aGlzLmluZmluaXRlQ2FjaGVCdWZmZXIgLVxuXHRcdFx0dGhpcy5pbmZpbml0ZUNhY2hlQnVmZmVyXG5cdFx0KTtcblx0fVxuXG5cdGRpc3Bvc2VyczogKCgpID0+IHZvaWQpW10gPSBbXTtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOiBpU2Nyb2xsT3B0aW9uczxUPikge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5pbmZpbml0ZUVsZW1lbnRzID0gb3B0aW9ucy5pbmZpbml0ZUVsZW1lbnRzO1xuXHRcdHRoaXMuZGF0YXNldCA9IG9wdGlvbnMuZGF0YXNldDtcblx0XHR0aGlzLmNhY2hlU2l6ZSA9IG9wdGlvbnMuY2FjaGVTaXplO1xuXHRcdHRoaXMuaW5maW5pdGVMaW1pdCA9IG9wdGlvbnMuaW5maW5pdGVMaW1pdDtcblx0XHR0aGlzLmRpc3Bvc2Vycy5wdXNoKFxuXHRcdFx0cmVhY3Rpb24oXG5cdFx0XHRcdCgpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dXBkYXRlczogdGhpcy5yZW9yZGVySW5maW5pdGUoKSxcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQoe3VwZGF0ZXN9KSA9PiB7XG5cdFx0XHRcdFx0aWYgKHVwZGF0ZXMpIHtcblx0XHRcdFx0XHRcdHRoaXMudXBkYXRlQ29udGVudCh1cGRhdGVzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzY2hlZHVsZXIoY2IpIHtcblx0XHRcdFx0XHRcdGNiKCk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSxcblx0XHRcdCksXG5cdFx0KTtcblxuXHRcdHRoaXMuZGlzcG9zZXJzLnB1c2goXG5cdFx0XHRyZWFjdGlvbihcblx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRkYXRhc2V0OiB0aGlzLmRhdGFzZXQsXG5cdFx0XHRcdFx0XHRkYXRhU3RhcnQ6IHRoaXMuZGF0YVN0YXJ0LFxuXHRcdFx0XHRcdFx0Y2FjaGVTaXplOiB0aGlzLmNhY2hlU2l6ZSxcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQoe2RhdGFzZXQsIGRhdGFTdGFydCwgY2FjaGVTaXplfSkgPT4ge1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlRGF0YXNldCgpO1xuXHRcdFx0XHR9LFxuXHRcdFx0KSxcblx0XHQpO1xuXHRcdFxuXHRcdHRoaXMudXBkYXRlRGF0YXNldCgpO1xuXHR9XG5cdFxuXHR1cGRhdGVEYXRhc2V0KCl7XG5cdFx0Y29uc3QgZGF0YVN0YXJ0ID0gdGhpcy5kYXRhU3RhcnQ7XG5cdFx0dGhpcy5kYXRhc2V0KGRhdGFTdGFydCwgdGhpcy5jYWNoZVNpemUpLnRoZW4odmFsdWUgPT5cblx0XHRcdHRoaXMudXBkYXRlQ2FjaGUoZGF0YVN0YXJ0LCB2YWx1ZSksXG5cdFx0KTtcblx0fVxuXG5cdGRpc3Bvc2UoKSB7XG5cdFx0dGhpcy5kaXNwb3NlcnMuZm9yRWFjaChmID0+IGYoKSk7XG5cdH1cblxuXHRyZW9yZGVySW5maW5pdGUoKSB7XG5cdFx0aWYgKHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGggPD0gMCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgaSA9IDA7XG5cdFx0bGV0IHVwZGF0ZXMgPSBbXTtcblx0XHR3aGlsZSAoaSA8IHRoaXMuaW5maW5pdGVMZW5ndGgpIHtcblx0XHRcdGxldCBsZWZ0ID1cblx0XHRcdFx0aSAqIHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGggK1xuXHRcdFx0XHR0aGlzLm1ham9yUGhhc2UgKiB0aGlzLmluZmluaXRlV2lkdGg7XG5cblx0XHRcdGlmICh0aGlzLnBoYXNlIC0gdGhpcy5lbGVtZW50c1BlclBhZ2UgPiBpKSB7XG5cdFx0XHRcdGxlZnQgKz0gdGhpcy5pbmZpbml0ZUVsZW1lbnRXaWR0aCAqIHRoaXMuaW5maW5pdGVMZW5ndGg7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLmluZmluaXRlRWxlbWVudHNbaV0ubGVmdCAhPT0gbGVmdCkge1xuXHRcdFx0XHRsZXQgX3BoYXNlID0gbGVmdCAvIHRoaXMuaW5maW5pdGVFbGVtZW50V2lkdGg7XG5cdFx0XHRcdHRoaXMuaW5maW5pdGVFbGVtZW50c1tpXS5waGFzZSA9IF9waGFzZTtcblxuXHRcdFx0XHRpZiAoX3BoYXNlIDwgdGhpcy5pbmZpbml0ZUxpbWl0KSB7XG5cdFx0XHRcdFx0dGhpcy5pbmZpbml0ZUVsZW1lbnRzW2ldLnVwZGF0ZUxlZnQobGVmdCk7XG5cdFx0XHRcdFx0dXBkYXRlcy5wdXNoKHRoaXMuaW5maW5pdGVFbGVtZW50c1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aSsrO1xuXHRcdH1cblxuXHRcdHJldHVybiB1cGRhdGVzO1xuXHR9XG5cblx0dXBkYXRlQ29udGVudChlbGVtZW50czogSW5maW5pdGVFbGVtZW50PFQ+W10pIHtcblx0XHRpZiAodGhpcy5pbmZpbml0ZUNhY2hlID09IG51bGwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBsID0gZWxlbWVudHMubGVuZ3RoO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRlbGVtZW50c1tpXS51cGRhdGVEYXRhKHRoaXMuaW5maW5pdGVDYWNoZVtlbGVtZW50c1tpXS5waGFzZV0pO1xuXHRcdH1cblx0fVxuXG5cdHVwZGF0ZUNhY2hlKHN0YXJ0OiBudW1iZXIsIGRhdGE6IFRbXSkge1xuXHRcdHRoaXMuaW5maW5pdGVDYWNoZSA9IHt9O1xuXHRcdGNvbnN0IGwgPSBkYXRhLmxlbmd0aDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0dGhpcy5pbmZpbml0ZUNhY2hlW3N0YXJ0KytdID0gZGF0YVtpXTtcblx0XHR9XG5cdFx0dGhpcy51cGRhdGVDb250ZW50KHRoaXMuaW5maW5pdGVFbGVtZW50cyk7XG5cdH1cbn1cbiJdfQ==