import { call, put, takeEvery, takeLeading, select } from 'redux-saga/effects';
import webglController from '@/webgl/webglController';
import video from '@/video';
import { APPLY_EFFECT, UNDO, REDO, CLEAR, error } from '../actionTypes';
import { Effect } from './actions';
import { getIndexAndLogs } from '../selectors';
import { setThumbnails } from '../currentVideo/actions';

const revokeURL = (urls: string[]) => {
  return new Promise(resolve => {
    urls.forEach(url => URL.revokeObjectURL(url));
    resolve();
  });
};

function* checkApplyEffect(action) {
  const { index, logs } = yield select(getIndexAndLogs);

  const isFirstCrop = index === 20 && logs[0].effect === Effect.Crop;
  if (isFirstCrop) yield call(revokeURL, logs[0].thumbnails);
  else {
    const target = logs
      .filter((log, logIndex) => index < logIndex && log.Effect === Effect.Crop)
      .map(log => log.thumbnails);

    if (target.lenght > 0) yield call(revokeURL, target.flat());
  }
}

function* updateThumbnailsHistory(thumbnails: string[]) {
  try {
    yield call(webglController.main);
    yield put(setThumbnails(thumbnails));
  } catch (err) {
    console.log(err);
    yield put(error());
  }
}

const effectMapper = (effect: Effect) => {
  switch (effect) {
    case Effect.RotateClockwise:
      return {
        apply: webglController.rotateRight90Degree,
        rollback: webglController.rotateLeft90Degree,
      };
    case Effect.RotateCounterClockwise:
      return {
        apply: webglController.rotateLeft90Degree,
        rollback: webglController.rotateRight90Degree,
      };
    case Effect.FlipHorizontal:
      return {
        apply: webglController.reverseSideToSide,
        rollback: webglController.reverseUpsideDown,
      };
    case Effect.FlipVertical:
      return {
        apply: webglController.reverseSideToSide,
        rollback: webglController.reverseUpsideDown,
      };
    case Effect.Enlarge:
      return {
        apply: webglController.enlarge,
        rollback: webglController.reduce,
      };
    case Effect.Reduce:
      return {
        apply: webglController.reduce,
        rollback: webglController.enlarge,
      };

    default:
      return {};
  }
};

function* controlWebgl(action) {
  yield call(effectMapper(action.payload.effect).apply);
}

function* undoEffect(action) {
  const { index, logs } = yield select(getIndexAndLogs);

  const targetLog = logs[index];
  if (index >= 0) {
    if (targetLog.effect === Effect.Crop)
      yield call(updateThumbnailsHistory, targetLog.thumbnails);
    else yield call(effectMapper(targetLog.effect).rollback);
  }
}

function* redoEffect(action) {
  const { index, logs } = yield select(getIndexAndLogs);

  const targetLog = logs[index - 1];

  if (index - 1 >= 0 && index - 1 < logs.length) {
    if (targetLog.effect === Effect.Crop)
      yield call(updateThumbnailsHistory, targetLog.thumbnails);
    else yield call(effectMapper(targetLog.effect).apply);
  }
}

function* clearEffect(action) {
  yield call(webglController.clear);
}

export function* watchApplyEffect() {
  yield takeLeading(APPLY_EFFECT, controlWebgl);
  yield takeLeading(APPLY_EFFECT, checkApplyEffect);
}

export function* watchHistory() {
  yield takeLeading(UNDO, undoEffect);
  yield takeLeading(REDO, redoEffect);
  yield takeLeading(CLEAR, clearEffect);
}
