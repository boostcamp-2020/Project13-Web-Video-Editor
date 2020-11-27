class Video {
  private video: HTMLVideoElement;

  private THUMNAIL_COUNT: number = 30;

  private canvas: HTMLCanvasElement;

  private thumbnails: string[];

  constructor() {
    this.canvas = document.createElement('canvas');
    this.video = document.createElement('video');
    this.video.preload = 'auto';
  }

  // getter
  isPaused = () => {
    return this.video.paused;
  };

  getVideo = () => {
    return this.video;
  };

  getDuration = () => {
    return this.video.duration;
  };

  getVideoWidth = () => {
    return this.video.videoWidth;
  };

  getVideoHeight = () => {
    return this.video.videoHeight;
  };

  getSrc = () => {
    return this.video.src;
  };

  getCurrentTime = () => {
    return this.video.currentTime;
  };

  getThumbnails = () => {
    return [...this.thumbnails];
  };

  // setter
  setSrc = (src: string) => {
    this.video.src = src;
  };

  setCurrentTime = (time: number) => {
    this.video.currentTime = time;
  };

  makeThumbnails = (start: number, end: number) => {
    return new Promise<string[]>((resolve, reject) => {
      try {
        (async () => {
          const gap = (end - start) / (this.THUMNAIL_COUNT - 1);
          let secs = start;

          const images: string[] = [];

          for (let count = 0; count < this.THUMNAIL_COUNT; count += 1) {
            this.setCurrentTime(secs);
            const image: string = await this.getImageAt();

            secs += gap;
            images.push(image);
          }
          this.setCurrentTime(0);
          this.thumbnails = images;
          resolve(images);
        })();
      } catch (err) {
        reject(err);
      }
    });
  };

  getImageAt = () => {
    return new Promise<string>(resolve => {
      this.video.addEventListener(
        'seeked',
        () => {
          const context = this.canvas.getContext('2d');
          context.drawImage(
            this.getVideo(),
            0,
            0,
            this.canvas.width,
            this.canvas.height
          );

          resolve(this.canvas.toDataURL());
        },
        { once: true }
      );
    });
  };

  revoke = () => {
    if (this.getSrc()) {
      URL.revokeObjectURL(this.getSrc());
      this.video.removeAttribute('src');
      this.load();
    }
  };

  play = () => {
    this.video.play();
  };

  pause = () => {
    this.video.pause();
  };

  load = () => {
    this.video.load();
  };

  addEventListener = (
    event: string,
    callback: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) => {
    this.video.addEventListener(event, callback, options);
  };

  removeEventListener = (
    event: string,
    callback: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ) => {
    this.video.removeEventListener(event, callback, options);
  };
}

export default new Video();
