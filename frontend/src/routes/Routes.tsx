import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import Header from '../components/shared/layout/header/Header';
import { ThemeProviderEnum, themeVar } from '../variables/Shared'
import { Page404 } from '../pages/Page404'
import {AppContext} from '../contexts'
import jwt from 'jwt-decode'
import Cookies from 'universal-cookie';

const MultichartPage = lazy(() => import('../pages/MultichartPage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const SignupPage = lazy(() => import('../pages/SignupPage'))
const EmailVerifyPage = lazy(() => import('../pages/EmailVerifyPage'))
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'))
const HomePage = lazy(() => import('../pages/Home'))
const ExchangePage = lazy(() => import('../pages/Exchange'))
const SupportPage = lazy(() => import('../pages/Support'))

export default function Routes() {
  const [theme, setTheme] = useState({theme: localStorage.getItem('theme')})

  useEffect(() => {
    if (theme.theme === 'dark') {
      themeVar(ThemeProviderEnum.dark)
    } else {
      themeVar(ThemeProviderEnum.light)
    }
  }, [theme])

  const [user, setUser] = useState({
    authenticated: false,
    username: '', 
    email: '',
    exp: 0,
    first_name: '',
    last_name: '',
    account: '',
    photo: '',
    status: ''
  });

  useEffect(()=>{
    const cookies = new Cookies();
    if(cookies.get('token')){
      cookies.set('token', cookies.get('token'));
      if(user.authenticated) return;
      let userdata = jwt(cookies.get('token'));      
      setUser({
        authenticated: true,
        username: userdata["username"], 
        email: userdata["email"],
        exp: userdata["exp"],
        first_name: userdata["first_name"],
        last_name: userdata["last_name"],
        account: userdata['account'],
        photo: userdata['photo'],
        status: userdata['status']
      })
    }

  },[])

  return (    
      <Suspense fallback={<Header />}>
        <AppContext.Provider value={{user, setUser, theme, setTheme}}>
          <Switch>
            <Route path='/price' exact component={MultichartPage} />
            <Route path='/' exact component={HomePage} />
            <Route path='/exchange' exact component={ExchangePage} />
            <Route path='/support' exact component={SupportPage} />
            <Route path='/login' exact component={LoginPage} />
            <Route path='/login/:auth' exact component={LoginPage} />
            <Route path='/register' exact component={SignupPage} />
            <Route path='/email_verify' exact component={EmailVerifyPage} />
            <Route path='/email_verify/:auth' exact component={EmailVerifyPage} />
            <Route path='/forgot_password' exact component={ForgotPasswordPage} />
            <Route path='**' component={Page404} />
          </Switch>
        </AppContext.Provider>
      </Suspense>
  )
}
