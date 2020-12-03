import { LOGIN, LOGOUT } from '../actionTypes';

export type User = {
  id: number;
  username: string;
  image: string;
};

type LoginAction = {
  type: typeof LOGIN;
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: typeof LOGOUT;
};

export type UserAction = LoginAction | LogoutAction;
