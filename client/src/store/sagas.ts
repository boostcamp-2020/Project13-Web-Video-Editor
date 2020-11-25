import { all } from 'redux-saga/effects';
import watchSetVideo from '@/store/originalVideo/sagas';

export default function* rootSaga() {
  yield all([watchSetVideo()]); // TODO: fix []
}
