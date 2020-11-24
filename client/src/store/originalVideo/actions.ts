import {
  // FETCH_START,
  SET_VIDEO,
  LOAD_METADATA,
  // LOAD_SUCCESS,
  // LOAD_ERROR,
} from './actionTypes';

// TODO: export const startUpload = () => ({ type: FETCH_START });

export const setVideo = (video: File) => ({
  type: SET_VIDEO,
  payload: {
    video,
    URL: URL.createObjectURL(video),
    name: video.name,
  },
});

export const loadMetadata = length => ({ type: LOAD_METADATA, length });

// export const loadSuccess = () => ({ type: LOAD_SUCCESS });

export type OriginalVideoAction = {
  type: string;
  payload?: {
    video: File;
    name: string;
    URL: string;
  };
};
