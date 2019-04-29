import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LOCALSTORAGE_NAME } from '../appConfig';
import { getPaidOrdersMonthly, getCostsMonthly } from '../utils/requests';
import { getCostsMonthlyAction, getPaidOrdersMonthlyAction } from '../utils/actions';
import Summary from '../pages/Summary';

class SummaryContainer extends React.PureComponent {

    state = {
        user: localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : ""
    }

    componentDidMount() {
        this.fetchDataAndHandleResult()
    }

    fetchDataAndHandleResult = async () => {
        try {
            let res = await getPaidOrdersMonthly()
            this.props.getPaidOrdersMonthlyAction({ success: true, data: res.data })

        } catch (err) {
            this.props.getPaidOrdersMonthlyAction({ success: false, error: err })
        }

        try {
            let res = await getCostsMonthly()
            this.props.getCostsMonthlyAction({ success: true, data: res.data })

        } catch (err) {
            this.props.getCostsMonthlyAction({ success: false, error: err })
        }
    }

    render() {
        return (
            <Summary
                isMobile={this.props.isMobile}
                fetchDataAndHandleResult={this.fetchDataAndHandleResult}
                orders={this.props.summaryStore.orders}
                costs={this.props.summaryStore.costs} />
        )
    }
}

function mapStateToProps(state) {
    return {
        summaryStore: state.SummaryReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPaidOrdersMonthlyAction,
        getCostsMonthlyAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryContainer);
