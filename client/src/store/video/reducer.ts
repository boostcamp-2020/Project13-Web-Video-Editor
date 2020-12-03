import {
  FETCH_LIST_START,
  SET_VIDEO_LIST,
  UPLOAD_SUCCESS,
} from '../actionTypes';
import { Video, VideoAction } from './actions';

export interface VideoState {
  videos: Video[];
}

const initialState: VideoState = {
  videos: null,
};

export default (
  state: VideoState = initialState,
  action: VideoAction
): VideoState => {
  switch (action.type) {
    case SET_VIDEO_LIST:
      return {
        videos: action.payload.videos,
      };
    case UPLOAD_SUCCESS:
      return {
        videos: state.videos
          ? [...state.videos, action.payload.video]
          : [action.payload.video],
      };
    case FETCH_LIST_START:
    default:
      return state;
  }
};
