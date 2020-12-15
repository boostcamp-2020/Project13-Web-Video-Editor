import { RATIO, INVERSE } from '@/webgl/webglController';
import {
  UNDO_SUCCESS,
  REDO_SUCCESS,
  APPLY_EFFECT,
  RESET,
  CLEAR,
  APPLY_CROP,
  APPLY_FILTER,
} from '../actionTypes';
import { HistoryAction, Log, Effect, Status, FilterStatus } from './actions';

export const MAX_HISTORY = 20;

export interface HistoryState {
  logs: Log[];
  index: number;
  status: Status;
  filterStatus: FilterStatus;
}

const initialState: HistoryState = {
  logs: [],
  index: 0,
  status: {
    scale: 1,
    rotation: 0,
    flipped: false,
  },
  filterStatus: {
    blur: 0,
    grayScale: 0,
    brightness: 1,
  },
};

const getStatusFromEffect = (status: Status, effect: Effect) => {
  switch (effect) {
    case Effect.RotateClockwise:
      return {
        ...status,
        rotation: (status.rotation + (status.flipped ? 270 : 90)) % 360,
      };
    case Effect.RotateCounterClockwise:
      return {
        ...status,
        rotation: (status.rotation + (status.flipped ? 90 : 270)) % 360,
      };
    case Effect.FlipHorizontal:
      return {
        ...status,
        rotation: (status.rotation + 180) % 360,
        flipped: !status.flipped,
      };
    case Effect.FlipVertical:
      return {
        ...status,
        flipped: !status.flipped,
      };
    case Effect.Enlarge:
      return {
        ...status,
        scale: status.scale * RATIO,
      };
    case Effect.Reduce:
      return {
        ...status,
        scale: status.scale * INVERSE,
      };
    default:
      return status;
  }
};

export default (
  state: HistoryState = initialState,
  action: HistoryAction
): HistoryState => {
  const isFull = state.index === MAX_HISTORY;
  const logs = state.logs.slice(isFull ? 1 : 0, state.index);

  switch (action.type) {
    case UNDO_SUCCESS: // fallthrough
    case REDO_SUCCESS:
      return {
        ...state,
        index: action.payload.index,
        status: getStatusFromEffect(state.status, action.payload.reverseEffect),
      };
    case APPLY_EFFECT:
      return {
        ...state,
        logs: [...logs, { effect: action.payload.effect }],
        index: state.index === MAX_HISTORY ? state.index : state.index + 1,
        status: getStatusFromEffect(state.status, action.payload.effect),
      };
    case APPLY_CROP:
      return {
        ...state,
        logs: [
          ...logs,
          {
            effect: Effect.Crop,
            thumbnails: {
              prev: action.payload.thumbnails.prev,
              current: action.payload.thumbnails.current,
            },
            interval: {
              prev: action.payload.interval.prev,
              current: action.payload.interval.current,
            },
          },
        ],
        index: state.index === MAX_HISTORY ? state.index : state.index + 1,
      };
    case APPLY_FILTER:
      return {
        ...state,
        filterStatus: {
          blur: action.payload.filterStatus.blur
            ? action.payload.filterStatus.blur
            : state.filterStatus.blur,
          grayScale:
            action.payload.filterStatus.grayScale !== undefined
              ? action.payload.filterStatus.grayScale
              : state.filterStatus.grayScale,
          brightness: action.payload.filterStatus.brightness
            ? action.payload.filterStatus.brightness
            : state.filterStatus.brightness,
        },
      };
    case CLEAR:
    case RESET:
      return initialState;
    default:
      return state;
  }
};
