const ordersPageInitialState = {
    orders: { success: true },
    ordersDetails: { success: true },
    warehouseNotifications: { success: true },
    notPaidNotifications: { success: true },
    isLoadingDone: false,
    orderToEdit: {},
    products: { success: true }
}

const OrdersReducer = (state = ordersPageInitialState, action) => {
    switch (action.type) {
        case 'GET_ALL_PRODUCTS':
            return Object.assign({}, state, { products: action.payload })
        case 'GET_ORDERS':
            return Object.assign({}, state, { orders: action.payload })
        case 'OPEN_ORDER_DETAILS':
            return Object.assign({}, state, { orderToEdit: action.payload })
        case 'GET_WAREHOUSE_NOTIFICATIONS':
            return Object.assign({}, state, { warehouseNotifications: action.payload })
        case 'GET_NOT_PAID_NOTIFICATIONS':
            return Object.assign({}, state, { notPaidNotifications: action.payload })
        case 'GET_MORE_ORDERS':
            var temp = Object.assign([], state.orders)
            if (action.payload.success) {

                if (temp.data) {
                    temp.data = temp.data.concat(action.payload.data)
                }
                else {
                    temp.data = action.payload.data
                }
            }
            return Object.assign({}, state, { orders: temp })
        default:
            return state;
    }
}

export default OrdersReducer;