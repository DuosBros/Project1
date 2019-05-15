import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    getProductsAction, getWarehouseProductsAction, deleteProductAction
} from '../utils/actions';
import Warehouse from '../pages/Warehouse/Warehouse';
import { deleteProduct } from '../utils/requests';
import { fetchWarehouseProducts } from '../handlers/warehouseHandler';

class WarehouseContainer extends React.PureComponent {

    componentDidMount() {
        if (!this.props.productsStore.warehouseProducts.data) {
            this.fetchAndHandleWarehouseProducts();
        }
    }

    handleDeleteProduct = (id) => {
        deleteProduct(id)
            .then(() => {
                this.props.deleteProductAction(id)
            })
    }

    fetchAndHandleWarehouseProducts = (month, year) => {
        if (!month && !year) {
            if (this.props.location.search) {
                let param = new URLSearchParams(this.props.location.search)
                month = param.get("month")
                year = param.get("year")
            }
        }

        fetchWarehouseProducts(month, year, this.props.getWarehouseProductsAction)
    }

    render() {
        return (
            <Warehouse
                isMobile={this.props.isMobile}
                products={this.props.productsStore.warehouseProducts}
                fetchAndHandleWarehouseProducts={this.fetchAndHandleWarehouseProducts}
                productCategories={this.props.productsStore.productCategories}
                handleDeleteProduct={this.handleDeleteProduct}
                {...this.props} />)
    }
}

function mapStateToProps(state) {
    return {
        ordersStore: state.OrdersReducer,
        productsStore: state.ProductsReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getProductsAction,
        getWarehouseProductsAction,
        deleteProductAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseContainer);
