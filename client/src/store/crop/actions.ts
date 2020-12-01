import { CROP_START, CROP_CANCEL, CROP_CONFIRM, CROP } from '../actionTypes';

export const cropStart = () => ({
  type: typeof CROP_START,
});

export const cropCancel = () => ({
  type: typeof CROP_CANCEL,
});

export const cropConfirm = () => ({
  type: typeof CROP_CONFIRM,
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

export type Crop = {
  type: typeof CROP;
};

export type CropAction =
  | CropStartAction
  | CropCancelAction
  | CropConfirmAction
  | Crop;
