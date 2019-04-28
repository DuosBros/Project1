import { combineReducers } from 'redux';
import LoginReducer from '../pages/Login/LoginReducer';
import OrdersReducer from '../pages/Orders/OrdersReducer';
import BankReducer from '../pages/Bank/BankReducer';
import BaseReducer from '../utils/BaseReducer';
import ZaslatReducer from '../pages/Zaslat/ZaslatReducer';
import CostsReducer from '../pages/Costs/CostsReducer';
import ProductsReducer from '../reducers/ProductsReducer';
import SummaryReducer from '../reducers/SummaryReducer';

const CommonReducer = combineReducers({
    LoginReducer, OrdersReducer, BankReducer, BaseReducer, ZaslatReducer,
    CostsReducer, ProductsReducer, SummaryReducer
});

export default CommonReducer;