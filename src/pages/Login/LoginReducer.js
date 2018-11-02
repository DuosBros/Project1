import { localStorageName } from '../../appConfig';

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
            return Object.assign({}, state, { authenticationFailed: false })
        case 'AUTHENTICATION_FAIL':
            return Object.assign({}, state, { authenticationFailed: true })
        default:
            return state;
    }
}

export default LoginReducer;