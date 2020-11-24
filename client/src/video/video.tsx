class Video {
  private _video: HTMLVideoElement;

  constructor() {
    this._video = document.createElement('video');
    this._video.preload = 'auto';
  }

  // getter
  getVideo = () => {
    return this._video;
  };

  getDuration = () => {
    return this._video.duration;
  };

  getVideoWidth = () => {
    return this._video.videoWidth;
  };

  getVideoHeight = () => {
    return this._video.videoHeight;
  };

  // setter
  setSrc = (src: string) => {
    this._video.src = src;
  };

  setCurrentTime = (time: number) => {
    this._video.currentTime = time;
  };

  play = () => {
    this._video.play();
  };

  pause = () => {
    this._video.pause();
  };

  addEventListener = (event: string, callback: () => void) => {
    this._video.addEventListener(event, callback);
  };

  removeEventListener = (event: string, callback: () => void) => {
    this._video.removeEventListener(event, callback);
  };
}

export default new Video();
