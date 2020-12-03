import {
  FETCH_LIST_START,
  SET_VIDEO_LIST,
  UPLOAD_SUCCESS,
} from '../actionTypes';

export type Video = {
  id: number;
  name: string;
  video: string;
  updatedAt: Date;
};

export const fetchListStart = () => ({ type: FETCH_LIST_START });
export const setVideoList = (videos: Video[]) => ({
  type: SET_VIDEO_LIST,
  payload: { videos },
});
export const uploadSuccess = (video: Video) => ({
  type: UPLOAD_SUCCESS,
  payload: { video },
});

type FetchListStartAction = {
  type: typeof FETCH_LIST_START;
};

type SetVideoListAction = {
  type: typeof SET_VIDEO_LIST;
  payload: {
    videos: Video[];
  };
};

export type UploadSuccessAction = {
  type: typeof UPLOAD_SUCCESS;
  payload: {
    video: Video;
  };
};

export type VideoAction =
  | FetchListStartAction
  | SetVideoListAction
  | UploadSuccessAction;
