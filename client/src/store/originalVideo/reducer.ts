import {
  FETCH_START,
  SET_VIDEO,
  LOAD_METADATA,
  SET_THUMBNAILS,
  CROP_CONFIRM,
  ENCODE_START,
  ENCODE_SUCCESS,
  UPLOAD_START,
  UPLOAD_SUCCESS,
  RESET,
  ERROR,
} from '../actionTypes';
import { OriginalVideoAction } from './actions';

export enum Message {
  OK = '',
  DOWNLOADING = '서버에서 동영상을 다운로드하는 중...',
  LOADING = '동영상을 로드하는 중...',
  PROCESSING = '썸네일을 다시 추출하는 중...',
  ENCODING = '편집한 동영상을 인코딩하는 중...',
  MUXING = '오디오 트랙을 병합하는 중...',
  UPLOADING = '서버에 동영상을 업로드하는 중...',
  FAIL = '작업에 실패하였습니다.',
}

export interface OriginalVideoState {
  video: File;
  URL: string;
  name: string;
  length: number;
  message: Message;
}

const initialState: OriginalVideoState = {
  video: null,
  URL: null,
  name: '',
  length: 0,
  message: Message.OK,
};

export default (
  state: OriginalVideoState = initialState,
  action: OriginalVideoAction
): OriginalVideoState => {
  switch (action.type) {
    case FETCH_START:
      return {
        ...state,
        message: Message.DOWNLOADING,
      };
    case SET_VIDEO:
      return {
        ...action.payload,
        length: state.length,
        message: Message.LOADING,
      };
    case LOAD_METADATA:
      return {
        ...state,
        length: action.payload.length,
      };
    case SET_THUMBNAILS:
      return {
        ...state,
        message: Message.OK,
      };
    case CROP_CONFIRM:
      return {
        ...state,
        message: Message.PROCESSING,
      };
    case ENCODE_START:
      return {
        ...state,
        message: Message.ENCODING,
      };
    case ENCODE_SUCCESS:
      return {
        ...state,
        message: Message.MUXING,
      };
    case UPLOAD_START:
      return {
        ...state,
        message: Message.UPLOADING,
      };
    case ERROR:
      return {
        ...initialState,
        message: Message.FAIL,
      };
    case UPLOAD_SUCCESS:
    case RESET:
      return initialState;
    default:
      return state;
  }
};
