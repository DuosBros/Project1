const initialState = {
    costs: { success: true }
}

const CostsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_COSTS':
            return Object.assign({}, state, { costs: action.payload })
        default:
            return state;
    }
}

export default CostsReducer;