import {
  PLAY,
  PAUSE,
  MOVE_TO,
  SET_THUMBNAILS,
  LOAD_METADATA,
  CROP,
  AUDIO,
  RESET,
  ERROR,
  UPDATE_START_END,
} from '../actionTypes';
import { CurrentVideoAction } from './actions';

export interface CurrentVideoState {
  currentTime: number;
  start: number;
  end: number;
  playing: boolean;
  thumbnails: string[];
  isCancel: boolean;
  volume: number;
}

const initialState: CurrentVideoState = {
  currentTime: 0,
  start: 0,
  end: 0,
  playing: false,
  thumbnails: [],
  isCancel: false,
  volume: 1,
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
      return {
        ...state,
        currentTime: action.payload.time,
      };
    case LOAD_METADATA:
      return {
        ...state,
        end: action.payload.length,
      };
    case UPDATE_START_END:
    case SET_THUMBNAILS:
      return {
        ...state,
        ...action.payload,
        isCancel: false,
      };
    case CROP:
      return {
        ...state,
        start: action.payload.current.start,
        end: action.payload.current.end,
      };
    case AUDIO:
      return {
        ...state,
        volume: action.payload.volume,
      };
    case RESET:
      return {
        ...initialState,
        isCancel: true,
      };
    case ERROR:
    default:
      return state;
  }
};
