import moment from 'moment';

const initialState = {
    costs: { success: true }
}

const CostsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_COSTS':
            if (action.payload.data && action.payload.success) {
                action.payload.data.forEach(x => {
                    x.category = x.category ? x.category : ""
                    x.cost = x.cost ? x.cost : 0
                    x.monthAndYear = moment(x.date).format('MM.YYYY')
                    x.date = moment(x.date).format('DD.MM.YYYY')
                })
            }

            return Object.assign({}, state, { costs: action.payload })
        default:
            return state;
    }
}

export default CostsReducer;