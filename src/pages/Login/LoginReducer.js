const loginPageInitialState = {
    loginDone: true,
    loadInitialDataDone: true,
    loggedIn: false
}

const LoginReducer = (state = loginPageInitialState, action) => {
   switch(action.type) {
        case 'LOGIN_STARTED': 
            return Object.assign({}, state, {loginDone: false});
        case 'LOGIN_ENDED': 
            return Object.assign({}, state, {loginDone: true});
        case 'LOAD_INITIAL_DATA_STARTED':
            return Object.assign({}, state, {loadInitialDataDone: false});
        case 'LOAD_INITIAL_DATA_ENDED':
            return Object.assign({}, state, {loadInitialDataDone: true});
        case 'LOGIN_SUCCESS': 
            return Object.assign({}, state, {loggedIn: true});
        case 'LOGIN_FAIL': 
            return Object.assign({}, state, {loggedIn: false});
        default:
            return state;
   }
}

export default LoginReducer;