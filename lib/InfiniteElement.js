function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { EventEmitter } from 'events';
export default class InfiniteElement extends EventEmitter {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "left", 0);

    _defineProperty(this, "data", null);

    _defineProperty(this, "phase", 0);
  }

  updateLeft(left) {
    if (left !== this.left) {
      this.left = left;
      this.emit('update');
    }
  }

  updateData(data) {
    if (data !== this.data) {
      this.data = data;
      this.emit('update');
    }
  }

}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFdmVudEVtaXR0ZXIiLCJJbmZpbml0ZUVsZW1lbnQiLCJ1cGRhdGVMZWZ0IiwibGVmdCIsImVtaXQiLCJ1cGRhdGVEYXRhIiwiZGF0YSJdLCJzb3VyY2VzIjpbIi4uL3NyYy9JbmZpbml0ZUVsZW1lbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFdmVudEVtaXR0ZXJ9IGZyb20gJ2V2ZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZmluaXRlRWxlbWVudDxUPiBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cdGxlZnQ6IG51bWJlciA9IDA7XG5cdGRhdGE6IFQgfCBudWxsID0gbnVsbDtcblx0cGhhc2U6IG51bWJlciA9IDA7XG5cblx0dXBkYXRlTGVmdChsZWZ0OiBudW1iZXIpIHtcblx0XHRpZiAobGVmdCAhPT0gdGhpcy5sZWZ0KSB7XG5cdFx0XHR0aGlzLmxlZnQgPSBsZWZ0O1xuXHRcdFx0dGhpcy5lbWl0KCd1cGRhdGUnKTtcblx0XHR9XG5cdH1cblxuXHR1cGRhdGVEYXRhKGRhdGE6IGFueSkge1xuXHRcdGlmIChkYXRhICE9PSB0aGlzLmRhdGEpIHtcblx0XHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cdFx0XHR0aGlzLmVtaXQoJ3VwZGF0ZScpO1xuXHRcdH1cblx0fVxufVxuIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVFBLFlBQVIsUUFBMkIsUUFBM0I7QUFFQSxlQUFlLE1BQU1DLGVBQU4sU0FBaUNELFlBQWpDLENBQThDO0VBQUE7SUFBQTs7SUFBQSw4QkFDN0MsQ0FENkM7O0lBQUEsOEJBRTNDLElBRjJDOztJQUFBLCtCQUc1QyxDQUg0QztFQUFBOztFQUs1REUsVUFBVSxDQUFDQyxJQUFELEVBQWU7SUFDeEIsSUFBSUEsSUFBSSxLQUFLLEtBQUtBLElBQWxCLEVBQXdCO01BQ3ZCLEtBQUtBLElBQUwsR0FBWUEsSUFBWjtNQUNBLEtBQUtDLElBQUwsQ0FBVSxRQUFWO0lBQ0E7RUFDRDs7RUFFREMsVUFBVSxDQUFDQyxJQUFELEVBQVk7SUFDckIsSUFBSUEsSUFBSSxLQUFLLEtBQUtBLElBQWxCLEVBQXdCO01BQ3ZCLEtBQUtBLElBQUwsR0FBWUEsSUFBWjtNQUNBLEtBQUtGLElBQUwsQ0FBVSxRQUFWO0lBQ0E7RUFDRDs7QUFqQjJEIn0=