import { all, call, takeEvery } from 'redux-saga/effects';
import video from '@/video';
import watchSetVideo from '@/store/originalVideo/sagas';
import { RESET } from './actionTypes';

function* deleteSrc() {
  yield call(video.revoke);
}

function* watchReset() {
  yield takeEvery(RESET, deleteSrc);
}

export default function* rootSaga() {
  yield all([watchSetVideo(), watchReset()]);
}
