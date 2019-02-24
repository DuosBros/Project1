const ordersPageInitialState = {
    orders: { success: true },
    ordersDetails: [],
    warehouseNotifications: { success: true },
    notPaidNotifications: { success: true },
    isLoadingDone: false,
    orderToEdit: {},
    products: []
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
            if (action.payload.success) {
                var temp = Object.assign([], state.orders)

                if (temp.data) {
                    temp.data = temp.data.concat(action.payload.data)
                }
                else {
                    temp.data = action.payload.data
                }

                return Object.assign({}, state, { orders: temp })
            }
        default:
            return state;
    }
}

export default OrdersReducer;