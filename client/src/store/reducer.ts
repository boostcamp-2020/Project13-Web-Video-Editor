import { combineReducers } from 'redux';
import originalVideo, { OriginalVideoState } from './originalVideo/reducer';

export interface RootState {
  originalVideo: OriginalVideoState;
}

const reducers = {
  originalVideo,
};

export default combineReducers(reducers);
