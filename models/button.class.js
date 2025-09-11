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

class SoundButton extends DrawableObject {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isPressed = false;
    this.alpha = 1;
    this.soundEnabled = true;
    this.loadImage("assets/icons/sound-on.svg");
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
    this.toggleSound();
  }

  onTouchEnd() {
    this.isPressed = false;
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    
    if (this.soundEnabled) {
      this.loadImage("assets/icons/sound-on.svg");
      this.enableAllSounds();
    } else {
      this.loadImage("assets/icons/sound-off.svg");
      this.disableAllSounds();
    }
  }

  enableAllSounds() {
    if (window.world) {
      this.setGlobalVolume(1.0);
    }
  }

  disableAllSounds() {
    if (window.world) {
      this.setGlobalVolume(0.0);
    }
  }

  setGlobalVolume(volume) {
    if (window.world && window.world.character) {
      this.setCharacterVolume(window.world.character, volume);
    }
    if (window.world && window.world.level) {
      this.setLevelVolume(window.world.level, volume);
    }
    if (window.world && window.world.endscreen) {
      this.setEndscreenVolume(window.world.endscreen, volume);
    }
    if (window.world && window.world.throwableObjects) {
      this.setThrowableObjectsVolume(window.world.throwableObjects, volume);
    }
    this.setBackgroundMusicVolume(volume);
  }

  setCharacterVolume(character, volume) {
    if (character.deadSound) character.deadSound.volume = volume;
    if (character.hurtSound) character.hurtSound.volume = volume;
    if (character.jumpSound) character.jumpSound.volume = volume;
    if (character.walkSound) character.walkSound.volume = volume;
  }

  setLevelVolume(level, volume) {
    if (level.chickens) {
      level.chickens.forEach(chicken => {
        if (chicken.deadSound) chicken.deadSound.volume = volume;
        if (chicken.hurtSound) chicken.hurtSound.volume = volume;
      });
    }
    if (level.coins) {
      level.coins.forEach(coin => {
        if (coin.pickupSound) coin.pickupSound.volume = volume;
      });
    }
    if (level.bottles) {
      level.bottles.forEach(bottle => {
        if (bottle.pickupSound) bottle.pickupSound.volume = volume;
      });
    }
  }

  setEndscreenVolume(endscreen, volume) {
    if (endscreen.winSound) endscreen.winSound.volume = volume;
    if (endscreen.loseSound) endscreen.loseSound.volume = volume;
  }

  setThrowableObjectsVolume(throwableObjects, volume) {
    throwableObjects.forEach(obj => {
      if (obj.throwSound) obj.throwSound.volume = volume;
    });
  }

  setBackgroundMusicVolume(volume) {
    if (window.backgroundMusic) {
      window.backgroundMusic.volume = volume * 0.3;
      if (volume > 0 && window.backgroundMusic.paused) {
        window.backgroundMusic.play().catch(e => {});
      } else if (volume === 0 && !window.backgroundMusic.paused) {
        window.backgroundMusic.pause();
      }
    }
  }
}

class ButtonController {
  constructor(canvas) {
    this.canvas = canvas;
    this.buttons = [];
    this.soundButton = null;
    this.enabled = true;
    this.setupButtons();
    this.setupSoundButton();
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

  setupSoundButton() {
    const buttonSize = 50;
    const margin = 20;
    const canvasWidth = this.canvas.width;
    
    this.soundButton = new SoundButton(
      canvasWidth - buttonSize - margin,
      margin,
      buttonSize,
      buttonSize
    );
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
      
      if (this.soundButton && this.soundButton.isClicked(mouseX, mouseY)) {
        this.soundButton.onTouchStart();
      }
    });

    this.canvas.addEventListener('touchend', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      this.buttons.forEach(button => {
        button.onTouchEnd();
        button.resetAction();
      });
      
      if (this.soundButton) {
        this.soundButton.onTouchEnd();
      }
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
      
      if (this.soundButton && this.soundButton.isClicked(mouseX, mouseY)) {
        this.soundButton.onTouchStart();
      }
    });

    this.canvas.addEventListener('mouseup', (e) => {
      if (!this.enabled) return;
      this.buttons.forEach(button => {
        button.onTouchEnd();
        button.resetAction();
      });
      
      if (this.soundButton) {
        this.soundButton.onTouchEnd();
      }
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
    
    if (this.soundButton) {
      this.soundButton.draw(ctx);
    }
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
    this.buttons.forEach(button => {
      button.onTouchCancel();
    });
    
    if (this.soundButton) {
      this.soundButton.onTouchEnd();
    }
  }
}
