const initialState = {
    zaslatOrders: null
}

const ZaslatReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ZASLAT_ORDERS':
            return Object.assign({}, state, {zaslatOrders: action.payload})
        default:
            return state;
    }
}

export default ZaslatReducer;