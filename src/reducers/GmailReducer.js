const initialState = {
    isLogged: { data: false, url: null },
    token: { isValid: false, token: null },
    emails: { success: true }
}

const GmailReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GMAIL_AUTH':
            return Object.assign({}, state, { isLogged: action.payload })
        case 'GMAIL_VALIDATE_TOKEN':
            return Object.assign({}, state, { token: action.payload })
        case 'GMAIL_GET_EMAILS':
            return Object.assign({}, state, { emails: action.payload })
        default:
            return state;
    }
}

export default GmailReducer;