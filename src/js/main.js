require('./touchEvent')
var $ = require('jQuery');
var constConfig = require('./config.js');
var DOMUtil = require('./dom.js');
var Block = require('./Block.js');


function Game2048() {
  this.wrapper = document.querySelector('.wrapper');
  this.scoreEle = document.querySelector('.score .value');

  //存储Block 对象
  this.blockList = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  this.init = function() {
    this.wrapper.style.cssText = [
      'width:', constConfig.WRAPPER_SIZE,
      'rem ;height:', constConfig.WRAPPER_SIZE, 'rem'
    ].join('');

    //默认所有方块的值为0
    for (var x = 1; x <= 4; x++) {
      for (var y = 1; y <= 4; y++) {
        this.addBlock(x, y, 0);
      }
    }
    //初始化需要添数字为2的方块
    this.setBlock(4, 3, 2);
  };
  this.bindEvents = function() {
    var self = this;
    document.addEventListener('keydown', function(e) {
      switch (e.keyCode) {
        case 87: //w
        case 38:
          self.swipeUp();
          break;
        case 83:
        case 40:
          self.swipeDown();
          break;
        case 65:
        case 37:
          self.swipeLeft();
          break;
        case 68:
        case 39:
          self.swipeRight();
          break;
      }
    }, false);
    document.addEventListener('swipeUp', function(e){
      this.swipeUp();
    }.bind(this),false);
    document.addEventListener('swipeDown', function(e){
      this.swipeDown();
    }.bind(this),false);
    document.addEventListener('swipeLeft', function(e){
      this.swipeLeft();
    }.bind(this),false);
    document.addEventListener('swipeRight', function(e){
      this.swipeRight();
    }.bind(this),false);
  }
}

