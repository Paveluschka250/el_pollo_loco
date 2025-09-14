class SoundManager {
  static instance = null;
  soundEnabled = true;
  sounds = new Map();

  constructor() {
    if (SoundManager.instance) {
      return SoundManager.instance;
    }
    SoundManager.instance = this;
    this.loadSoundState();
  }

  static getInstance() {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  loadSoundState() {
    const savedSoundState = localStorage.getItem("soundEnabled");
    if (savedSoundState !== null) {
      this.soundEnabled = savedSoundState === "true";
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    localStorage.setItem("soundEnabled", enabled.toString());
    
    // Update all existing sounds
    this.sounds.forEach((sound, key) => {
      if (sound) {
        sound.volume = enabled ? (sound.originalVolume || 1) : 0;
        if (!enabled && !sound.paused) {
          sound.pause();
        }
      }
    });
  }

  createSound(audioPath, options = {}) {
    const sound = new Audio(audioPath);
    sound.originalVolume = options.volume || 1;
    sound.volume = this.soundEnabled ? sound.originalVolume : 0;
    sound.loop = options.loop || false;
    sound.preload = options.preload || "auto";
    
    // Store sound for later management
    const soundId = audioPath.split('/').pop().split('.')[0];
    this.sounds.set(soundId, sound);
    
    return sound;
  }

  playSound(sound, options = {}) {
    if (!sound || !this.soundEnabled) return;
    
    try {
      if (options.resetTime !== false) {
        sound.currentTime = 0;
      }
      sound.volume = this.soundEnabled ? (sound.originalVolume || 1) : 0;
      sound.play().catch(e => {});
    } catch (e) {}
  }

  stopSound(sound) {
    if (!sound) return;
    
    try {
      sound.pause();
      sound.currentTime = 0;
    } catch (e) {}
  }

  pauseAllSounds() {
    this.sounds.forEach(sound => {
      if (sound && !sound.paused) {
        try {
          sound.pause();
        } catch (e) {}
      }
    });
  }

  resumeAllSounds() {
    if (!this.soundEnabled) return;
    
    this.sounds.forEach(sound => {
      if (sound && sound.paused && sound.loop) {
        try {
          sound.play().catch(e => {});
        } catch (e) {}
      }
    });
  }

  stopAllSounds() {
    this.sounds.forEach(sound => {
      this.stopSound(sound);
    });
  }
}
