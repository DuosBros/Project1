const ordersPageInitialState = {
    orders: [],
    ordersDetails: [],
    warehouseNotifications: [],
    notPaidNotifications: [],
    isWarehouseNotificationsDone: false,
    isNotPaidNotificationsDone: false,
    isLoadingDone: false,
    orderToEdit: {}
}

const OrdersReducer = (state = ordersPageInitialState, action) => {
    switch (action.type) {
        case 'GET_ORDERS':
            return Object.assign({}, state, { orders: action.payload })
        case 'OPEN_ORDER_DETAILS':
            return Object.assign({}, state, { orderToEdit: action.payload })
        // return {
        //     ...state,
        //     ordersDetails: state.ordersDetails.concat(action.payload)
        // }
        case 'GET_WAREHOUSE_NOTIFICATIONS':
            return Object.assign({}, state, { warehouseNotifications: action.payload })
        case 'GET_NOT_PAID_NOTIFICATIONS':
            return Object.assign({}, state, { notPaidNotifications: action.payload })
        case 'IS_GET_WAREHOUSE_NOTIFICATIONS':
            return Object.assign({}, state, { isWarehouseNotificationsDone: action.payload })
        case 'IS_GET_NOT_PAID_NOTIFICATIONS':
            return Object.assign({}, state, { isNotPaidNotificationsDone: action.payload })
        case 'GET_MORE_ORDERS':
            return {
                ...state,
                orders: [...state.orders, ...action.payload]
            }
        default:
            return state;
    }
}

export default OrdersReducer;