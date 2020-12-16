// originalVideo
export const FETCH_START = 'original/FETCH_START';
export const SET_VIDEO = 'original/SET_VIDEO';
export const LOAD_METADATA = 'original/LOAD_METADATA';
export const LOAD_SUCCESS = 'original/LOAD_SUCCESS';
export const ENCODE_START = 'original/ENCODE_START';
export const ENCODE_SUCCESS = 'original/ENCODE_SUCCESS';
export const UPLOAD_START = 'original/UPLOAD_START';

// currentVideo
export const PLAY = 'current/PLAY';
export const PAUSE = 'current/PAUSE';
export const MOVE_TO = 'current/MOVE_TO';
export const SET_THUMBNAILS = 'current/SET_THUMBNAILS';
export const CROP = 'current/CROP';
export const UPDATE_START_END = 'current/UPDATE_START_END';
export const AUDIO = ' current/AUDIO';

// crop
export const CROP_START = 'crop/CROP_START';
export const CROP_CANCEL = 'crop/CROP_CANCEL';
export const CROP_CONFIRM = 'crop/CROP_CONFIRM';

// video
export const FETCH_LIST_START = 'video/FETCH_LIST_START';
export const SET_VIDEO_LIST = 'video/SET_VIDEO_LIST';
export const UPLOAD_SUCCESS = 'video/UPLOAD_SUCCESS';

// user
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// history
export const UNDO = 'history/UNDO';
export const UNDO_SUCCESS = 'history/UNDO_SUCCESS';
export const REDO = 'history/REDO';
export const REDO_SUCCESS = 'history/REDO_SUCCESS';
export const CLEAR = 'history/CLEAR';
export const APPLY_EFFECT = 'history/APPLY_EFFECT';
export const APPLY_CROP = 'history/APPLY_CROP';
export const APPLY_FILTER = 'history/APPLY_FILTER';

// global
export const RESET = 'RESET';
export const reset = () => ({ type: RESET });
export type ResetAction = {
  type: typeof RESET;
};

export const ERROR = 'ERROR';
export const error = () => ({ type: ERROR });
export type ErrorAction = {
  type: typeof ERROR;
};
