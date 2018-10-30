import axios from 'axios';
import { MEDPHARMAVN_API } from '../appConfig';

export function sendAuthenticationData(payload) {
    return axios.post(MEDPHARMAVN_API + 'authenticate', payload);
}