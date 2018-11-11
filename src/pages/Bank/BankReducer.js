const initialState = {
    transactions: []
}

const BankReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_BANK_TRANSACTIONS':
            return Object.assign({}, state, { transactions: action.payload })
        default:
            return state;
    }
}

export default BankReducer;