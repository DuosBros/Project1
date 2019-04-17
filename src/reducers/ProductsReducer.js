const initialState = {
    products: { success: true },
    productCategories: []
}

const ProductsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ALL_PRODUCTS':
            let categories = [];
            if (action.payload.data && action.payload.success) {
                let keys = Object.keys(action.payload.data)

                categories = [...new Set(keys.map(item => action.payload.data[item].category).filter(x => x))];
            }

            return Object.assign({}, state, { products: action.payload, productCategories: categories })
        case 'ADD_PRODUCT':
            let temp = Object.assign({}, state.products)
            temp.data = Object.assign({}, temp.data)
            temp.data[action.payload.name] = action.payload
            temp.data[action.payload.name].productName = temp.data[action.payload.name].name
            delete temp.data[action.payload.name].name

            categories = state.productCategories;

            if (!state.productCategories.includes(action.payload.category)) {
                categories = state.productCategories.slice()
                categories.push(action.payload.category)
            }

            return {
                ...state,
                products: temp, productCategories: categories
            }
        case 'EDIT_PRODUCT':
            temp = Object.assign({}, state.products.data)
            temp[action.payload.name] = action.payload
            temp[action.payload.name].productName = temp[action.payload.name].name
            delete temp[action.payload.name].name

            categories = state.productCategories;

            if (!state.productCategories.includes(action.payload.category)) {
                categories = state.productCategories.slice()
                categories.push(action.payload.category)
            }

            return Object.assign({}, state, { products: { success: state.products.success, data: temp }, productCategories: categories });
        case 'REMOVE_PRODUCT':
            temp = Object.assign({}, state.products.data)
            delete temp[action.payload.name]

            return Object.assign({}, state, { products: { success: state.products.success, data: temp } })
        default:
            return state;
    }
}

export default ProductsReducer;