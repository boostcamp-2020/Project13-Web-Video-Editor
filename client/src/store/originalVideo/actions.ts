import { FETCH_START, FETCH_SUCCESS, FETCH_ERROR } from './actionTypes';

export interface FileInfo {
  name: string;
  extension: string;
  length: number;
}

export const startUpload = () => ({ type: FETCH_START });

export const load = (video: ArrayBuffer, file: FileInfo) => ({
  type: FETCH_SUCCESS,
  payload: {
    video,
    file,
  },
});

export const unload = () => ({ type: FETCH_ERROR });

export type OriginalVideoAction = {
  type: string;
  payload?: {
    video: ArrayBuffer;
    file: FileInfo;
  };
};
