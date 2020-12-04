import { combineReducers } from 'redux';
import originalVideo, { OriginalVideoState } from './originalVideo/reducer';
import currentVideo, { CurrentVideoState } from './currentVideo/reducer';
import crop, { CropState } from './crop/reducer';
import video, { VideoState } from './video/reducer';

export interface RootState {
  originalVideo: OriginalVideoState;
  currentVideo: CurrentVideoState;
  crop: CropState;
  video: VideoState;
}

const reducers = {
  originalVideo,
  currentVideo,
  crop,
  video,
};

export default combineReducers(reducers);
