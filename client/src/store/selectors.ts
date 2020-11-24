import { RootState } from './reducer';

// originalVideo
export const getName = (state: RootState) => state.originalVideo.name;

export const getInfo = (state: RootState) => {
  const { URL, length } = state.originalVideo;
  return { URL, length };
};

export const getFile = (state: RootState) => state.originalVideo.video;

export const getURL = (state: RootState) => state.originalVideo.URL;
