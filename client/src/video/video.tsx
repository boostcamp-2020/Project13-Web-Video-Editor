class Video {
  private video: HTMLVideoElement;

  private canvas: HTMLCanvasElement;

  private THUMBNAIL_COUNT: number = 30;

  private thumbnails: string[] = [];

  private getAllowedFields: Set<string> = new Set([
    'paused',
    'duration',
    'videoWidth',
    'videoHeight',
    'src',
    'currentTime',
    'volume',
  ]);

  constructor() {
    this.canvas = document.createElement('canvas');
    this.video = document.createElement('video');
    this.video.preload = 'auto';
  }

  // getter
  isPaused = () => {
    return this.video.paused;
  };

  get = field => {
    if (this.getAllowedFields.has(field)) return this.video[field];
    return undefined;
  };

  getVideo = () => {
    return this.video;
  };

  getThumbnails = () => {
    return [...this.thumbnails];
  };

  getVolume = () => {
    return this.video.volume;
  };

  // setter
  setSrc = (src: string) => {
    this.video.src = src;
    this.thumbnails = [];
  };

  setCurrentTime = (time: number) => {
    this.video.currentTime = time;
  };

  setVolume = (volume: number) => {
    this.video.volume = volume;
  };

  makeInitialThumbnails = async () => {
    const delta = 1 / 30;
    this.thumbnails = await this.makeThumbnails(0, this.video.duration - delta);
    return this.getThumbnails();
  };

  makeThumbnails = (start: number, end: number) => {
    return new Promise<string[]>((resolve, reject) => {
      try {
        (async () => {
          const gap = (end - start) / (this.THUMBNAIL_COUNT - 1);
          let secs = end;

          const images: string[] = new Array(this.THUMBNAIL_COUNT);

          for (let count = this.THUMBNAIL_COUNT - 1; count > 0; count -= 1) {
            this.setCurrentTime(secs);
            const image: string = await this.getImageAt();

            secs -= gap;
            images[count] = image;
          }

          this.setCurrentTime(start);
          images[0] = await this.getImageAt();
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
    const src = this.get('src');
    if (src) {
      URL.revokeObjectURL(src);
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
