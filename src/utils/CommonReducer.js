import { combineReducers } from 'redux';
import LoginReducer from '../pages/Login/LoginReducer';
import OrdersReducer from '../pages/Orders/OrdersReducer';
import BankReducer from '../pages/Bank/BankReducer';
import BaseReducer from '../utils/BaseReducer';
import ZaslatReducer from '../pages/Zaslat/ZaslatReducer';

const CommonReducer = combineReducers({
    LoginReducer, OrdersReducer, BankReducer,BaseReducer, ZaslatReducer
});

export default CommonReducer;