export function authenticateAction(payload) {
    return {
        payload,
        type: 'AUTHENTICATE'
    }
}

export function authenticationStartedAction() {
    return {
        type: 'AUTHENTICATION_STARTED'
    }
}

export function authenticateEndedAction() {
    return {
        type: 'AUTHENTICATION_ENDED'
    }
}

export function authenticateOKAction() {
    return {
        type: 'AUTHENTICATION_OK'
    }
}

export function authenticationFailedAction() {
    return {
        type: 'AUTHENTICATION_FAIL'
    }
}