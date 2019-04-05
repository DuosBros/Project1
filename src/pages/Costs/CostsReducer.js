import moment from 'moment';

const initialState = {
    costs: { success: true },
    costCategories: []
}

const CostsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_COSTS':
            let categories = [];
            if (action.payload.data && action.payload.success) {
                categories = [...new Set(action.payload.data.map(item => item.category).filter(x => x))];
                action.payload.data.forEach(x => {
                    x.cost = x.cost ? x.cost : 0
                    x.monthAndYear = moment(x.date).format('MM.YYYY')
                    x.date = moment(x.date).format('DD.MM.YYYY')
                })
            }

            return Object.assign({}, state, { costs: action.payload, costCategories: categories })
        case 'ADD_COST':
            action.payload.monthAndYear = moment(action.payload.date).format('MM.YYYY')
            action.payload.date = moment(action.payload.date).format('DD.MM.YYYY')

            let temp = Object.assign({}, state.costs)
            temp.data.unshift(action.payload)
            return {
                ...state,
                costs: temp
            }
        default:
            return state;
    }
}

export default CostsReducer;