import {
  LoadMetadataAction,
  SetThumbnailsAction,
} from '@/store/currentVideo/actions';
import { Video, UploadSuccessAction } from '@/store/video/actions';
import { CropConfirmAction } from '@/store/crop/actions';
import {
  FETCH_START,
  SET_VIDEO,
  LOAD_METADATA,
  ENCODE_START,
  UPLOAD_START,
  ResetAction,
  ErrorAction,
} from '../actionTypes';

export const fetchStart = video => ({ type: FETCH_START, payload: video });

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
  payload: Video;
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
