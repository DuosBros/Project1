import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LOCALSTORAGE_NAME } from '../appConfig';
import { getCostsMonthly, getOrderedOrdersMonthly, getOrderedOrdersDaily, getProductsDaily } from '../utils/requests';
import {
    getCostsMonthlyAction, getOrdersAction, mapOrdersToTransactionsActions, getBankTransactionsAction,
    getOrderedOrdersMonthlyAction, getOrderedOrdersDailyAction, getProductsDailyAction,
    getProductsAction, getNotPaidOrdersAction, getWarehouseProductsAction
} from '../utils/actions';
import Summary from '../pages/Summary';
import { fetchBankTransactions } from '../handlers/bankHandler';
import { sortMonthYear, groupBy } from '../utils/helpers';
import _ from 'lodash';
import moment from 'moment';
import { fetchAndHandleProducts } from '../handlers/productHandler';
import { fetchAndHandleOrders, fetchAndHandleNotPaidOrders } from '../handlers/orderHandler';
import { fetchWarehouseProducts } from '../handlers/warehouseHandler';

class SummaryContainer extends React.PureComponent {

    state = {
        user: localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : ""
    }

    componentDidMount() {
        this.fetchDataAndHandleResult();
        this.fetchProductsAndHandleResult();
        fetchAndHandleProducts(this.props.getProductsAction);
        this.fetchOrdersAndHandleResult();
        fetchAndHandleNotPaidOrders(this.props.getNotPaidOrdersAction)
        fetchWarehouseProducts(moment().month() + 1, moment().year(), this.props.getWarehouseProductsAction)
        fetchBankTransactions(this.props.getBankTransactionsAction, this.props.getOrdersAction, this.props.mapOrdersToTransactionsActions);
    }

    fetchOrdersAndHandleResult = (from, to) => {
        if (!from) {
            from = moment().utc().startOf('year').toISOString()
        }
        if (!to) {
            to = moment().utc().endOf('year').toISOString()
        }

        fetchAndHandleOrders(from, to, this.props.getOrdersAction)
    }

    fetchProductsAndHandleResult = async () => {
        // try {
        //     let res = await getProductsMonthly()
        //     this.props.getProductsMonthlyAction({ success: true, data: res.data })

        // } catch (err) {
        //     this.props.getProductsMonthlyAction({ success: false, error: err })
        // }

        this.fetchProductsDaily();
    }

    fetchProductsDaily = async (from, to) => {
        if (!from) {
            from = moment().utc().startOf('month').toISOString()
        }

        if (!to) {
            to = moment().utc().endOf('month').toISOString()
        }
        try {
            let res = await getProductsDaily(from, to)
            this.props.getProductsDailyAction({ success: true, data: res.data })

        } catch (err) {
            this.props.getProductsDailyAction({ success: false, error: err })
        }
    }

    fetchDataAndHandleResult = async () => {
        try {
            let res = await getOrderedOrdersMonthly()
            this.props.getOrderedOrdersMonthlyAction({ success: true, data: res.data })

        } catch (err) {
            this.props.getOrderedOrdersMonthlyAction({ success: false, error: err })
        }

        try {
            let res = await getCostsMonthly()
            this.props.getCostsMonthlyAction({ success: true, data: res.data })

        } catch (err) {
            this.props.getCostsMonthlyAction({ success: false, error: err })
        }

        this.fetchOrderedOrdersDaily();
    }

    fetchOrderedOrdersDaily = async (from, to) => {
        if (!from) {
            from = moment().utc().startOf('month').toISOString()
        }

        if (!to) {
            to = moment().utc().endOf('month').toISOString()
        }
        try {
            let res = await getOrderedOrdersDaily(from, to)
            this.props.getOrderedOrdersDailyAction({ success: true, data: res.data })

        } catch (err) {
            this.props.getOrderedOrdersDailyAction({ success: false, error: err })
        }
    }

