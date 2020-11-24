import {
  FETCH_START,
  SET_VIDEO,
  LOAD_METADATA,
  LOAD_SUCCESS,
  LOAD_ERROR,
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

type LoadErrorAction = {
  type: typeof LOAD_ERROR;
};

export type OriginalVideoAction =
  | FetchStartAction
  | SetVideoAction
  | LoadMetadataAction
  | LoadSuccessAction
  | LoadErrorAction;
