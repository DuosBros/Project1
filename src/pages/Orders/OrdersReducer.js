const ordersPageInitialState = {
    orders: [],
    ordersDetails: []
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
        default:
            return state;
    }
}

export default OrdersReducer;