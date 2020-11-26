import {
  PLAY,
  PAUSE,
  MOVE_TO,
  SET_THUMBNAILS,
  CROP,
  RESET,
  ERROR,
} from '../actionTypes';
import { CurrentVideoAction } from './actions';

export interface CurrentVideoState {
  currentTime: number;
  start: number;
  end: number;
  playing: boolean;
  thumbnails: string[];
}

const initialState: CurrentVideoState = {
  currentTime: 0,
  start: 0,
  end: 0,
  playing: false,
  thumbnails: [],
};

export default (
  state: CurrentVideoState = initialState,
  action: CurrentVideoAction
): CurrentVideoState => {
  switch (action.type) {
    case PLAY:
      return {
        ...state,
        playing: true,
      };
    case PAUSE:
      return {
        ...state,
        playing: false,
      };
    case MOVE_TO:
    case SET_THUMBNAILS:
    case CROP:
      return {
        ...state,
        ...action.payload,
      };
    case RESET:
      return initialState;
    case ERROR:
    default:
      return state;
  }
};
