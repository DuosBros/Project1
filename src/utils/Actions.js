export function getAllZaslatOrdersAction(payload) {
    return {
        payload,
        type: 'GET_ZASLAT_ORDERS'
    }
}

export function showGenericModalAction(payload) {
    return {
        payload,
        type: 'SHOW_GENERIC_MODAL'
    }
}

export function closeGenericModalAction() {
    return {
        type: 'CLOSE_GENERIC_MODAL'
    }
}

export function getAllProductsAction(payload) {
    return {
        payload,
        type: 'GET_ALL_PRODUCTS'
    }
}

export function authenticateAction(payload) {
    return {
        payload,
        type: 'AUTHENTICATE'
    }
}

export function authenticateSucceededAction(payload) {
    return {
        payload,
        type: 'AUTHENTICATION_SUCCEEDED'
    }
}

export function authenticationInProgressAction(payload) {
    return {
        payload,
        type: 'AUTHENTICATION_IN_PROGRESS'
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

export function getMoreOrdersAction(payload) {
    return {
        payload,
        type: 'GET_MORE_ORDERS'
    }
}