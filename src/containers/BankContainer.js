import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import {
    getBankTransactionsAction, mapOrdersToTransactionsActions, getOrdersAction,
    showGenericModalAction, getWarehouseProductsAction, getProductsAction,
    updateOrderInTransactionAction, getCostsAction, addCostAction, getOrderAction
} from '../utils/actions';
import { fetchAndHandleProducts } from '../handlers/productHandler';
import { fetchAndHandleThisYearOrders, handleTogglePaidOrder, fetchCostsAndHandleResult } from '../handlers/orderHandler';
import Bank from '../pages/Bank/Bank';
import { addCost, getBankTransactions } from '../utils/requests';
import { LOCALSTORAGE_NAME } from '../appConfig';

class BankContainer extends React.PureComponent {

    state = {
        hasMarkAllAsPaidStarted: false,
        user: localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : ""
    }

    componentDidMount() {
        this.fetchBankTransactions()

        if (!this.props.productsStore.products.data) {
            fetchAndHandleProducts(this.props.getProductsAction);
        }

        if (!this.props.costsStore.costs.data) {
            fetchCostsAndHandleResult({
                getCostsAction: this.props.getCostsAction
            })
        }
    }

    fetchBankTransactions = () => {
        getBankTransactions()
            .then(res => {
                this.props.getBankTransactionsAction({ success: true, data: res.data })
            })
            .then(() => {
                fetchAndHandleThisYearOrders(this.props.getOrdersAction, null, null, this.props.mapOrdersToTransactionsActions)
            })
            .catch(err => {
                this.props.getBankTransactionsAction({ success: false, error: err })
            })
    }

    fetchAndHandleProducts = () => {
        fetchAndHandleProducts(this.props.getProductsAction);
    }

    handleAddTransactionToCost = async (transaction) => {
        //TODO: check if the cost is already there
        let payload = {
            date: moment(transaction.date, "DD.MM.YYYY").toISOString(),
            description: transaction.note,
            cost: (transaction.value * -1),
            note: "Generated from Bank page"
        }

        try {
            await addCost(payload);
            this.props.addCostAction(payload)
            this.props.updateOrderInTransactionAction({ success: true, data: transaction.order });
        }
        catch (err) {
            this.props.showGenericModalAction({
                err: err
            })
        }
    }

    handleTogglePaidOrder = async (order) => {
        let updatedOrder = await handleTogglePaidOrder({
            order: order,
            user: this.state.user,
            getOrderAction: this.props.getOrderAction
        })

        this.props.updateOrderInTransactionAction({ success: true, data: updatedOrder });
    }


    handleMarkAllAsPaidButton = (orders) => {
        this.setState({ hasMarkAllAsPaidStarted: true });
        let promises = []
        orders.forEach(order => {
            promises.push(this.handleTogglePaidOrder(order))
        })

        Promise.all(promises)
            .catch((err) => {
                this.props.showGenericModalAction({
                    err: err
                })
            })
            .finally(() => {
                this.setState({ hasMarkAllAsPaidStarted: false });
            });

    }

    render() {
        return (
            <Bank
                isMobile={this.props.isMobile}
                hasMarkAllAsPaidStarted={this.state.hasMarkAllAsPaidStarted}
                handleMarkAllAsPaidButton={this.handleMarkAllAsPaidButton}
                handleTogglePaidOrder={this.handleTogglePaidOrder}
                costs={this.props.costsStore.costs}
                transactions={this.props.bankStore.transactions}
                products={this.props.productsStore.products}
                handleAddTransactionToCost={this.handleAddTransactionToCost}
                fetchAndHandleProducts={fetchAndHandleProducts}
                fetchBankTransactions={this.fetchBankTransactions}
                productCategories={this.props.productsStore.productCategories}
                bankAccountInfo={this.props.bankStore.bankAccountInfo} />)
    }
}

function mapStateToProps(state) {
    return {
        ordersStore: state.OrdersReducer,
        bankStore: state.BankReducer,
        costsStore: state.CostsReducer,
        productsStore: state.ProductsReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getProductsAction,
        getWarehouseProductsAction,
        getBankTransactionsAction,
        getCostsAction,
        updateOrderInTransactionAction,
        addCostAction,
        showGenericModalAction,
        mapOrdersToTransactionsActions,
        getOrdersAction,
        getOrderAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BankContainer);
