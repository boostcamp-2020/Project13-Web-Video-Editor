import { LOGIN, LOGOUT } from '../actionTypes';
import { User, UserAction } from './actions';

export interface UserState {
  user: User;
}

const initialState: UserState = {
  user: null,
};

export default (
  state: UserState = initialState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case LOGIN:
      return {
        user: action.payload.user,
      };
    case LOGOUT:
      return {
        user: null,
      };
    default:
      return state;
  }
};
