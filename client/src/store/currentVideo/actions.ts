import {
  PLAY,
  PAUSE,
  MOVE_TO,
  SET_THUMBNAILS,
  CROP,
  ResetAction,
  ErrorAction,
} from '../actionTypes';
import { LoadMetadataAction } from '../originalVideo/actions';

export const play = () => ({ type: PLAY });
export const pause = () => ({ type: PAUSE });

export const moveTo = (time: number) => ({
  type: MOVE_TO,
  payload: {
    time,
  },
});

export const setThumbnails = (thumbnail: string[]) => ({
  type: SET_THUMBNAILS,
  payload: {
    thumbnail,
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

type SetThumbnailsAction = {
  type: typeof SET_THUMBNAILS;
  payload: {
    thumbnails: string[];
  };
};

type CropAction = {
  type: typeof CROP;
  payload: {
    start: number;
    end: number;
  };
};

export type CurrentVideoAction =
  | PlayAction
  | PauseAction
  | MoveToAction
  | SetThumbnailsAction
  | CropAction
  | ResetAction
  | ErrorAction
  | LoadMetadataAction;
