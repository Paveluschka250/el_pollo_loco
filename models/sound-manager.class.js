class SoundManager {
  static instance = null;
  soundEnabled = true;
  sounds = new Map();

  /**
   * Creates a new SoundManager instance (Singleton)
   */
  constructor() {
    if (SoundManager.instance) {
      return SoundManager.instance;
    }
    SoundManager.instance = this;
    this.loadSoundState();
  }

  /**
   * Gets the singleton instance
   * @returns {SoundManager} SoundManager instance
   */
  static getInstance() {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * Loads sound state from localStorage
   */
  loadSoundState() {
    const savedSoundState = localStorage.getItem("soundEnabled");
    if (savedSoundState !== null) {
      this.soundEnabled = savedSoundState === "true";
    }
  }

  /**
   * Sets sound enabled state and updates all existing sounds
   * Saves preference to localStorage and adjusts volume/pause state of all sounds
   * @param {boolean} enabled - Whether sound is enabled
   */
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    localStorage.setItem("soundEnabled", enabled.toString());
    
    this.sounds.forEach((sound, key) => {
      if (sound) {
        sound.volume = enabled ? (sound.originalVolume || 1) : 0;
        if (!enabled && !sound.paused) {
          sound.pause();
        }
      }
    });
  }

  /**
   * Creates a new sound with specified options and stores it in the sound map
   * @param {string} audioPath - Path to audio file
   * @param {Object} options - Sound options (volume, loop, preload)
   * @returns {Audio} Audio object with configured properties
   */
  createSound(audioPath, options = {}) {
    const sound = new Audio(audioPath);
    sound.originalVolume = options.volume || 1;
    sound.volume = this.soundEnabled ? sound.originalVolume : 0;
    sound.loop = options.loop || false;
    sound.preload = options.preload || "auto";
    const soundId = audioPath.split('/').pop().split('.')[0];
    this.sounds.set(soundId, sound);
    return sound;
  }

  /**
   * Plays a sound
   * @param {Audio} sound - Audio object to play
   * @param {Object} options - Play options
   */
  playSound(sound, options = {}) {
    if (!sound || !this.soundEnabled) return;
    
    try {
      if (options.resetTime !== false && (!sound.loop || sound.paused)) {
        sound.currentTime = 0;
      }
      sound.volume = this.soundEnabled ? (sound.originalVolume || 1) : 0;
      sound.play().catch(e => {});
    } catch (e) {}
  }

  /**
   * Stops a sound
   * @param {Audio} sound - Audio object to stop
   */
  stopSound(sound) {
    if (!sound) return;
    
    try {
      sound.pause();
      sound.currentTime = 0;
    } catch (e) {}
  }

  /**
   * Pauses all sounds
   */
  pauseAllSounds() {
    this.sounds.forEach(sound => {
      if (sound && !sound.paused) {
        try {
          sound.pause();
        } catch (e) {}
      }
    });
  }

  /**
   * Resumes all paused loop sounds
   */
  resumeAllSounds() {
    if (!this.soundEnabled) return;
    
    this.sounds.forEach(sound => {
      if (sound && sound.paused && sound.loop) {
        try {
          sound.volume = sound.originalVolume || 1;
          sound.play().catch(e => {});
        } catch (e) {}
      }
    });
  }

  /**
   * Stops all sounds
   */
  stopAllSounds() {
    this.sounds.forEach(sound => {
      this.stopSound(sound);
    });
  }
}