import {
  PLAY,
  PAUSE,
  MOVE_TO,
  SET_THUMBNAILS,
  LOAD_METADATA,
  CROP,
  ResetAction,
  ErrorAction,
} from '../actionTypes';

export const play = () => ({ type: PLAY });
export const pause = () => ({ type: PAUSE });

export const moveTo = (time: number) => ({
  type: MOVE_TO,
  payload: {
    time,
  },
});

export const setThumbnails = (thumbnails: string[]) => ({
  type: SET_THUMBNAILS,
  payload: {
    thumbnails,
  },
});

export const crop = (start: number, end: number) => ({
  type: CROP,
  payload: {
    start,
    end,
  },
});

type PlayAction = { type: typeof PLAY };
type PauseAction = { type: typeof PAUSE };

type MoveToAction = {
  type: typeof MOVE_TO;
  payload: {
    time: number;
  };
};

export type SetThumbnailsAction = {
  type: typeof SET_THUMBNAILS;
  payload: {
    thumbnails: string[];
  };
};

export type CropAction = {
  type: typeof CROP;
  payload: {
    start: number;
    end: number;
  };
};

export type LoadMetadataAction = {
  type: typeof LOAD_METADATA;
  payload: {
    length: number;
  };
};

export type CurrentVideoAction =
  | PlayAction
  | PauseAction
  | MoveToAction
  | SetThumbnailsAction
  | CropAction
  | LoadMetadataAction
  | ResetAction
  | ErrorAction;
