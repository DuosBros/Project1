import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LOCALSTORAGE_NAME } from '../appConfig';
import { getCostsMonthly, getOrderedOrdersMonthly } from '../utils/requests';
import {
    getCostsMonthlyAction, getOrdersAction, mapOrdersToTransactionsActions, getBankTransactionsAction,
    getOrderedOrdersMonthlyAction
} from '../utils/actions';
import Summary from '../pages/Summary';
import { fetchAndHandleThisYearOrders } from '../handlers/orderHandler';
import { fetchBankTransactions } from '../handlers/bankHandler';
import { sortMonthYear } from '../utils/helpers';
import _ from 'lodash';

class SummaryContainer extends React.PureComponent {

    state = {
        user: localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : ""
    }

    componentDidMount() {
        this.fetchDataAndHandleResult();
        fetchBankTransactions(this.props.getBankTransactionsAction, this.props.getOrdersAction, this.props.mapOrdersToTransactionsActions);
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
    }

    render() {

        let costsSummary = 0;
        let turnoverSummary = 0;
        let profitSummary = 0;
        let ordersCountSummary = 0;

        if (!this.props.summaryStore.orderedOrders.success
            || !this.props.summaryStore.orderedOrders.data
            || !this.props.summaryStore.costs.data || !this.props.summaryStore.costs.data) {
            return (
                <Summary
                    isMobile={this.props.isMobile}
                    fetchDataAndHandleResult={this.fetchDataAndHandleResult}
                    costs={this.props.summaryStore.costs}
                    orderedOrders={this.props.summaryStore.orderedOrders}
                    bankAccountInfo={this.props.bankStore.bankAccountInfo} />
            )
        }

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

            x.monthAndYear = (x._id.month < 10 ? "0" + x._id.month : x._id.month) + "." + x._id.year
            x.ordersCount = x.cashOrders.length + x.vsOrders.length
            ordersCountSummary += x.ordersCount
            return x;
        })

        var pica = _.groupBy(orderedOrders, (item) => {
            return item._id.year
        });

        let keys = Object.keys(pica);
        keys.map(x => {
            let turnoverSumYearly = 0
            let costsSumYearly = 0
            let ordersCountSumYearly = 0
            pica[x].forEach(y => {
                turnoverSumYearly += y.turnover
                costsSumYearly += y.costs
                ordersCountSumYearly += y.ordersCount
            })

            orderedOrdersYearly.push({
                monthAndYear: x,
                turnover: turnoverSumYearly,
                costs: costsSumYearly,
                ordersCountSumYearly,
                profit: turnoverSumYearly - costsSumYearly
            })
        });

        orderedOrdersYearly = orderedOrdersYearly.reverse();

        orderedOrdersYearly.unshift({
            monthAndYear: <em><strong>Average</strong></em>,
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
            median = (sorted[half - 1] + sorted[half]) / 2.0;
        }

        orderedOrders.map(x => x.ordersCountMedian = median)

        orderedOrders = sortMonthYear(orderedOrders);

        orderedOrders.unshift({
            monthAndYear: <em><strong>Average</strong></em>,
            costs: costsSummary / orderedOrders.length,
            turnover: turnoverSummary / orderedOrders.length,
            profit: profitSummary / orderedOrders.length,
            ordersCount: ordersCountSummary / orderedOrders.length,
        });

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
                }} />
        )
    }
}

function mapStateToProps(state) {
    return {
        summaryStore: state.SummaryReducer,
        bankStore: state.BankReducer,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getCostsMonthlyAction,
        getOrdersAction,
        getBankTransactionsAction,
        mapOrdersToTransactionsActions,
        getOrderedOrdersMonthlyAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryContainer);
