import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getProductsAction, getWarehouseProductsAction, deleteProductAction } from '../utils/actions';
import { fetchAndHandleProducts } from '../handlers/productHandler';
import Warehouse from '../pages/Warehouse/Warehouse';
import { deleteProduct } from '../utils/requests';

class WarehouseContainer extends React.PureComponent {

    componentDidMount() {
        if (!this.props.productsStore.products.data) {
            this.fetchAndHandleProducts();
        }
    }

    handleDeleteProduct = (id) => {
        deleteProduct(id)
            .then(() => {
                this.props.deleteProductAction(id)
            })
    }

    fetchAndHandleProducts = () => {
        fetchAndHandleProducts(this.props.getProductsAction);
    }

    render() {
        return (
            <Warehouse
                products={this.props.productsStore.products}
                fetchAndHandleProducts={fetchAndHandleProducts}
                productCategories={this.props.productsStore.productCategories}
                handleDeleteProduct={this.handleDeleteProduct} />)
    }
}




function mapStateToProps(state) {
    return {
        ordersStore: state.OrdersReducer,
        warehouseStore: state.WarehouseReducer,
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