    render() {

        let costsSummary = 0;
        let turnoverSummary = 0;
        let profitSummary = 0;
        let ordersCountSummary = 0;

        if (!this.props.summaryStore.orderedOrders.data
            || !this.props.summaryStore.costs.data || !this.props.summaryStore.costs.data ||
            !this.props.summaryStore.orderedOrdersDaily.data || !this.props.summaryStore.productsDaily.data) {
            return (
                <Summary
                    isMobile={this.props.isMobile}
                    fetchDataAndHandleResult={this.fetchDataAndHandleResult}
                    costs={this.props.summaryStore.costs}
                    orderedOrders={this.props.summaryStore.orderedOrders}
                    bankAccountInfo={this.props.bankStore.bankAccountInfo}
                    orderedOrdersDaily={this.props.summaryStore.orderedOrdersDaily}
                    productsDaily={this.props.summaryStore.productsDaily}
                />
            )
        }
        let ordersTotalPriceAvg = []
        if (this.props.ordersStore.orders.data) {
            let temp = this.props.ordersStore.orders.data.map(x => {
                x.month = moment(x.payment.orderDate).month() + 1
                x.year = moment(x.payment.orderDate).year()
                x.monthAndYear = x.month + "." + x.year

                return x
            });
            let groupedOrders = _.groupBy(temp, (item) => {
                return item.month
            })
            let keys = Object.keys(groupedOrders)
            let temp2 = keys.map(x => {
                let y = {}
                y.totalPriceSum = groupedOrders[x].map(x => x.totalPrice).reduce((a, b) => a + b, 0)
                y.totalPriceMonthlyAverage = Number.parseFloat((y.totalPriceSum / groupedOrders[x].length).toFixed(2))
                y.monthAndYear = groupedOrders[x][0].monthAndYear
                return y
            })

            let sum = temp2.map(x => x.totalPriceMonthlyAverage).reduce((a, b) => a + b)
            let avg = (sum / temp2.length).toFixed(2)

            ordersTotalPriceAvg = temp2.map(x => {
                x.totalPriceTotalAverage = avg
                return x
            })
        }

        let productsDaily = this.props.summaryStore.productsDaily.data.slice();
        // let productsMonthly = this.props.summaryStore.productsMonthly.data.slice();
        productsDaily = productsDaily.map(x => x.products).flat(1)

        let grouped = groupBy(productsDaily, "name")
        let groupedCategories = groupBy(productsDaily, "category")
        let keys = Object.keys(grouped);
        let keysCategories = Object.keys(groupedCategories);

        productsDaily = []
        let categoriesDaily = [];

        keys.forEach(x => {
            if (grouped[x].length > 1) {
                grouped[x][0].totalAmount = grouped[x].reduce((a, b) => (Number.isInteger(a.totalAmount) ? a.totalAmount : 0) + (Number.isInteger(b.totalAmount) ? b.totalAmount : 0))
                grouped[x][0].totalCount = grouped[x].reduce((a, b) => (Number.isInteger(a.totalCount) ? a.totalCount : 0) + (Number.isInteger(b.totalCount) ? b.totalCount : 0))
                productsDaily.push(grouped[x][0])
            }
            else {
                productsDaily.push(grouped[x][0])
            }
        })
        productsDaily = _.sortBy(productsDaily, (i) => i.name)

        keysCategories.forEach(x => {
            if (groupedCategories[x].length > 1) {
                groupedCategories[x][0].totalAmount = groupedCategories[x].map(x => x.totalAmount).reduce((a, b) => a + b)
                groupedCategories[x][0].totalCount = groupedCategories[x].map(x => x.totalCount).reduce((a, b) => a + b)
                categoriesDaily.push(groupedCategories[x][0])
            }
            else {
                categoriesDaily.push(groupedCategories[x][0])
            }
        })


        let turnoverDailySummary = 0;
        //let profitDailySummary = 0;
        let ordersCountDailySummary = 0;

        let dailyOrderedOrders = this.props.summaryStore.orderedOrdersDaily.data.slice();
        dailyOrderedOrders.map(x => {

            turnoverDailySummary += (x.turnover !== undefined || x.turnover !== null) ? x.turnover : 0
            //profitDailySummary += (x.profit !== undefined || x.profit !== null) ? x.profit : 0
            x.date = (x._id.day < 10 ? "0" + x._id.day : x._id.day) + "." + (x._id.month < 10 ? "0" + x._id.month : x._id.month)
            x.ordersCount = x.cashOrders.length + x.vsOrders.length
            ordersCountDailySummary += x.ordersCount

            return x;
        })

        dailyOrderedOrders.forEach(x => {
            x.turnoverAverage = (turnoverDailySummary / dailyOrderedOrders.length).toFixed(2)
            x.ordersCountAverage = (ordersCountDailySummary / dailyOrderedOrders.length).toFixed(2)
        })

        dailyOrderedOrders = dailyOrderedOrders.sort((a, b) => a.date - b.date)

        let orderedOrders = this.props.summaryStore.orderedOrders.data.slice();
        let orderedOrdersYearly = [];

        orderedOrders.map(x => {
            x.costs = 0;
            x.profit = 0;

            let found = this.props.summaryStore.costs.data.find(y => y._id.month === x._id.month && y._id.year === x._id.year)
            if (found) {
                x.costs = found.costs
                x.profit = x.turnover - x.costs
            }
            costsSummary += (x.costs !== undefined || x.costs !== null) ? x.costs : 0
            turnoverSummary += (x.turnover !== undefined || x.turnover !== null) ? x.turnover : 0
            profitSummary += (x.profit !== undefined || x.profit !== null) ? x.profit : 0

            x.date = (x._id.month < 10 ? "0" + x._id.month : x._id.month) + "." + x._id.year
            x.ordersCount = x.cashOrders.length + x.vsOrders.length
            ordersCountSummary += x.ordersCount
            return x;
        })

        grouped = _.groupBy(orderedOrders, (item) => {
            return item._id.year
        });

        keys = Object.keys(grouped);

        // removing 2016
        keys.splice(0, 1)

        keys.forEach(x => {
            let turnoverSumYearly = 0
            let costsSumYearly = 0
            let ordersCountSumYearly = 0
            grouped[x].forEach(y => {
                turnoverSumYearly += y.turnover
                costsSumYearly += y.costs
                ordersCountSumYearly += y.ordersCount
            })

            orderedOrdersYearly.push({
                date: x,
                turnover: turnoverSumYearly,
                costs: costsSumYearly,
                ordersCount: ordersCountSumYearly,
                profit: turnoverSumYearly - costsSumYearly
            })
        });

        orderedOrdersYearly = orderedOrdersYearly.reverse();

        orderedOrdersYearly.unshift({
            date: 'Average',
            costs: costsSummary / keys.length,
            turnover: turnoverSummary / keys.length,
            profit: profitSummary / keys.length,
            ordersCount: ordersCountSummary / keys.length
        });

        let median;
        let sorted = orderedOrders.sort((a, b) => {
            return a.ordersCount - b.ordersCount
        })

        var half = Math.floor(sorted.length / 2);

        if (sorted.length % 2) {
            median = sorted[half].ordersCount;
        }
        else {
            median = (sorted[half - 1].ordersCount + sorted[half].ordersCount) / 2.0;
        }

        orderedOrders.map(x => x.ordersCountMedian = median)

        orderedOrders = sortMonthYear(orderedOrders);

        orderedOrders.unshift({
            date: 'Average',
            costs: costsSummary / orderedOrders.length,
            turnover: turnoverSummary / orderedOrders.length,
            profit: profitSummary / orderedOrders.length,
            ordersCount: ordersCountSummary / orderedOrders.length,
        });

        orderedOrders.forEach(x => {
            x.turnoverAverage = (turnoverSummary / orderedOrders.length).toFixed(2)
            x.ordersCountAverage = (ordersCountSummary / orderedOrders.length).toFixed(2)
        })

        let receivables;
        if (this.props.ordersStore.notPaidOrders.success && this.props.ordersStore.notPaidOrders.data) {
            receivables = this.props.ordersStore.notPaidOrders.data.map(x => x.totalPrice).reduce((a, b) => a + b)
        }

        let warehouseValue = 0;
        if (this.props.productsStore.warehouseProducts.success && this.props.productsStore.warehouseProducts.data) {
            this.props.productsStore.warehouseProducts.data.forEach(x => {
                warehouseValue += x.price * x.available
            })
        }
        return (
            <Summary
                isMobile={this.props.isMobile}
                fetchDataAndHandleResult={this.fetchDataAndHandleResult}
                orderedOrders={{ success: this.props.summaryStore.orderedOrders.success, data: orderedOrders }}
                costs={this.props.summaryStore.costs}
                bankAccountInfo={this.props.bankStore.bankAccountInfo}
                orderedOrdersYearly={orderedOrdersYearly}
                sum={{
                    costs: costsSummary,
                    turnover: turnoverSummary,
                    profit: profitSummary,
                    ordersCount: ordersCountSummary
                }}
                orderedOrdersDaily={{ success: true, data: dailyOrderedOrders }}
                fetchProductsDaily={this.fetchProductsDaily}
                fetchOrderedOrdersDaily={this.fetchOrderedOrdersDaily}
                productsDaily={{ success: true, data: productsDaily }}
                categoriesDaily={categoriesDaily}
                fetchOrdersAndHandleResult={this.fetchOrdersAndHandleResult}
                ordersTotalPriceAvg={ordersTotalPriceAvg}
                receivables={receivables}
                warehouseValue={warehouseValue}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        summaryStore: state.SummaryReducer,
        bankStore: state.BankReducer,
        ordersStore: state.OrdersReducer,
        productsStore: state.ProductsReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getCostsMonthlyAction,
        getOrdersAction,
        getBankTransactionsAction,
        mapOrdersToTransactionsActions,
        getOrderedOrdersMonthlyAction,
        getOrderedOrdersDailyAction,
        getProductsDailyAction,
        getProductsAction,
        getNotPaidOrdersAction,
        getWarehouseProductsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryContainer);
