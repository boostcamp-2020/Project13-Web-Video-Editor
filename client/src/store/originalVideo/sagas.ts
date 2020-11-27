import { put, call, takeLatest } from 'redux-saga/effects';

import video from '@/video/video';
import WebglController from '@/webgl/webglController';
import { loadMetadata } from './actions';
import { setThumbnails } from '../currentVideo/actions';
import { SET_VIDEO, error } from '../actionTypes';

const TIMEOUT = 5_000;

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

    yield call(WebglController.main);
    yield put(setThumbnails(thumbnails));
  } catch (err) {
    console.log(err);
    yield put(error());
  }
}

export default function* watchSetVideo() {
  yield takeLatest(SET_VIDEO, load);
}
