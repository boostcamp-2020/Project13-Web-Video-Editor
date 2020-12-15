import { RootState } from './reducer';

// originalVideo
export const getName = (state: RootState) => state.originalVideo.name;
export const getInfo = (state: RootState) => {
  const { URL, length } = state.originalVideo;
  return { URL, length };
};
export const getFile = (state: RootState) => state.originalVideo.video;
export const getURL = (state: RootState) => state.originalVideo.URL;
export const getDuration = (state: RootState) => state.originalVideo.length;
export const getVisible = (state: RootState) => {
  const { message, URL } = state.originalVideo;
  return URL && !message;
};
export const getMessage = (state: RootState) => state.originalVideo.message;

// currentVideo
export const getPlaying = (state: RootState) => state.currentVideo.playing;
export const getCurrentTime = (state: RootState) =>
  state.currentVideo.currentTime;
export const getStartEnd = (state: RootState) => {
  const { start, end } = state.currentVideo;
  return { start, end };
};
export const getThumbnails = (state: RootState) =>
  state.currentVideo.thumbnails;
export const getIsCancel = (state: RootState) => {
  return state.currentVideo.isCancel;
};

// crop
export const getIsCrop = (state: RootState) => state.crop.isCrop;

export const getIsCropConfirm = (state: RootState) => state.crop.isCropConfirm;

export const getCropState = (state: RootState) => {
  const { isCrop } = state.crop;
  const { isCropConfirm } = state.crop;

  return {
    isCrop,
    isCropConfirm,
  };
};
export const getIsCropAndDuration = (state: RootState) => {
  const { isCrop } = state.crop;
  const { length } = state.originalVideo;

  return {
    isCrop,
    duration: length,
  };
};

// video
export const getVideos = (state: RootState) => state.video.videos;

// history
export const getIndexAndLogs = (state: RootState) => {
  const { index, logs } = state.history;
  return {
    index,
    logs,
  };
};

export const getIsPrevDisabled = (state: RootState) => {
  const { index } = state.history;
  return index === 0;
};

export const getIsNextDisabled = (state: RootState) => {
  const { index, logs } = state.history;
  return index === logs.length;
};

export const getStatus = (state: RootState) => state.history.status;

export const getFilterStatus = (state: RootState) => state.history.filterStatus;