Game2048.prototype = {
  addBlock: function(x, y, value) {
    var block = new Block(x, y, value);
    this.blockList[x - 1][y-1] = block;
    this.wrapper.appendChild(block.elem);
  },
  getBlockBy: function(x, y) {
    return this.blockList[x - 1][y - 1];
  },

  setBlock: function(x, y, value) {
    var block = this.blockList[x - 1][y - 1];
    block.setValue(value);
  },

  getPosition: function(x, y) {
    return {
      x: x * constConfig.PADDING + (x - 1) * constConfig.BLOCK_SIZE,
      y: y * constConfig.PADDING + (y - 1) * constConfig.BLOCK_SIZE
    }
  },

  swipeUp: function() {
    var self = this;
    //对于后面三排方块 每一个都检测能否上移
    for (var x = 1; x <= 4; x++) {
      for (var y = 2; y <= 4; y++) { //后三排
        var currentY = y,
          distY = y,
          step = 0,
          movedOnce, valueOrigin;
        valueOrigin = self.getBlockBy(x, y).value;
        while (currentY != 1) {
          movedOnce = self.getBlockBy(x, currentY).blockMerge(self.getBlockBy(x, currentY - 1));
          currentY--;
          if (movedOnce) {
            distY = currentY;
          }
        }
        if (distY != y) { //表示该方块移动过 开始动画
          DOMUtil.addAnimate(self.getBlockBy(x, distY), self.getBlockBy(x, y), valueOrigin, self.wrapper);
        }
      }
    }
    self.randomAdd(constConfig.UP);
  },

  swipeDown: function() {
    var self = this;
    for (var x = 1; x <= 4; x++) {
      for (var y = 3; y >= 1; y--) {
        var currentY = y,
          distY = y,
          step = 0,
          movedOnce, value;
        value = self.getBlockBy(x, y).value;
        while (currentY != 4) {
          movedOnce = self.getBlockBy(x, currentY).blockMerge(self.getBlockBy(x, currentY + 1));
          currentY++;
          if (movedOnce) {
            distY = currentY;
          }
        }
        if (distY != y) { //表示该方块移动过 开始动画
          DOMUtil.addAnimate(self.getBlockBy(x, distY), self.getBlockBy(x, y), value, self.wrapper);
        }
      }
    }
    self.randomAdd(constConfig.DOWN);
  },

  swipeLeft: function() {
    var self = this;
    for (var y = 1; y <= 4; y++) {
      for (var x = 2; x <= 4; x++) {
        var currentX = x,
          distX = x,
          step = 0,
          movedOnce, value;
        value = self.getBlockBy(x, y).value;
        while (currentX != 1) {
          movedOnce = self.getBlockBy(currentX, y).blockMerge(self.getBlockBy(currentX - 1, y));
          currentX--;
          if (movedOnce) {
            distX = currentX;
          }
        }
        if (distX != x) { //表示该方块移动过 开始动画
          DOMUtil.addAnimate(self.getBlockBy(distX, y), self.getBlockBy(x, y), value, self.wrapper);
        }
      }
    }
    self.randomAdd(constConfig.LEFT);
  },

  swipeRight: function() {
    var self = this;
    for (var y = 1; y <= 4; y++) {
      for (var x = 3; x >= 1; x--) {
        var currentX = x,
          distX = x,
          step = 0,
          movedOnce, value;
        value = self.getBlockBy(x, y).value;
        while (currentX != 4) {
          movedOnce = self.getBlockBy(currentX, y).blockMerge(self.getBlockBy(currentX + 1, y));
          currentX++;
          if (movedOnce) {
            distX = currentX;
          }
        }
        if (distX != x) { //表示该方块移动过 开始动画
          DOMUtil.addAnimate(self.getBlockBy(distX, y), self.getBlockBy(x, y), value, self.wrapper);
        }
      }
    }
    self.randomAdd(constConfig.RIGHT);
  },

  randomAdd: function(type) {
    var self = this;
    var block, value, emptyList = [];
    if (type == constConfig.UP) {
      emptyList = findEmpty(0, 4);
    } else if (type == constConfig.DOWN) {
      emptyList = findEmpty(0, 1);
    } else if (type == constConfig.LEFT) {
      emptyList = findEmpty(4, 0);
    } else if (type == constConfig.RIGHT) {
      emptyList = findEmpty(1, 0);
    }
    if (!emptyList.length) {
      return;
    }
    // 如果length是4  产生0-3的随机数字
    // ~~取整  向数值绝对值更小的方向取整
    var rindex = ~~(Math.random() * (emptyList.length));
    block = emptyList[rindex];
    if (!block) {
      console.log(rindex);
    }
    value = Math.random() > 0.5 ? 4 : 2;
    block.value = value;
    var animateEle = document.createElement('div');
    animateEle.style.width = constConfig.BLOCK_SIZE + 'rem';
    animateEle.style.height = constConfig.BLOCK_SIZE + 'rem';
    animateEle.style.position = 'absolute';
    animateEle.style.top = block.elem.style.top;
    animateEle.style.left = block.elem.style.left;
    animateEle.className = 'block val' + value;
    animateEle.innerText = block.value;
    var scale = 0.1;
    animateEle.style.transform = 'scale(' + scale + ')';
    this.wrapper.appendChild(animateEle);
    $(animateEle).animate({ whyNotToUseANonExistingProperty: 1 }, {
      step: function(now, fx) {
        $(this).css('transform', 'scale(' + now + ')');
      },
      complete: function(){
        $(this).remove();
        block.setValue(value);
      },
      duration: 323,
      easing: 'linear'
    });
    // function step() {
    //   scale = scale + 0.04;
    //   animateEle.style.transform = 'scale(' + scale + ')';
    //   if (scale >= 1) {
    //     block.className = 'block val' + value;
    //     block.innerText = value;
    //     animateEle.remove();
    //     return;
    //   }
    //   requestAnimationFrame(step);
    // }
    // requestAnimationFrame(step);

    //只有在空上增加新方块
    function findEmpty(x, y) {
      var emptyList = [],
        block;
      if (y) {
        var xIndex = 1;
        for (; xIndex <= 4; xIndex++) {
          block = self.getBlockBy(xIndex, y);
          if (!block.value) {
            emptyList.push(block);
          }
        }
      } else if (x) {
        var yIndex = 1;
        for (; yIndex <= 4; yIndex++) {
          block = self.getBlockBy(x, yIndex);
          if (!block.value) {
            emptyList.push(block);
          }
        }
      }
      return emptyList;
    }
  },
};

$(document).on('DOMContentLoaded', function() {
  var game = new Game2048();
  game.init();
  game.bindEvents();
});
