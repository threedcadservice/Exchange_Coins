/*
Project : LeaderInu
FileName : index.js
Author : LinkWell
File Created : 10/01/2022
CopyRights : LinkWell
Purpose : This is the file which maintain globl variable for the application
*/
const config = {
    app: {
      port: 5000
    },
    db: {
      host: 'localhost',
      port: 27017,
      username: '',
      password: '',
      name: 'leaderinu',
      prefix:'linkwell_'
    },
    mail: {
      type:"opt",
      smtp: {
        host: 'smtp.gmail.com',
        port: 465,
        secure:true,
        username:'ronaldo888kgs@gmail.com',
        password:'clrhslrjkw123'
      }
    },    
    site_name:'LeaderInu',
    site_link:'#',
    site_email: 'ronaldo888kgs@gmail.com',
    secret_key:'jfVRtwN7xBl7LjRucIUdPnrh1UVUhzhZ',
    public_key:'6gluXXunc77uukLJbSmlQ31ckSlLq8Qi'
   };
   
   
module.exports = config;