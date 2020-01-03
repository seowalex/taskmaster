import { createContext, Reducer } from 'react';

export const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

export const AuthContext = createContext(initialState);

export const reducer: Reducer<any, any> = (state, action) => {
  switch (action.type) {
    case 'login':
      localStorage.setItem('user', action.payload.user);
      localStorage.setItem('token', action.payload.token);

      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };

    case 'logout':
      localStorage.clear();

      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };

    default:
      return state;
  }
};
