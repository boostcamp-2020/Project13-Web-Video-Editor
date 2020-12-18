import { put, call, takeLatest, select } from 'redux-saga/effects';

import video, { encodeVideo, muxVideoAndAudio } from '@/video';
import webglController from '@/webgl/webglController';
import videoAPI from '@/api/video';
import readMetaData from '@/video/metadata';

import {
  setVideo,
  loadMetadata,
  uploadStart,
  EncodeStartAction,
  encodeSuccess,
} from './actions';
import { setThumbnails, pause } from '../currentVideo/actions';
import { uploadSuccess } from '../video/actions';
import {
  FETCH_START,
  SET_VIDEO,
  ENCODE_START,
  UPLOAD_START,
  error,
  reset,
} from '../actionTypes';
import { getFile, getStartEnd } from '../selectors';
import { clear } from '../history/actions';

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

export function* clearErrorLoading() {
  yield call(() => new Promise(resolve => setTimeout(resolve, TIMEOUT)));
  yield put(setThumbnails([]));
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

    const file = yield select(getFile);

    const {
      media: { track },
    } = yield call(readMetaData, file);

    const rotation = Math.round(track[1].Rotation);

    yield call(webglController.setVideoRotation, rotation);
    yield call(webglController.main);
    yield call(webglController.clear);

    yield put(setThumbnails(thumbnails));
    yield put(clear());
  } catch (err) {
    console.log(err);
    yield put(error());
  }
}

export function* watchSetVideo() {
  yield takeLatest(SET_VIDEO, load);
}

const downloadFile = (file: File): void => {
  const a = document.createElement('a');
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = file.name;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

function* encode(action: EncodeStartAction) {
  try {
    const { start, end } = yield select(getStartEnd);
    yield put(pause());
    const encodeVideoBlob: Blob = yield call(
      encodeVideo,
      start,
      end,
      webglController
    );

    yield put(encodeSuccess());

    const originalVideoFile: File = yield select(getFile);
    const muxedVideoFile: File = yield call(
      muxVideoAndAudio,
      encodeVideoBlob,
      originalVideoFile,
      action.payload.name,
      {
        start,
        end,
      }
    );

    const isAgree = yield call(
      window.confirm,
      '인코딩된 영상을 다운받으시겠습니까?'
    );
    if (isAgree) downloadFile(muxedVideoFile);

    yield put(uploadStart(muxedVideoFile));
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
