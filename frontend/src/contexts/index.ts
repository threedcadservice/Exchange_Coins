import { createContext, Dispatch, SetStateAction } from 'react';

export interface IUser {
  authenticated: boolean,
  username: string, 
  email: string,
  exp: number,
  first_name: string,
  last_name: string,
  account: string,
  photo: string,
  status: string
}

export interface ITheme {
  theme: string
}

export interface AppContextProperties {
  user: IUser,
  setUser: Dispatch<SetStateAction<IUser>>,
  theme:ITheme,
  setTheme: Dispatch<SetStateAction<ITheme>>
}

const AppContext = createContext<AppContextProperties>({ 
  user: {
    authenticated: false,
    username: '', 
    email: '',
    exp: 0,
    first_name: '',
    last_name: '',
    account: '',
    photo: '',
    status: ''
  }, 
  setUser: () => {},
  theme: {
    theme: 'light'
  },
  setTheme: () => {}
});

export { AppContext };
