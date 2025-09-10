class Button extends DrawableObject {
  constructor(x, y, width, height, imagePath, action) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.loadImage(imagePath);
    this.action = action;
    this.isPressed = false;
    this.alpha = 1;
  }

  draw(ctx) {
    if (this.isPressed) {
      ctx.globalAlpha = 0.7;
    } else {
      ctx.globalAlpha = this.alpha;
    }
    
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.globalAlpha = 1;
  }

  isClicked(mouseX, mouseY) {
    return mouseX >= this.x && 
           mouseX <= this.x + this.width && 
           mouseY >= this.y && 
           mouseY <= this.y + this.height;
  }

  onTouchStart() {
    this.isPressed = true;
    this.executeAction();
  }

  onTouchEnd() {
    this.isPressed = false;
  }

  executeAction() {
    if (this.action === 'left') {
      if (window.world && window.world.keyboard) {
        window.world.keyboard.LEFT = true;
      }
    } else if (this.action === 'right') {
      if (window.world && window.world.keyboard) {
        window.world.keyboard.RIGHT = true;
      }
    } else if (this.action === 'jump') {
      if (window.world && window.world.keyboard) {
        window.world.keyboard.UP = true;
      }
    } else if (this.action === 'throw') {
      if (window.world && window.world.keyboard) {
        window.world.keyboard.SPACE = true;
      }
    }
  }

  onTouchCancel() {
    this.isPressed = false;
    this.resetAction();
  }

  resetAction() {
    if (this.action === 'left') {
      if (window.world && window.world.keyboard) {
        window.world.keyboard.LEFT = false;
      }
    } else if (this.action === 'right') {
      if (window.world && window.world.keyboard) {
        window.world.keyboard.RIGHT = false;
      }
    } else if (this.action === 'jump') {
      if (window.world && window.world.keyboard) {
        window.world.keyboard.UP = false;
      }
    } else if (this.action === 'throw') {
      if (window.world && window.world.keyboard) {
        window.world.keyboard.SPACE = false;
      }
    }
  }
}

class ButtonController {
  constructor(canvas) {
    this.canvas = canvas;
    this.buttons = [];
    this.enabled = true;
    this.setupButtons();
    this.setupEventListeners();
  }

  setupButtons() {
    const buttonSize = 60;
    const margin = 20;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    
    const leftY = canvasHeight - buttonSize - margin;
    const rightY = canvasHeight - buttonSize - margin;
    
    this.buttons.push(new Button(
      margin,
      leftY,
      buttonSize,
      buttonSize,
      "assets/icons/left.svg",
      "left"
    ));
    
    this.buttons.push(new Button(
      margin + buttonSize + 10,
      leftY,
      buttonSize,
      buttonSize,
      "assets/icons/right.svg",
      "right"
    ));
    
    this.buttons.push(new Button(
      canvasWidth - (buttonSize * 2) - 10 - margin,
      rightY,
      buttonSize,
      buttonSize,
      "assets/icons/jump.svg",
      "jump"
    ));
    
    this.buttons.push(new Button(
      canvasWidth - buttonSize - margin,
      rightY,
      buttonSize,
      buttonSize,
      "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
      "throw"
    ));
  }

  setupEventListeners() {
    this.canvas.addEventListener('touchstart', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const mouseX = touch.clientX - rect.left;
      const mouseY = touch.clientY - rect.top;
      
      this.buttons.forEach(button => {
        if (button.isClicked(mouseX, mouseY)) {
          button.onTouchStart();
        }
      });
    });

    this.canvas.addEventListener('touchend', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      this.buttons.forEach(button => {
        button.onTouchEnd();
        button.resetAction();
      });
    });

    this.canvas.addEventListener('touchcancel', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      this.buttons.forEach(button => {
        button.onTouchCancel();
      });
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.enabled) return;
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      this.buttons.forEach(button => {
        if (button.isClicked(mouseX, mouseY)) {
          button.onTouchStart();
        }
      });
    });

    this.canvas.addEventListener('mouseup', (e) => {
      if (!this.enabled) return;
      this.buttons.forEach(button => {
        button.onTouchEnd();
        button.resetAction();
      });
    });

    this.canvas.addEventListener('mouseleave', (e) => {
      if (!this.enabled) return;
      this.buttons.forEach(button => {
        button.onTouchCancel();
      });
    });
  }

  draw(ctx) {
    this.buttons.forEach(button => {
      button.draw(ctx);
    });
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
    this.buttons.forEach(button => {
      button.onTouchCancel();
    });
  }
}
