const ordersPageInitialState = {
    orders: [],
    ordersDetails: [],
    warehouseNotifications: [],
    notPaidNotifications: []
}

const OrdersReducer = (state = ordersPageInitialState, action) => {
    switch (action.type) {
        case 'GET_ORDERS':
            return Object.assign({}, state, { orders: action.payload })
        case 'OPEN_ORDER_DETAILS':
            return {
                ...state,
                ordersDetails: state.ordersDetails.concat(action.payload)
            }
        case 'GET_WAREHOUSE_NOTIFICATIONS':
            return Object.assign({}, state, { warehouseNotifications: action.payload })
        case 'GET_NOT_PAID_NOTIFICATIONS':
            return Object.assign({}, state, { notPaidNotifications: action.payload })
        default:
            return state;
    }
}

export default OrdersReducer;