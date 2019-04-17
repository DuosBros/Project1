import { combineReducers } from 'redux';
import LoginReducer from '../pages/Login/LoginReducer';
import OrdersReducer from '../pages/Orders/OrdersReducer';
import BankReducer from '../pages/Bank/BankReducer';
import BaseReducer from '../utils/BaseReducer';
import ZaslatReducer from '../pages/Zaslat/ZaslatReducer';
import CostsReducer from '../pages/Costs/CostsReducer';
import WarehouseReducer from '../pages/Warehouse/WarehouseReducer';
import ProductsReducer from '../reducers/ProductsReducer';

const CommonReducer = combineReducers({
    LoginReducer, OrdersReducer, BankReducer, BaseReducer, ZaslatReducer,
    CostsReducer, WarehouseReducer, ProductsReducer
});

export default CommonReducer;