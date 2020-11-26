import { all, call, takeEvery } from 'redux-saga/effects';
import video from '@/video';
import watchSetVideo from '@/store/originalVideo/sagas';
import { RESET } from './actionTypes';

function revokeURL() {
  const src = video.getSrc();
  if (src) {
    URL.revokeObjectURL(src);
    video.getVideo().removeAttribute('src');
    video.load();
  }
}

function* deleteSrc(action) {
  yield call(revokeURL);
}

function* watchReset() {
  yield takeEvery(RESET, deleteSrc);
}

export default function* rootSaga() {
  yield all([watchSetVideo(), watchReset()]);
}
