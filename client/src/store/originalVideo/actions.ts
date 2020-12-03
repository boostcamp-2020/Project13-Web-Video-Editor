import {
  LoadMetadataAction,
  SetThumbnailsAction,
} from '@/store/currentVideo/actions';
import { UploadSuccessAction } from '@/store/video/actions';
import { CropConfirmAction } from '@/store/crop/actions';
import {
  FETCH_START,
  SET_VIDEO,
  LOAD_METADATA,
  LOAD_SUCCESS,
  ENCODE_START,
  UPLOAD_START,
  UPLOAD_SUCCESS,
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

export const encodeStart = name => ({
  type: ENCODE_START,
  payload: { name },
});

export const uploadStart = file => ({
  type: UPLOAD_START,
  payload: { file },
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

export type EncodeStartAction = {
  type: typeof ENCODE_START;
  payload: {
    name: string;
  };
};

type UploadStartAction = {
  type: typeof UPLOAD_START;
  payload: {
    file: File;
  };
};

export type OriginalVideoAction =
  | FetchStartAction
  | SetVideoAction
  | LoadMetadataAction
  | SetThumbnailsAction
  | CropConfirmAction
  | EncodeStartAction
  | UploadStartAction
  | UploadSuccessAction
  | ErrorAction
  | ResetAction;
