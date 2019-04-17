export function deleteProductAction(payload) {
    return {
        payload,
        type: 'DELETE_PRODUCT'
    }
}

export function editProductAction(payload) {
    return {
        payload,
        type: 'EDIT_PRODUCT'
    }
}

export function addProductAction(payload) {
    return {
        payload,
        type: 'ADD_PRODUCT'
    }
}

export function getWarehouseProductsAction(payload) {
    return {
        payload,
        type: 'GET_WAREHOUSE_PRODUCTS'
    }
}

export function deleteCostAction(payload) {
    return {
        payload,
        type: 'DELETE_COST'
    }
}

export function editCostAction(payload) {
    return {
        payload,
        type: 'EDIT_COST'
    }
}

export function addCostAction(payload) {
    return {
        payload,
        type: 'ADD_COST'
    }
}

export function getAllZaslatOrdersAction(payload) {
    return {
        payload,
        type: 'GET_ZASLAT_ORDERS'
    }
}

export function getCostsAction(payload) {
    return {
        payload,
        type: 'GET_COSTS'
    }
}

export function mapOrdersToTransactionsActions(payload) {
    return {
        payload,
        type: 'MAP_ORDERS_TO_TRANSACTIONS'
    }
}
export function getSendersAction(payload) {
    return {
        payload,
        type: 'GET_SENDERS'
    }
}

export function updateOrderInTransactionAction(payload) {
    return {
        payload,
        type: 'UPDATE_ORDER_IN_TRANSACTION'
    }
}

export function deleteOrderAction(payload) {
    return {
        payload,
        type: 'DELETE_ORDER'
    }
}
export function getOrderAction(payload) {
    return {
        payload,
        type: 'GET_ORDER'
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
