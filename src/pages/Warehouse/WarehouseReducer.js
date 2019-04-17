const initialState = {
    products: { success: true },
}

const WarehouseReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_WAREHOUSE_PRODUCTS':
            return Object.assign({}, state, { products: action.payload })

        default:
            return state;
    }
}

export default WarehouseReducer;