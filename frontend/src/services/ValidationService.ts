import { notifyWarning } from './NotificationService'

export const validate = (field: string, value: string) => {
    let w_return = true;
    if(value === undefined || value === ''){
        notifyWarning(field + ' is required')
        w_return = false;
    }
    return w_return;
}

export const numValidate = (field: string, value: number) => {
    let w_return = true;
    if(value === undefined || value <= 0){
        notifyWarning(field + ' should be more than 0')
        w_return = false;
    }
    return w_return;
}

export const dateValidate = (field: string, value: Date) => {
    let w_return = true; 

    if(value === undefined){
        notifyWarning(field + ' is more than today')
        w_return = false;
    } else {
        let today = new Date();
        const diffTime = new Date(value).getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if(diffDays < 1){
            notifyWarning(field + ' is more than today')
            w_return = false;
        }
    }
    return w_return;
}

export const emailValidate = (email: string) => {
    let w_return = true;
    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) { 
        notifyWarning('Invalidated Email')
        w_return = false;
     }
    return w_return;
}

export const confirmValidate = (password: string, confirm: string) => {
    let w_return = true;
    if(password !== confirm){
        notifyWarning('Invalidated Confirm Password')
        w_return = false;
    }        
    return w_return;
}