import { combineReducers } from 'redux';
import LoginReducer from '../pages/Login/LoginReducer';
import OrdersReducer from '../pages/Orders/OrdersReducer';
import BankReducer from '../pages/Bank/BankReducer';

const CommonReducer = combineReducers({
    LoginReducer, OrdersReducer, BankReducer
});

export default CommonReducer;