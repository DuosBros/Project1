import axios from 'axios';
import { LOCALSTORAGE_NAME } from '../../appConfig';

const loginPageInitialState = {
    currentUser: {},
    authenticationInProgress: true,
    authenticationSucceeded: false
}

const LoginReducer = (state = loginPageInitialState, action) => {
    switch (action.type) {
        case 'AUTHENTICATE':
            return Object.assign({}, state, { currentUser: action.payload })
        case 'AUTHENTICATION_IN_PROGRESS':
            return Object.assign({}, state, { authenticationInProgress: action.payload })
        case 'AUTHENTICATION_SUCCEEDED':
            if (action.payload === true) {
                if (!localStorage.getItem(LOCALSTORAGE_NAME)) {
                    localStorage.setItem(LOCALSTORAGE_NAME, state.currentUser.token)
                    axios.defaults.headers.common['x-access-token'] = localStorage.getItem(LOCALSTORAGE_NAME);
                }
            }
            else {
                localStorage.setItem(LOCALSTORAGE_NAME, "")
            }
            return Object.assign({}, state, { authenticationSucceeded: action.payload })
        default:
            return state;
    }
}

export default LoginReducer;