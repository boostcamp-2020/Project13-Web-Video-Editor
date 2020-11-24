import {
  FETCH_START,
  SET_VIDEO,
  LOAD_METADATA,
  LOAD_SUCCESS,
  LOAD_ERROR,
} from './actionTypes';
import { OriginalVideoAction } from './actions';

export interface OriginalVideoState {
  video: File;
  URL: string;
  name: string;
  length: number;
  loading: boolean;
  downloading: boolean;
}

const initialState: OriginalVideoState = {
  video: null,
  URL: null,
  name: '',
  length: 0,
  loading: false,
  downloading: false,
};

export default (
  state: OriginalVideoState = initialState,
  action: OriginalVideoAction
): OriginalVideoState => {
  switch (action.type) {
    case FETCH_START:
      return {
        ...state,
        downloading: true,
      };
    case SET_VIDEO:
      return {
        video: action.payload.video,
        URL: action.payload.URL,
        name: action.payload.name,
        length: state.length,
        loading: true,
        downloading: false,
      };
    case LOAD_METADATA:
      return {
        ...state,
        length: action.payload.length,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case LOAD_ERROR:
      return initialState;
    default:
      return state;
  }
};
