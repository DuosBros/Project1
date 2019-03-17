import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Message, Grid, Header } from 'semantic-ui-react';

import { getBankTransactionsAction, getOrdersAction, mapOrdersToTransactionsActions } from '../../utils/actions'
import { getBankTransactions, getCurrentYearOrders } from '../../utils/requests'
import ErrorMessage from '../../components/ErrorMessage';
import BankTransactionsTable from '../../components/BankTransactionsTable';
import { APP_TITLE } from '../../appConfig';

class Bank extends React.Component {
    componentDidMount() {
        this.fetchBankTransactions()

        document.title = APP_TITLE + "Bank"
    }

    fetchBankTransactions = () => {
        debugger
        getBankTransactions()
            .then(res => {
                debugger
                this.props.getBankTransactionsAction({ success: true, data: res.data })
            })
            .then(() => {
                debugger
                this.fetchAndHandleThisYearOrders()
            })
            .catch(err => {
                this.props.getBankTransactionsAction({ success: false, error: err })
            })
    }

    fetchAndHandleThisYearOrders = () => {
        debugger
        if (!this.props.orderStore.orders.data) {
            getCurrentYearOrders(null, null)
                .then(res => {
                    debugger
                    this.props.getOrdersAction({ data: res.data, success: true })
                    this.props.mapOrdersToTransactionsActions({ data: res.data, success: true })

                })
                .catch(err => {
                    this.props.getOrdersAction({ error: err, success: false })
                })
        }
        else {
            this.props.mapOrdersToTransactionsActions({ data: this.props.orderStore.orders.data, success: true })
        }
    }

    render() {
        // in case of error
        if (!this.props.bankStore.transactions.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Bank transaction
                            </Header>
                            <ErrorMessage handleRefresh={this.fetchBankTransactions} error={this.props.bankStore.transactions.error} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (!this.props.bankStore.transactions.data) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching bank transactions</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header as='h1'>
                            Bank transaction
                            </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column style={{ paddingLeft: '3em', paddingRight: '3em' }}>
                        <BankTransactionsTable compact="very" rowsPerPage={45} data={this.props.bankStore.transactions.data} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        bankStore: state.BankReducer,
        orderStore: state.OrdersReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getBankTransactionsAction,
        getOrdersAction,
        mapOrdersToTransactionsActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Bank);