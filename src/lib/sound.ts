import { Howl } from 'howler';
import { SOUND_CONFIG } from '@/game/constants';

class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, Howl>;
  private music: Map<string, Howl>;
  private currentMusic: Howl | null;
  private enabled: boolean;
  private musicEnabled: boolean;

  private constructor() {
    this.sounds = new Map();
    this.music = new Map();
    this.currentMusic = null;
    this.enabled = true;
    this.musicEnabled = true;
    this.initializeSounds();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initializeSounds() {
    // Initialize sound effects
    Object.entries(SOUND_CONFIG.EFFECTS).forEach(([key, config]) => {
      this.sounds.set(key, new Howl({
        src: [config.src],
        volume: SOUND_CONFIG.VOLUME,
        preload: true
      }));
    });

    // Initialize music
    Object.entries(SOUND_CONFIG.MUSIC).forEach(([key, config]) => {
      this.music.set(key, new Howl({
        src: [config.src],
        volume: SOUND_CONFIG.VOLUME * 0.5,
        loop: true,
        preload: true
      }));
    });
  }

  public playSound(name: string) {
    if (!this.enabled) return;
    const sound = this.sounds.get(name);
    if (sound) {
      sound.play();
    }
  }

  public playMusic(name: string) {
    if (!this.musicEnabled) return;
    if (this.currentMusic) {
      this.currentMusic.stop();
    }
    const music = this.music.get(name);
    if (music) {
      music.play();
      this.currentMusic = music;
    }
  }

  public stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  public toggleSound(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.sounds.forEach(sound => sound.stop());
    }
  }

  public toggleMusic(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  public setVolume(volume: number) {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => sound.volume(normalizedVolume));
    this.music.forEach(music => music.volume(normalizedVolume * 0.5));
  }
}

export const soundManager = SoundManager.getInstance();