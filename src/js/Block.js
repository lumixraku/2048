var constConfig = require('./config.js');
var DOMUtil = require('./dom.js');
var Block = function(x, y, value) {
  this.value = value;
  this.x = x;
  this.y = y;
  this.elem = DOMUtil.newBlockElem(this.getPosition(x, y));
  this.setValue(value);
}
Block.prototype = {
  setValue: function(value){
    this.value = value;//logic
    if (value) {
      this.elem.setAttribute('data', value);
      this.elem.innerText = value;
      this.elem.className = 'block val' + value;
    } else {
      this.elem.setAttribute('data', 0);
      this.elem.innerText = '';
      this.elem.className = 'block dark';
    }
  },
  getPosition: function(x, y) {
    return {
      x: x * constConfig.PADDING + (x - 1) * constConfig.BLOCK_SIZE,
      y: y * constConfig.PADDING + (y - 1) * constConfig.BLOCK_SIZE
    }
  },
  blockMerge: function(dist){
    var curr = this;
    var moved = false;
    var value = curr.value;
    if (curr.value) {
      if (dist.value == 0) {
        curr.setValue(0);
        dist.value = value;
        moved = true;
      } else if (dist.value == curr.value) {
        curr.setValue(0);
        moved = true;
        // this.scoreEle.innerText = +value + (+this.scoreEle.innerText);
        dist.value = value*2;
      }
    }
    return moved;
  }
}

module.exports = Block;