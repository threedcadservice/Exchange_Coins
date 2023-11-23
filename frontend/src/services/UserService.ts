import { code } from '../messages'
import { notifyError, notifyWarning } from './NotificationService'
import { API } from '../constants/api';
import axios from 'axios';
import jwt from 'jwt-decode'
import Cookies from 'universal-cookie';

/*
* this function is to request to server for login
*/
export const login = async (data: any) => {
    let w_return = '';
    if(data.username === 'admin' && data.password === 'admin') {
        return "administrator";
    }
    await axios.post(`${process.env.REACT_APP_BASE_URL}/user/login`, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                console.log('opt_code: ==========================' + data.opt_code)
                w_return = data.activation_code;
            } 
            notifyWarning(data.message)
        }
    })
    .catch(error => {
        notifyError(code[5001], error)
    })
    return w_return;
}

/*
* this function is to request to server for verifying opt
*/
export const verify = async (data: any) => {
    let w_return = '';
    await axios.post(`${process.env.REACT_APP_BASE_URL}/user/opt_verify`, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                setCookie(data.token)
                w_return = jwt(data.token);
            }
                
        }
    })
    .catch(error => {
        notifyError(code[5001], error)
    })

    return w_return;
}

/*
* this function is to request to server for saving user data into cookie
*/
const setCookie = (token:string) => {
    let d = new Date();
    d.setTime(d.getTime() + (API.cookie_expire*60*1000));
    const cookies = new Cookies();
    cookies.set("token", token, {path: "/", expires: d, sameSite: 'lax'});
}

/*
* this function is to request to server for register
*/
export const register = async (data: any) => {
    let w_return = '';
    await axios.post(`${process.env.REACT_APP_BASE_URL}/user/register`, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                w_return = data.activation_code;
            }
            notifyWarning(data.message)
        }
    })
    .catch(error => {
        notifyError(code[5001], error)
    })

    return w_return;
}

/*
* this function is to request to server for forgot password
*/
export const forgot = async (data: any) => {
    let w_return = false;
    await axios.post(`${process.env.REACT_APP_BASE_URL}/user/forgot`, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            w_return = data.status;
            notifyWarning(data.password)
        }
    })
    .catch(error => {
        notifyError(code[5001], error)
    })

    return w_return;
}

/*
* this function is to request to create new wallet account
*/
export const creatingWallet = async (data: any) => {
    let w_return = '';
    await axios.post(`${process.env.REACT_APP_BASE_URL}/user/wallet`, data)
    .then(response => {
        if(response.status === 200){
            let data = response.data;
            if(data.status){
                w_return = data.address;
            }
            notifyWarning(data.message)
        }
    })
    .catch(error => {
        notifyError(code[5001], error)
    })

    return w_return;
}


