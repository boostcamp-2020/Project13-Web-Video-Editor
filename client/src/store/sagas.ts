import { all, call, takeEvery } from 'redux-saga/effects';
import {
  watchSetVideo,
  watchEncodeStart,
  watchUploadStart,
  deleteSrc,
} from '@/store/originalVideo/sagas';
import watchCrop from '@/store/crop/sagas';
import { RESET } from './actionTypes';

function* watchReset() {
  yield takeEvery(RESET, deleteSrc);
}

export default function* rootSaga() {
  yield all([
    watchSetVideo(),
    watchEncodeStart(),
    watchUploadStart(),
    watchReset(),
    watchCrop(),
  ]);
}
