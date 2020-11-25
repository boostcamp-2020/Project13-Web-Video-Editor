import {
  FETCH_START,
  SET_VIDEO,
  LOAD_METADATA,
  LOAD_SUCCESS,
  RESET,
  ERROR,
} from './actionTypes';
import { OriginalVideoAction } from './actions';

enum Message {
  OK = '',
  DOWNLOADING = '서버에서 동영상을 다운로드하는 중...',
  LOADING = '동영상을 로드하는 중...',
  PROCESSING = '편집한 동영상을 저장하는 중...',
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
    case LOAD_SUCCESS:
      return {
        ...state,
        message: Message.OK,
      };
    case ERROR:
      return {
        ...initialState,
        message: Message.FAIL,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
};
