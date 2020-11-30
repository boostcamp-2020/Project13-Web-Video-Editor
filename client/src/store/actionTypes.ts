// originalVideo
export const FETCH_START = 'original/FETCH_START';
export const SET_VIDEO = 'original/SET_VIDEO';
export const LOAD_METADATA = 'original/LOAD_METADATA';
export const LOAD_SUCCESS = 'original/LOAD_SUCCESS';
/*
export const PROCESS_START = 'original/PROCESS_START';
export const PROCESS_SUCCESS = 'original/PROCESS_SUCCESS';
export const PROCESS_ERROR = 'original/PROCESS_ERROR';
*/

// currentVideo
export const PLAY = 'current/PLAY';
export const PAUSE = 'current/PAUSE';
export const MOVE_TO = 'current/MOVE_TO';
export const SET_THUMBNAILS = 'current/SET_THUMBNAILS';
export const CROP = 'current/CROP';

// crop
export const CROP_START = 'crop/CROP_START';
export const cropStart = () => ({ type: CROP_START });

export const CROP_CANCEL = 'crop/CROP_CANCEL';
export const cropCancel = () => ({ type: CROP_CANCEL });

export const CROP_CONFIRM = 'crop/CROP_CONFIRM';
export const cropConfirm = () => ({ type: CROP_CONFIRM });

export const CROP_END = 'crop/CROP_END';
export const cropEnd = () => ({ type: CROP_END });
// history

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
