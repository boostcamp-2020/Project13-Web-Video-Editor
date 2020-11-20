import { FETCH_START, FETCH_SUCCESS, FETCH_ERROR } from './actionTypes';
import { FileInfo, OriginalVideoAction } from './actions';

export interface OriginalVideoState {
  video: ArrayBuffer;
  file: FileInfo;
  uploading: boolean;
}

const initialState: OriginalVideoState = {
  video: null,
  file: {
    name: '',
    extension: '',
    length: 0,
  },
  uploading: false,
};

export default (
  state: OriginalVideoState = initialState,
  action: OriginalVideoAction
): OriginalVideoState => {
  switch (action.type) {
    case FETCH_START:
      return {
        ...state,
        uploading: true,
      };
    case FETCH_SUCCESS:
      return {
        ...action.payload,
        uploading: false,
      };
    case FETCH_ERROR:
      return initialState;
    default:
      return state;
  }
};
