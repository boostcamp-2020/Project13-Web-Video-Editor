import { call, put, takeLeading, select } from 'redux-saga/effects';
import webglController from '@/webgl/webglController';
import video from '@/video';
import { MAX_HISTORY } from '@/store/history/reducer';

import { APPLY_EFFECT, UNDO, REDO, CLEAR, error } from '../actionTypes';
import { Effect, Log, undoSuccess, redoSuccess } from './actions';
import { getIndexAndLogs } from '../selectors';
import { updateStartEnd, setThumbnails, moveTo } from '../currentVideo/actions';

const revokeURL = (urls: string[]) => {
  urls.forEach(url => URL.revokeObjectURL(url));
};

function* checkApplyEffect(action) {
  const { index, logs } = yield select(getIndexAndLogs);
  const isFirstCrop = index === MAX_HISTORY && logs[0].effect === Effect.Crop;
  if (isFirstCrop) yield call(revokeURL, logs[0].thumbnails.current);
  else {
    const target = logs
      .filter((log, logIndex) => index < logIndex && log.Effect === Effect.Crop)
      .map(log => log.thumbnails.current);
    if (target.lenght > 0) yield call(revokeURL, target.flat());
  }
}

function* updateThumbnailsHistory(thumbnails: string[], { start, end }) {
  try {
    yield put(setThumbnails(thumbnails));
    yield put(updateStartEnd(start, end));
    yield call(video.setCurrentTime, start);
    yield put(moveTo(start));
  } catch (err) {
    console.log(err);
    yield put(error());
  }
}

const effectMapper = {
  [Effect.RotateClockwise]: {
    apply: webglController.rotateRight90Degree,
    rollback: webglController.rotateLeft90Degree,
    reverseEffect: Effect.RotateCounterClockwise,
  },
  [Effect.RotateCounterClockwise]: {
    apply: webglController.rotateLeft90Degree,
    rollback: webglController.rotateRight90Degree,
    reverseEffect: Effect.RotateClockwise,
  },
  [Effect.FlipVertical]: {
    apply: webglController.reverseUpsideDown,
    rollback: webglController.reverseUpsideDown,
    reverseEffect: Effect.FlipVertical,
  },
  [Effect.FlipHorizontal]: {
    apply: webglController.reverseSideToSide,
    rollback: webglController.reverseSideToSide,
    reverseEffect: Effect.FlipHorizontal,
  },
  [Effect.Enlarge]: {
    apply: webglController.enlarge,
    rollback: webglController.reduce,
    reverseEffect: Effect.Reduce,
  },
  [Effect.Reduce]: {
    apply: webglController.reduce,
    rollback: webglController.enlarge,
    reverseEffect: Effect.Enlarge,
  },
};

function* controlWebgl(action) {
  yield call(effectMapper[action.payload.effect].apply);
}

function* undoEffect(action) {
  const { index, logs } = yield select(getIndexAndLogs);
  if (index > 0) {
    const targetLog: Log = logs[index - 1];
    if (targetLog.effect === Effect.Crop) {
      yield call(
        updateThumbnailsHistory,
        targetLog.thumbnails.prev,
        targetLog.interval.prev
      );
      yield put(undoSuccess(index - 1));
    } else {
      const { rollback, reverseEffect } = effectMapper[targetLog.effect];
      yield call(rollback);
      yield put(undoSuccess(index - 1, reverseEffect));
    }
  } else {
    console.log('더 이상 되돌릴 수 없습니다.');
    yield put(error());
  }
}

function* redoEffect(action) {
  const { index, logs } = yield select(getIndexAndLogs);
  if (index < logs.length) {
    const targetLog: Log = logs[index];
    if (targetLog.effect === Effect.Crop) {
      yield call(
        updateThumbnailsHistory,
        targetLog.thumbnails.current,
        targetLog.interval.current
      );
      yield put(redoSuccess(index + 1));
    } else {
      const { apply } = effectMapper[targetLog.effect];
      yield call(apply);
      yield put(redoSuccess(index + 1, targetLog.effect));
    }
  } else {
    console.log('더 이상 다시 실행할 수 없습니다.');
    yield put(error());
  }
}

function* clearEffect(action) {
  yield call(webglController.clear);
  yield call(updateThumbnailsHistory, video.getThumbnails(), {
    start: 0,
    end: video.get('duration'),
  });
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
