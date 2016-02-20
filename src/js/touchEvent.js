//除了使用键盘控制 还可以使用触摸控制
var touchStart = {
    x: 0,
    y: 0,
  },
  touchEnd = {
    x: 0,
    y: 0
  }
document.addEventListener('touchstart', function(e) {
  touchStart.x = e.touches[0].pageX;
  touchStart.y = e.touches[0].pageY;
  e.preventDefault();
}, false);
document.addEventListener('touchmove', function(e) {
  touchEnd.x = e.touches[0].pageX;
  touchEnd.y = e.touches[0].pageY;
  e.preventDefault();
}, false);
document.addEventListener('touchend', function(e) {
  if (Math.abs(touchEnd.y - touchStart.y) > Math.abs(touchEnd.x - touchStart.x)) {
    if (touchEnd.y < touchStart.y) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("swipeUp", false, true);
      document.dispatchEvent(evt);
    } else {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("swipeDown", false, true);
      document.dispatchEvent(evt);

    }
  }
  if (Math.abs(touchEnd.x - touchStart.x) > Math.abs(touchEnd.y - touchStart.y)) {
    if (touchEnd.x < touchStart.x) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("swipeLeft", false, true);
      document.dispatchEvent(evt);
    } else {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("swipeRight", false, true);
      document.dispatchEvent(evt);
    }
  }
  e.preventDefault();
}, false);