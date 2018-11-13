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

export function getOrdersAction(payload) {
    return {
        payload,
        type: 'GET_ORDERS'
    }
}

export function openOrderDetailsAction(payload) {
    return {
        payload,
        type: 'OPEN_ORDER_DETAILS'
    }
}

export function getBankTransactionsAction(payload) {
    return {
        payload,
        type: 'GET_BANK_TRANSACTIONS'
    }
}

export function getNotPaidNotificationsAction(payload) {
    return {
        payload,
        type: 'GET_NOT_PAID_NOTIFICATIONS'
    }
}

export function getWarehouseNotificationsAction(payload) {
    return {
        payload,
        type: 'GET_WAREHOUSE_NOTIFICATIONS'
    }
}