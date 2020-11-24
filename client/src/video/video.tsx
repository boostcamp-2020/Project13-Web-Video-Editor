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

  play = () => {
    this._video.play();
  };

  pause = () => {
    this._video.pause();
  };

  addEventListener = (event, callback) => {
    this._video.addEventListener(event, callback);
  };

  removeEventListener = (event, callback) => {
    this._video.removeEventListener(event, callback);
  };
}

export default new Video();
