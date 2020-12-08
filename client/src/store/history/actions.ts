import {
  UNDO,
  REDO,
  CLEAR,
  APPLY_EFFECT,
  APPLY_CROP,
  ResetAction,
} from '../actionTypes';
import { CropAction } from '../currentVideo/actions';

export enum Effect {
  RotateCounterClockwise,
  RotateClockwise,
  FlipHorizontal,
  FlipVertical,
  Enlarge,
  Reduce,
  Crop,
}

interface Interval {
  start: number;
  end: number;
}

export interface Status {
  scale: number;
  rotation: number;
  flipped: boolean;
}

export interface Log {
  effect: Effect;
  thumbnails?: string[];
  interval?: Interval;
}

export const undo = () => ({
  type: UNDO,
});

export const redo = () => ({
  type: REDO,
});

export const clear = () => ({
  type: CLEAR,
});

export const applyEffect = (effect: Effect) => ({
  type: APPLY_EFFECT,
  payload: { effect },
});

export const applyCrop = (
  thumbnails: string[],
  start: number,
  end: number
) => ({
  type: APPLY_CROP,
  payload: { thumbnails, start, end },
});

export type HistoryUndoAction = {
  type: typeof UNDO;
};

export type HistoryRedoAction = {
  type: typeof REDO;
};

export type HistoryClearAction = {
  type: typeof CLEAR;
};

export type HistoryApplyEffect = {
  type: typeof APPLY_EFFECT;
  payload: Log;
};

export type HistoryApplyCrop = {
  type: typeof APPLY_CROP;
  payload: {
    thumbnails: string[];
    start: number;
    end: number;
  };
};

export type HistoryAction =
  | HistoryUndoAction
  | HistoryRedoAction
  | HistoryClearAction
  | HistoryApplyEffect
  | HistoryApplyCrop
  | CropAction
  | ResetAction;
