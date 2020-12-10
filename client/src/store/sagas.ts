import { all, call, takeEvery } from 'redux-saga/effects';
import {
  watchFetchStart,
  watchSetVideo,
  watchEncodeStart,
  watchUploadStart,
  deleteSrc,
  clearErrorLoading,
} from '@/store/originalVideo/sagas';
import watchFetchListStart from '@/store/video/sagas';
import watchCrop from '@/store/crop/sagas';
import { watchApplyEffect, watchHistory } from '@/store/history/sagas';
import { ERROR, RESET } from './actionTypes';

function* watchReset() {
  yield takeEvery(RESET, deleteSrc);
}

function* watchError() {
  yield takeEvery(ERROR, clearErrorLoading);
}

export default function* rootSaga() {
  yield all([
    watchFetchStart(),
    watchSetVideo(),
    watchEncodeStart(),
    watchUploadStart(),
    watchReset(),
    watchCrop(),
    watchFetchListStart(),
    watchApplyEffect(),
    watchHistory(),
    watchError(),
  ]);
}
