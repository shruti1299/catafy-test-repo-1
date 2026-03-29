'use client';

import React,{useReducer} from 'react';
import { getToken, getUser } from '@/utils/get-token';

export interface IUserProp {
  id: number;
  name: string;
  phone?: string;
  email?: any;
  country_code: string;
}

export interface State {
  isAuthorized: boolean;
  user: IUserProp;
}

const initialState = {
  isAuthorized: getToken() ? true : false,
  user: getUser(),
};

type Action =
  | {
    type: 'SET_AUTHORIZED';
    data: IUserProp
  }
  | {
    type: 'SET_UNAUTHORIZED';
  };


export const UIContext = React.createContext<State | any>(initialState);

UIContext.displayName = 'UIContext';

function uiReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_AUTHORIZED': {
      return {
        ...state,
        isAuthorized: true,
        user: action.data
      };
    }
    case 'SET_UNAUTHORIZED': {
      return {
        ...state,
        isAuthorized: false,
      };
    }
  }
}

export function UIProvider(props: React.PropsWithChildren<any>) {
  //@ts-ignore
  const [state, dispatch] = useReducer(uiReducer, { ...initialState });
  //@ts-ignore
  const authorize = (data: IUserProp) => dispatch({ type: 'SET_AUTHORIZED', data });
  //@ts-ignore
  const unauthorize = () => dispatch({ type: 'SET_UNAUTHORIZED' });
  //@ts-ignore
  const setPublicData = (data:IPublicData) => dispatch({ type: 'SET_PUBLIC_DATA', data});

  const value = React.useMemo(
    () => ({
      ...state,
      authorize,
      unauthorize,
      setPublicData
    }),
    [state]
  );
  return <UIContext.Provider value={value} {...props} />;
}

export const useUI = () => {
  const context = React.useContext(UIContext);
  if (context === undefined) {
    throw new Error(`useUI must be used within a UIProvider`);
  }
  return context;
};

export function ManagedUIContext({ children }: React.PropsWithChildren<{}>) {
  return (
    <UIProvider>
      {children}
    </UIProvider>
  );
}


