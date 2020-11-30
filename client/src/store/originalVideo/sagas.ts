import { put, call, takeLatest, select } from 'redux-saga/effects';

import video from '@/video/video';
import webglController from '@/webgl/webglController';
import { loadMetadata } from './actions';
import { setThumbnails } from '../currentVideo/actions';
import { SET_VIDEO, error } from '../actionTypes';
import { getDuration } from '../selectors';

const TIMEOUT = 5_000;

export function* deleteSrc() {
  yield call(webglController.reset);
  yield call(video.revoke);
}

function waitMetadataLoading(objectURL) {
  return new Promise<number>((resolve, reject) => {
    const timer = setTimeout(reject, TIMEOUT, 'loading metadata timeout');

    video.revoke();
    video.setSrc(objectURL);

    video.addEventListener(
      'loadedmetadata',
      ({ target }: Event) => {
        clearTimeout(timer);
        resolve((target as HTMLVideoElement).duration);
      },
      { once: true }
    );
  });
}

function* load(action) {
  try {
    const duration = yield call(waitMetadataLoading, action.payload.URL);
    yield put(loadMetadata(duration));

    const thumbnails: string[] = yield call(video.makeThumbnails, 0, duration);

    yield call(webglController.main);
    yield put(setThumbnails(thumbnails));
  } catch (err) {
    console.log(err);
    yield put(error());
  }
}

export function* watchSetVideo() {
  yield takeLatest(SET_VIDEO, load);
}
