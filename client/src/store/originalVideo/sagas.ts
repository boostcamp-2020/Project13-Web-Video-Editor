import { put, call, takeLatest } from 'redux-saga/effects';
import video from '@/video/video';
import { loadMetadata, error } from './actions';
import { SET_VIDEO } from './actionTypes';

const TIMEOUT = 10_000;

function waitMetadataLoading(objectURL) {
  return new Promise<number>((resolve, reject) => {
    const timer = setTimeout(reject, TIMEOUT, 'loading metadata timeout');

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
    // TODO: yield getThumbnails
    // TODO: yield put(loadSuccess())
  } catch (err) {
    console.log(err);
    yield put(error());
  }
}

export default function* watchSetVideo() {
  yield takeLatest(SET_VIDEO, load);
}
