import axios from 'axios';
import service from '@/services/service.js'

export default {
    login(username, password){
        return axios({
            method:'POST',
            url: service.LOGIN_URL,
            data:{
                username:username,
                password:password
            }
        });
    },
    register(username, password){
        return axios({
            method:'POST',
            url: service.REGISTER_URL,
            data:{
                username:username,
                password:password
            },
            headers: service.AUTH_HEADER
        });
    },
    auth(){
        return axios({
            method:'POST',
            url: service.AUTH_URL,
            headers: service.AUTH_HEADER
        });
    }
}