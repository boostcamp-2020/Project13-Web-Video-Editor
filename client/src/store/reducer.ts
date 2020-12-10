import { combineReducers } from 'redux';
import originalVideo, { OriginalVideoState } from './originalVideo/reducer';
import currentVideo, { CurrentVideoState } from './currentVideo/reducer';
import crop, { CropState } from './crop/reducer';
import video, { VideoState } from './video/reducer';
import history, { HistoryState } from './history/reducer';

export interface RootState {
  originalVideo: OriginalVideoState;
  currentVideo: CurrentVideoState;
  crop: CropState;
  video: VideoState;
  history: HistoryState;
}

const reducers = {
  originalVideo,
  currentVideo,
  crop,
  video,
  history,
};

export default combineReducers(reducers);
