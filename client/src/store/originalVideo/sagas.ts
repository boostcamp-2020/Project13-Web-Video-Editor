import { put, call, takeLatest, select } from 'redux-saga/effects';

import video from '@/video';
import encodeVideo from '@/video/encoding';
import decodeTest from '@/video/test';
import webglController from '@/webgl/webglController';
import videoAPI from '@/api/video';

import { loadMetadata, uploadStart, EncodeStartAction } from './actions';
import { setThumbnails } from '../currentVideo/actions';
import { uploadSuccess } from '../video/actions';
import {
  SET_VIDEO,
  ENCODE_START,
  UPLOAD_START,
  error,
  reset,
} from '../actionTypes';
import { getFile, getStartEnd } from '../selectors';

const TIMEOUT = 50_000;

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

function* encode(action: EncodeStartAction) {
  try {
    const srcFile = yield select(getFile);
    const { start, end } = yield select(getStartEnd);
    const { chunks, encoderConfig } = yield call(
      encodeVideo,
      start,
      end,
      srcFile,
      action.payload.name
    );
    yield call(
      decodeTest,
      chunks,
      encoderConfig,
      window.open('', '_blank').document
    );
    yield put(uploadStart(srcFile));
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
