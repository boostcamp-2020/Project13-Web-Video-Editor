import {
  FETCH_START,
  SET_VIDEO,
  LOAD_METADATA,
  LOAD_SUCCESS,
  RESET,
  ERROR,
} from './actionTypes';

// TODO: export const fetchStart = () => ({ type: FETCH_START });

export const setVideo = (video: File, URL: string) => ({
  type: SET_VIDEO,
  payload: {
    video,
    URL,
    name: video.name,
  },
});

export const loadMetadata = length => ({
  type: LOAD_METADATA,
  payload: { length },
});

export const loadSuccess = () => ({ type: LOAD_SUCCESS });
export const error = () => ({ type: ERROR });
export const reset = () => ({ type: RESET });

type FetchStartAction = {
  type: typeof FETCH_START;
};

type SetVideoAction = {
  type: typeof SET_VIDEO;
  payload: {
    video: File;
    name: string;
    URL: string;
  };
};

type LoadMetadataAction = {
  type: typeof LOAD_METADATA;
  payload: {
    length: number;
  };
};

type LoadSuccessAction = {
  type: typeof LOAD_SUCCESS;
};

type ErrorAction = {
  type: typeof ERROR;
};

type ResetAction = {
  type: typeof RESET;
};

export type OriginalVideoAction =
  | FetchStartAction
  | SetVideoAction
  | LoadMetadataAction
  | LoadSuccessAction
  | ErrorAction
  | ResetAction;
