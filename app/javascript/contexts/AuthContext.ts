import { createContext, Reducer, Dispatch } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
  } | null;
  token: string | null;
}

interface AuthAction {
  readonly type: string;
  readonly payload?: {
    readonly user: {
      readonly email: string;
    };
    readonly token: string;
  };
}

interface AuthContext {
  readonly auth: AuthState;
  readonly dispatchAuth: Dispatch<AuthAction>;
}

export const authInitialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

export const authReducer: Reducer<AuthState, AuthAction> = (state, action) => {
  switch (action.type) {
    case 'login': {
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);

        return {
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
        };
      }

      return {
        isAuthenticated: false,
        user: null,
        token: null,
      };
    }

    case 'login_once': {
      if (action.payload) {
        return {
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
        };
      }

      return {
        isAuthenticated: false,
        user: null,
        token: null,
      };
    }

    case 'logout': {
      localStorage.clear();

      return {
        isAuthenticated: false,
        user: null,
        token: null,
      };
    }

    default: {
      return state;
    }
  }
};

export const AuthContext = createContext({} as AuthContext);
