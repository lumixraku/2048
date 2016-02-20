var $ = require('jQuery');
var constConfig = require('./config.js');
var DOMUtil = {
  newBlockElem: function(pos) {
    var block = document.createElement('div');
    block.classList.add('block');
    block.style.width = constConfig.BLOCK_SIZE + 'rem';
    block.style.height = constConfig.BLOCK_SIZE + 'rem';
    block.style.top = pos.y + 'rem';
    block.style.left = pos.x + 'rem';
    return block;
  },

  /*
  仅用于播放动画和动画完成后的方块值的显示
  方块值的融合逻辑都在 blockMerge中
  由于动画在blockMerge之后进行  所以这里得到的 dist  curr 都是最终值
  value 是被移动的方块的初始值()
  */
  addAnimate: function(dist, curr, valueOrigin, wrapper) {
    var distLeft = +parseFloat(dist.elem.style.left).toFixed(1),
      distTop = +parseFloat(dist.elem.style.top).toFixed(1),
      currentTop = +parseFloat(curr.elem.style.top).toFixed(1),
      currentLeft = +parseFloat(curr.elem.style.left).toFixed(1),
      curTop = currentTop,
      curLeft = currentLeft;
    var animateElem = document.createElement('div');
    animateElem.classList.add('animate');
    animateElem.style.top = currentTop + 'rem';
    animateElem.style.left = currentLeft + 'rem';
    animateElem.innerText = valueOrigin;
    animateElem.className = 'block val' + valueOrigin;
    wrapper.appendChild(animateElem);
    $(animateElem).animate({
      top: distTop + 'rem',
      left: distLeft + 'rem'
    }, 323, function() {
      animateElem.remove();
      dist.setValue(dist.value);
    });
  }
}

module.exports = DOMUtil;