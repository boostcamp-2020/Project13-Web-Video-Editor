import { put, call, takeLatest, select } from 'redux-saga/effects';

import video from '@/video';
import webglController from '@/webgl/webglController';
import { setThumbnails, moveTo, pause } from '../currentVideo/actions';
import { CROP, error } from '../actionTypes';
import { applyCrop } from '../history/actions';
import { getThumbnails } from '../selectors';

function* updateThumbnails(action) {
  try {
    const prevThumbnails = yield select(getThumbnails);
    const { start, end } = action.payload.current;
    const { start: prevStart, end: prevEnd } = action.payload.prev;

    yield call(video.pause);
    yield put(pause());
    const thumbnails: string[] = yield call(video.makeThumbnails, start, end);
    yield put(moveTo(start));
    yield put(setThumbnails(thumbnails));

    yield put(
      applyCrop(
        { current: thumbnails, prev: prevThumbnails },
        { current: { start, end }, prev: { start: prevStart, end: prevEnd } }
      )
    );
  } catch (err) {
    console.log(err);
    yield put(error());
  }
}

export default function* watchCrop() {
  yield takeLatest(CROP, updateThumbnails);
}
