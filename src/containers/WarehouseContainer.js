import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getAllProductsAction, getWarehouseProductsAction } from '../utils/actions';
import { fetchAndHandleProducts, fetchAndHandleWarehouseProducts } from '../handlers/productHandler';
import Warehouse from '../pages/Warehouse/Warehouse';

class WarehouseContainer extends React.PureComponent {

componentDidMount() {
        if (!this.props.ordersStore.products.data) {
            this.fetchAndHandleProducts();
        }
        fetchAndHandleWarehouseProducts(getWarehouseProductsAction);
    }

    fetchAndHandleProducts = () => {
        fetchAndHandleProducts(this.props.getAllProductsAction);
    }

    render() {
        return (
        <Warehouse
            products={this.props.ordersStore.products}
            fetchAndHandleProducts={fetchAndHandleProducts}
            productCategories={this.props.ordersStore.productCategories} />)
    }
}

function mapStateToProps(state) {
    return {
        ordersStore: state.OrdersReducer,
        warehouseStore: state.WarehouseReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAllProductsAction,
        getWarehouseProductsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseContainer);
