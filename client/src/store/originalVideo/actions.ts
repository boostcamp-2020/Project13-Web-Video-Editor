import {
  LoadMetadataAction,
  SetThumbnailsAction,
} from '@/store/currentVideo/actions';
import {
  FETCH_START,
  SET_VIDEO,
  LOAD_METADATA,
  LOAD_SUCCESS,
  ResetAction,
  ErrorAction,
} from '../actionTypes';

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

export type OriginalVideoAction =
  | FetchStartAction
  | SetVideoAction
  | LoadMetadataAction
  | SetThumbnailsAction
  | ErrorAction
  | ResetAction;
