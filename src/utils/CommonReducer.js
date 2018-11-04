import { combineReducers } from 'redux';
import LoginReducer from '../pages/Login/LoginReducer';
import OrdersReducer from '../pages/Orders/OrdersReducer';

const CommonReducer = combineReducers({
    LoginReducer, OrdersReducer
});

export default CommonReducer;