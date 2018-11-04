const ordersPageInitialState = {
    orders: [],
}

const OrdersReducer = (state = ordersPageInitialState, action) => {
    switch (action.type) {
        case 'GET_ORDERS':
            return Object.assign({}, state, { orders: action.payload })
        default:
            return state;
    }
}

export default OrdersReducer;