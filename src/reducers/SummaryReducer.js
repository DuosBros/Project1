const initialState = {
    orders: { success: true },
    costs: { success: true }
}

const SummaryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_PAID_ORDERS_MONTHLY':
            return Object.assign({}, state, { orders: action.payload })
        case 'GET_COSTS_MONTHLY':
            return Object.assign({}, state, { costs: action.payload })
        default:
            return state;
    }
}

export default SummaryReducer;