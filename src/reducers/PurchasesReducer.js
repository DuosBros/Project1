const initialState = {
    purchases: { success: true },
}

const PurchasesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_PURCHASES':
            return Object.assign({}, state, { purchases: action.payload })
        case 'EDIT_PURCHASE':
        case 'CREATE_PURCHASE':
        case 'DELETE_PURCHASE':
        default:
            return state;
    }
}

export default PurchasesReducer;