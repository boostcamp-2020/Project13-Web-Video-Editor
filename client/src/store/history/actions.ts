import {
  UNDO,
  UNDO_SUCCESS,
  REDO,
  REDO_SUCCESS,
  CLEAR,
  APPLY_EFFECT,
  APPLY_CROP,
  APPLY_FILTER,
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

export interface Interval {
  prev: {
    start: number;
    end: number;
  };
  current: {
    start: number;
    end: number;
  };
}

export interface Status {
  scale: number;
  rotation: number;
  flipped: boolean;
}

export interface FilterStatus {
  blur?: number;
  grayScale?: number;
  brightness?: number;
}

export interface Thumbnails {
  prev: string[];
  current: string[];
}

export interface Log {
  effect: Effect;
  thumbnails?: Thumbnails;
  interval?: Interval;
}

export const undo = () => ({
  type: UNDO,
});

export const undoSuccess = (index, reverseEffect = undefined) => ({
  type: UNDO_SUCCESS,
  payload: {
    index,
    reverseEffect,
  },
});

export const redo = () => ({
  type: REDO,
});

export const redoSuccess = (index, reverseEffect = undefined) => ({
  type: REDO_SUCCESS,
  payload: {
    index,
    reverseEffect,
  },
});

export const clear = () => ({
  type: CLEAR,
});

export const applyEffect = (effect: Effect) => ({
  type: APPLY_EFFECT,
  payload: { effect },
});

export const applyCrop = (thumbnails: Thumbnails, interval: Interval) => ({
  type: APPLY_CROP,
  payload: {
    thumbnails,
    interval,
  },
});

export const applyFilter = (filterStatus: FilterStatus) => ({
  type: APPLY_FILTER,
  payload: {
    filterStatus,
  },
});

export type HistoryUndoSuccessAction = {
  type: typeof UNDO_SUCCESS;
  payload: {
    index: number;
    reverseEffect: Effect;
  };
};

export type HistoryRedoSuccessAction = {
  type: typeof REDO_SUCCESS;
  payload: {
    index: number;
    reverseEffect: Effect;
  };
};

export type HistoryClearAction = {
  type: typeof CLEAR;
};

export type HistoryApplyEffectAction = {
  type: typeof APPLY_EFFECT;
  payload: Log;
};

export type HistoryApplyCropAction = {
  type: typeof APPLY_CROP;
  payload: {
    thumbnails: Thumbnails;
    interval: Interval;
  };
};

export type HistoryApplyFilterAction = {
  type: typeof APPLY_FILTER;
  payload: {
    filterStatus: FilterStatus;
  };
};

export type HistoryAction =
  | HistoryUndoSuccessAction
  | HistoryRedoSuccessAction
  | HistoryClearAction
  | HistoryApplyEffectAction
  | HistoryApplyCropAction
  | HistoryApplyFilterAction
  | CropAction
  | ResetAction;
