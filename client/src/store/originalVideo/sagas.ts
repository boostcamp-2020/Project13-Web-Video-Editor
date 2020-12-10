import { put, call, takeLatest, select } from 'redux-saga/effects';

import video from '@/video/video';
import webglController from '@/webgl/webglController';
import videoAPI from '@/api/video';

import {
  setVideo,
  loadMetadata,
  uploadStart,
  EncodeStartAction,
} from './actions';
import { setThumbnails } from '../currentVideo/actions';
import { uploadSuccess } from '../video/actions';
import {
  FETCH_START,
  SET_VIDEO,
  ENCODE_START,
  UPLOAD_START,
  error,
  reset,
} from '../actionTypes';
import { getFile } from '../selectors';

const TIMEOUT = 5_000;

function* downloadFromServer(action) {
  try {
    const { data } = yield call(videoAPI.download, action.payload.video);
    const file = new File([data], action.payload.name, {
      type: 'video/mp4',
    });
    const url = URL.createObjectURL(file);
    yield put(setVideo(file, url));
  } catch (err) {
    console.log(err);
    yield put(error());
  }
}

export function* watchFetchStart() {
  yield takeLatest(FETCH_START, downloadFromServer);
}

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
    yield call(webglController.clear);

    yield put(setThumbnails(thumbnails));
  } catch (err) {
    console.log(err);
    yield put(error());
  }
}

export function* watchSetVideo() {
  yield takeLatest(SET_VIDEO, load);
}

function* encode(action: EncodeStartAction) {
  try {
    const temp = yield select(getFile);
    const file = yield call(
      name => new Promise(resolve => setTimeout(() => resolve(temp), TIMEOUT)),
      action.payload.name
    ); // FIXME: do encoding here
    yield put(uploadStart(file));
  } catch (err) {
    console.log(err);
    yield put(error());
  }
}

export function* watchEncodeStart() {
  yield takeLatest(ENCODE_START, encode);
}

function* upload(action) {
  try {
    const formData = new FormData();
    formData.append('video', action.payload.file);
    const {
      data: { id, url },
    } = yield call(videoAPI.upload, formData);

    yield put(
      uploadSuccess({
        id,
        name: action.payload.file.name,
        video: url,
        updatedAt: new Date(),
      })
    );
    yield put(reset());
  } catch (err) {
    console.log(err);
    yield put(error());
  }
}

export function* watchUploadStart() {
  yield takeLatest(UPLOAD_START, upload);
}
