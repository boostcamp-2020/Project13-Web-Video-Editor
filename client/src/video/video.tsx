class Video {
  private _video: HTMLVideoElement;

  constructor() {
    this._video = document.createElement('video');
  }

  setSrc = (src: string) => {
    this._video.src = src;
  };

  setCurrentTime = (time: number) => {
    this._video.currentTime = time;
  };

  getDuration = () => {
    return this._video.duration;
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
