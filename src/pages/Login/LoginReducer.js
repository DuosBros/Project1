import { LOCALSTORAGE_NAME } from '../../appConfig';

const loginPageInitialState = {
    currentUser: {},
    authenticationDone: true,
    authenticationFailed: true
}

const LoginReducer = (state = loginPageInitialState, action) => {
    switch (action.type) {
        case 'AUTHENTICATE':
            return Object.assign({}, state, { currentUser: action.payload })
        case 'AUTHENTICATION_STARTED':
            return Object.assign({}, state, { authenticationDone: false })
        case 'AUTHENTICATION_ENDED':
            return Object.assign({}, state, { authenticationDone: true })
        case 'AUTHENTICATION_OK':
            if(!localStorage.getItem(LOCALSTORAGE_NAME)) {
                localStorage.setItem(LOCALSTORAGE_NAME, state.currentUser.token)
            }
            return Object.assign({}, state, { authenticationFailed: false })
        case 'AUTHENTICATION_FAIL':
            localStorage.setItem(LOCALSTORAGE_NAME, "")
            return Object.assign({}, state, { authenticationFailed: true })
        default:
            return state;
    }
}

export default LoginReducer;