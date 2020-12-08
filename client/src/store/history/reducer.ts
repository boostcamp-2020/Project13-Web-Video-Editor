import { RATIO, INVERSE } from '@/webgl/webglController';
import {
  UNDO,
  REDO,
  APPLY_EFFECT,
  CROP,
  RESET,
  CLEAR,
  APPLY_CROP,
} from '../actionTypes';
import { HistoryAction, Log, Effect, Status } from './actions';

export interface HistoryState {
  logs: Log[];
  index: number;
  status: Status;
}

const initialState: HistoryState = {
  logs: [],
  index: 0,
  status: {
    scale: 1,
    rotation: 0,
    flipped: false,
  },
};

const getStatusFromEffect = (status: Status, effect: Effect) => {
  switch (effect) {
    case Effect.RotateClockwise:
      return {
        ...status,
        rotation: (status.rotation + 90) % 360,
      };
    case Effect.RotateCounterClockwise:
      return {
        ...status,
        rotation: (status.rotation + 270) % 360,
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
  // console.log(action);
  let logs = [...state.logs];
  console.log(logs);

  if (action.type === (APPLY_EFFECT || CROP))
    logs = state.logs.slice(0, state.index);
  if (state.logs.length >= 20) logs.shift();

  switch (action.type) {
    case UNDO:
      return {
        ...state,
        index: state.index === 0 ? state.index : state.index - 1,
      };
    case REDO:
      return {
        ...state,
        index: state.index === 20 ? state.index : state.index + 1,
      };
    case APPLY_EFFECT:
      return {
        ...state,
        logs: [...logs, { effect: action.payload.effect }],
        index: state.index === 20 ? state.index : state.index + 1,
        status: getStatusFromEffect(state.status, action.payload.effect),
      };
    case APPLY_CROP:
      return {
        ...state,
        logs: [
          ...logs,
          {
            effect: Effect.Crop,
            thumbnails: action.payload.thumbnails,
            interval: { start: action.payload.start, end: action.payload.end },
          },
        ],
        index: state.index === 20 ? state.index : state.index + 1,
      };
    case CLEAR:
    case RESET:
      return initialState;
    default:
      return state;
  }
};
