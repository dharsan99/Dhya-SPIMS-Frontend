// Haptic Feedback Utility for mobile interactions
export class HapticFeedback {
  private static isSupported(): boolean {
    return 'vibrate' in navigator;
  }

  private static isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Light haptic feedback for swipe gestures
   */
  static swipe(): void {
    if (this.isSupported() && this.isMobile()) {
      navigator.vibrate(10);
    }
  }

  /**
   * Medium haptic feedback for edit actions
   */
  static edit(): void {
    if (this.isSupported() && this.isMobile()) {
      navigator.vibrate([10, 20, 10]);
    }
  }

  /**
   * Strong haptic feedback for delete actions
   */
  static delete(): void {
    if (this.isSupported() && this.isMobile()) {
      navigator.vibrate([20, 10, 20, 10, 20]);
    }
  }

  /**
   * Success haptic feedback
   */
  static success(): void {
    if (this.isSupported() && this.isMobile()) {
      navigator.vibrate([10, 30, 10]);
    }
  }

  /**
   * Error haptic feedback
   */
  static error(): void {
    if (this.isSupported() && this.isMobile()) {
      navigator.vibrate([50, 10, 50, 10, 50]);
    }
  }

  /**
   * Custom haptic pattern
   */
  static custom(pattern: number[]): void {
    if (this.isSupported() && this.isMobile()) {
      navigator.vibrate(pattern);
    }
  }
} 