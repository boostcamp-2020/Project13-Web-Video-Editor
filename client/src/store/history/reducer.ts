import { RATIO, INVERSE } from '@/webgl/webglController';
import {
  UNDO_SUCCESS,
  REDO_SUCCESS,
  APPLY_EFFECT,
  RESET,
  CLEAR,
  APPLY_CROP,
  APPLY_FILTER,
  RESET_FILTER,
} from '../actionTypes';

import {
  HistoryAction,
  Log,
  Effect,
  Status,
  Filter,
  FilterStatus,
} from './actions';

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
    [Filter.RED]: 100,
    [Filter.GREEN]: 100,
    [Filter.BLUE]: 100,
    [Filter.LUMINANCE]: 50,
    [Filter.BLUR]: 0,
    [Filter.GRAYSCALE]: 0,
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
          ...state.filterStatus,
          ...action.payload.filterStatus,
        },
      };
    case RESET_FILTER:
      return {
        ...state,
        filterStatus: initialState.filterStatus,
      };
    case CLEAR:
    case RESET:
      return initialState;
    default:
      return state;
  }
};
