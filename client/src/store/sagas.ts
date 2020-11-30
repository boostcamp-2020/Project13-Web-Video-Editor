import { all, call, takeEvery } from 'redux-saga/effects';
import { watchSetVideo, deleteSrc } from '@/store/originalVideo/sagas';
import { RESET } from './actionTypes';

function* watchReset() {
  yield takeEvery(RESET, deleteSrc);
}

export default function* rootSaga() {
  yield all([watchSetVideo(), watchReset()]);
}
