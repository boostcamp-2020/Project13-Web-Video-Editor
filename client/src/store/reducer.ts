import { combineReducers } from 'redux';
import originalVideo, { OriginalVideoState } from './originalVideo/reducer';
import currentVideo, { CurrentVideoState } from './currentVideo/reducer';
import crop, { CropState } from './crop/reducer';

export interface RootState {
  originalVideo: OriginalVideoState;
  currentVideo: CurrentVideoState;
  crop: CropState;
}

const reducers = {
  originalVideo,
  currentVideo,
  crop,
};

export default combineReducers(reducers);
