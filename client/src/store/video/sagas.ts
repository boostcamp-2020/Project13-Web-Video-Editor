import { put, call, takeLatest } from 'redux-saga/effects';

import videoAPI from '@/api/video';
import { Video, fetchListStart, setVideoList, uploadSuccess } from './actions';
import { FETCH_LIST_START, error } from '../actionTypes';

function* fetchVideos(action) {
  try {
    const {
      data: { videos },
    } = yield call(videoAPI.getList);

    yield put(
      setVideoList(
        videos.map(video => ({
          id: video.id,
          name: video.name,
          video: video.video,
          updatedAt: new Date(video.updated_at),
        }))
      )
    );
  } catch (err) {
    yield put(error());
    console.log(err);
  }
}

export default function* watchFetchListStart() {
  yield takeLatest(FETCH_LIST_START, fetchVideos);
}
