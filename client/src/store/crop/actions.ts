import {
  CROP_START,
  CROP_CANCEL,
  CROP_CONFIRM,
  CROP_END,
} from '../actionTypes';

export const cropStart = () => ({
  type: typeof CROP_START,
});

export const cropCancel = () => ({
  type: typeof CROP_CANCEL,
});

export const cropConfirm = () => ({
  type: typeof CROP_CONFIRM,
});

export const cropEnd = () => ({
  type: typeof CROP_END,
});

export type CropStartAction = {
  type: typeof CROP_START;
};

export type CropCancelAction = {
  type: typeof CROP_CANCEL;
};

export type CropConfirmAction = {
  type: typeof CROP_CONFIRM;
};

export type CropEnd = {
  type: typeof CROP_END;
};

export type CropAction =
  | CropStartAction
  | CropCancelAction
  | CropConfirmAction
  | CropEnd;
