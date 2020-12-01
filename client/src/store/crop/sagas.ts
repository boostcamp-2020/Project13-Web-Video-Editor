import { put, call, takeLatest } from 'redux-saga/effects';

import video from '@/video/video';
import webglController from '@/webgl/webglController';
import { setThumbnails } from '../currentVideo/actions';
import { CROP, error } from '../actionTypes';

function* updateThumbnails(action) {
  try {
    const thumbnails: string[] = yield call(
      video.makeThumbnails,
      action.payload.start,
      action.payload.end
    );
    yield call(webglController.main);
    yield put(setThumbnails(thumbnails));
  } catch (err) {
    console.log(err);
    yield put(error());
  }
}

export default function* CropThumbnail() {
  yield takeLatest(CROP, updateThumbnails);
}
