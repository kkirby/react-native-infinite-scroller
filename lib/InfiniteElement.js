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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9JbmZpbml0ZUVsZW1lbnQudHMiXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwiSW5maW5pdGVFbGVtZW50IiwidXBkYXRlTGVmdCIsImxlZnQiLCJlbWl0IiwidXBkYXRlRGF0YSIsImRhdGEiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBUUEsWUFBUixRQUEyQixRQUEzQjtBQUVBLGVBQWUsTUFBTUMsZUFBTixTQUFpQ0QsWUFBakMsQ0FBOEM7QUFBQTtBQUFBOztBQUFBLGtDQUM3QyxDQUQ2Qzs7QUFBQSxrQ0FFM0MsSUFGMkM7O0FBQUEsbUNBRzVDLENBSDRDO0FBQUE7O0FBSzVERSxFQUFBQSxVQUFVLENBQUNDLElBQUQsRUFBZTtBQUN4QixRQUFJQSxJQUFJLEtBQUssS0FBS0EsSUFBbEIsRUFBd0I7QUFDdkIsV0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsV0FBS0MsSUFBTCxDQUFVLFFBQVY7QUFDQTtBQUNEOztBQUVEQyxFQUFBQSxVQUFVLENBQUNDLElBQUQsRUFBWTtBQUNyQixRQUFJQSxJQUFJLEtBQUssS0FBS0EsSUFBbEIsRUFBd0I7QUFDdkIsV0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsV0FBS0YsSUFBTCxDQUFVLFFBQVY7QUFDQTtBQUNEOztBQWpCMkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0V2ZW50RW1pdHRlcn0gZnJvbSAnZXZlbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5maW5pdGVFbGVtZW50PFQ+IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblx0bGVmdDogbnVtYmVyID0gMDtcblx0ZGF0YTogVCB8IG51bGwgPSBudWxsO1xuXHRwaGFzZTogbnVtYmVyID0gMDtcblxuXHR1cGRhdGVMZWZ0KGxlZnQ6IG51bWJlcikge1xuXHRcdGlmIChsZWZ0ICE9PSB0aGlzLmxlZnQpIHtcblx0XHRcdHRoaXMubGVmdCA9IGxlZnQ7XG5cdFx0XHR0aGlzLmVtaXQoJ3VwZGF0ZScpO1xuXHRcdH1cblx0fVxuXG5cdHVwZGF0ZURhdGEoZGF0YTogYW55KSB7XG5cdFx0aWYgKGRhdGEgIT09IHRoaXMuZGF0YSkge1xuXHRcdFx0dGhpcy5kYXRhID0gZGF0YTtcblx0XHRcdHRoaXMuZW1pdCgndXBkYXRlJyk7XG5cdFx0fVxuXHR9XG59XG4iXX0=