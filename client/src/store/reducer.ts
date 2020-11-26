import { combineReducers } from 'redux';
import originalVideo, { OriginalVideoState } from './originalVideo/reducer';
import currentVideo, { CurrentVideoState } from './currentVideo/reducer';

export interface RootState {
  originalVideo: OriginalVideoState;
  currentVideo: CurrentVideoState;
}

const reducers = {
  originalVideo,
  currentVideo,
};

export default combineReducers(reducers);
