import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Message, Grid, Header, Table, Input, Button, Transition } from 'semantic-ui-react';
import moment from 'moment';

import {
    getBankTransactionsAction, mapOrdersToTransactionsActions, getOrdersAction,
    showGenericModalAction, openOrderDetailsAction, getAllProductsAction, getOrderAction,
    updateOrderInTransactionAction
} from '../../utils/actions'
import { getBankTransactions, getCurrentYearOrders, getAllProducts } from '../../utils/requests'
import ErrorMessage from '../../components/ErrorMessage';
import { APP_TITLE, GET_ORDERS_LIMIT, LOCALSTORAGE_NAME } from '../../appConfig';
import { filterInArrayOfObjects, debounce } from '../../utils/helpers';
import OrderInlineDetails from '../../components/OrderInlineDetails';
import { handleTogglePaidOrder } from '../../utils/businessHelpers';

class Bank extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            multiSearchInput: "",
            isMobile: props.isMobile,
            showFunctionsMobile: false,
            inputWidth: 0,
            showMultiSearchFilter: false,
            recordsLimit: props.isMobile ? GET_ORDERS_LIMIT / 5 : GET_ORDERS_LIMIT,
            rowIdsShowingDetails: [],
            user: localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : ""
        }

        this.updateFilters = debounce(this.updateFilters, 1000);

        this.showTogglePaidOrdersButtonRef = React.createRef()
    }

    componentDidMount() {
        this.fetchBankTransactions()

        if (!this.props.ordersStore.products.data) {
            this.fetchAndHandleProducts();
        }


        document.title = APP_TITLE + "Bank"
    }

    fetchAndHandleProducts = () => {
        getAllProducts()
            .then(res => {
                this.props.getAllProductsAction({ success: true, data: res.data })
            })
            .catch(err => {

                this.props.getAllProductsAction({ success: false, error: err })
            })
    }

    fetchBankTransactions = () => {
        getBankTransactions()
            .then(res => {
                this.props.getBankTransactionsAction({ success: true, data: res.data })
            })
            .then(() => {
                this.fetchAndHandleThisYearOrders()
            })
            .catch(err => {
                this.props.getBankTransactionsAction({ success: false, error: err })
            })
    }

    fetchAndHandleThisYearOrders = () => {
        if (!this.props.ordersStore.orders.data) {
            getCurrentYearOrders(null, null)
                .then(res => {
                    this.props.getOrdersAction({ data: res.data, success: true })
                    this.props.mapOrdersToTransactionsActions({ data: res.data, success: true })

                })
                .catch(err => {
                    this.props.getOrdersAction({ error: err, success: false })
                })
        }
        else {
            this.props.mapOrdersToTransactionsActions({ data: this.props.ordersStore.orders.data, success: true })
        }
    }

    filterData = (transactions, multiSearchInput) => {

        return filterInArrayOfObjects(
            multiSearchInput,
            transactions,
            [
                "date",
                "value",
                "vs",
                "accountNameSender",
                "accountIdSender",
                "note"
            ])
    }

    toggleShowFunctionsMobile = () => {
        this.setState({ showFunctionsMobile: !this.state.showFunctionsMobile })
    }

    handleFilterChange = (e, { value }) => {
        this.updateFilters(value ? value : "");
    }

    updateFilters = (value) => {
        this.setState({ multiSearchInput: value });
    }

    showFilter = () => {
        // for mobile shit
        if (this.showTogglePaidOrdersButtonRef.current) {
            this.setState({ inputWidth: this.showTogglePaidOrdersButtonRef.current.ref.offsetWidth });
        }

        this.setState({ showMultiSearchFilter: true })
    }

    toggleInlineDetails = (id, e) => {
        // do not fire if onclick was triggered on child elements
        e.preventDefault();
        if (e.target.className.indexOf("column") > -1 || e.target.className === "") {
            if (this.state.rowIdsShowingDetails.indexOf(id) > -1) {
                this.setState({
                    rowIdsShowingDetails: this.state.rowIdsShowingDetails.filter(x => {
                        return x !== id
                    })
                });
            }
            else {
                this.setState(prevState => ({
                    rowIdsShowingDetails: [...prevState.rowIdsShowingDetails, id]
                }))
            }
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

        let { multiSearchInput, isMobile, showFunctionsMobile, showMultiSearchFilter, recordsLimit, rowIdsShowingDetails } = this.state;
        let filteredByMultiSearch, mappedTransactions, table, pageHeader, notPaidOrdersCounter;
        let transactions = this.props.bankStore.transactions.data;

        if (multiSearchInput && multiSearchInput.length > 1) { // if filter is specified
            filteredByMultiSearch = this.filterData(transactions, multiSearchInput);
        }
        else {
            filteredByMultiSearch = transactions.slice(0, recordsLimit);
        }

        notPaidOrdersCounter = 0
        mappedTransactions = filteredByMultiSearch.map(transaction => {
            let transactionInlineDetails, actionButtons = null

            if (rowIdsShowingDetails.indexOf(transaction.index) > -1) {
                if (transaction.order) {
                    transactionInlineDetails = <OrderInlineDetails products={this.props.ordersStore.products} order={transaction.order} isMobile={isMobile} />
                }
                else {
                    transactionInlineDetails = isMobile ? <Table.Cell>No order details mapped. Probably not an incoming transaction.</Table.Cell> : <Table.Row style={transaction.rowStyle}><Table.Cell colSpan='6'>No order details mapped. Probably not an incoming transaction.</Table.Cell></Table.Row>
                }
            }

            if (transaction.isTransactionIncoming) {
                if (transaction.order) {
                    if (!transaction.order.payment.paid) {
                        notPaidOrdersCounter++;
                        actionButtons = <Button onClick={() => this.handleTogglePaidOrder(transaction.order)} className="buttonIconPadding" size={isMobile ? 'huge' : 'medium'} icon='dollar sign' />
                    }
                }
            }
            else {
                actionButtons = <Button className="buttonIconPadding" size={isMobile ? 'huge' : 'medium'} icon='dollar sign' />
            }

            if (isMobile) {
                // mobile return
                return (
                    <Table.Row
                        onClick={(e) => this.toggleInlineDetails(transaction.index, e)}
                        key={transaction.index}
                        style={transaction.rowStyle}
                        textAlign='center'>
                        <Table.Cell>
                            <Grid style={{ marginTop: '0', marginBottom: '0', paddingLeft: '1em', paddingRight: '1em' }}>
                                <Grid.Row style={{ padding: '0.5em' }}>
                                    <Grid.Column width={13}>
                                        {transaction.note}
                                    </Grid.Column>
                                    <Grid.Column style={{ textAlign: 'right' }} width={3}>
                                        {actionButtons}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row style={{ padding: '0.5em' }}>
                                    <Grid.Column width={13}>
                                        {transaction.vs} <strong>|</strong> {moment(transaction.date, 'DD.MM.YYYY').format('DD.MM')} <strong>|</strong> {transaction.value}
                                    </Grid.Column>
                                    <Grid.Column style={{ textAlign: 'right' }} width={3}>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Table.Cell>
                        {transactionInlineDetails}
                    </Table.Row>
                )

            }
            else {
                // desktop return
                return (
                    <React.Fragment key={transaction.index}>
                        <Table.Row
                            onClick={(e) => this.toggleInlineDetails(transaction.index, e)}
                            style={transaction.rowStyle}
                            textAlign='center'>
                            <Table.Cell>{transaction.index}</Table.Cell>
                            <Table.Cell>{transaction.date}</Table.Cell>
                            <Table.Cell><strong>{transaction.value}</strong></Table.Cell>
                            <Table.Cell>{transaction.vs}</Table.Cell>
                            <Table.Cell>{transaction.note}</Table.Cell>
                            <Table.Cell>{actionButtons}</Table.Cell>
                        </Table.Row>
                        {transactionInlineDetails}
                    </React.Fragment>
                )
            }
        })


        if (isMobile) {
            table = (
                <Table compact basic='very'>
                    <Table.Header>
                        <Table.Row className="textAlignCenter">
                            <Table.HeaderCell width={2}>Note</Table.HeaderCell>
                            <Table.HeaderCell width={1}>VS | Date | Price [CZK]</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {mappedTransactions}
                    </Table.Body>
                </Table>
            )

            pageHeader = (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Bank
                                <Button toggle onClick={this.toggleShowFunctionsMobile} floated='right' style={{ backgroundColor: showFunctionsMobile ? '#f2005696' : '#f20056', color: 'white' }} content={showFunctionsMobile ? 'Hide' : 'Show'} />
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Transition.Group animation='drop' duration={500}>
                        {showFunctionsMobile && (
                            <Grid.Row>
                                <Button fluid size='small' disabled={notPaidOrdersCounter > 0 ? false : true} content={'Mark orders as paid (' + notPaidOrdersCounter + ')'} id="primaryButton" />
                                <Grid.Column>
                                    <Input
                                        style={{ width: document.getElementsByClassName("ui fluid input drop visible transition")[0] ? document.getElementsByClassName("ui fluid input drop visible transition")[0].clientWidth : null }}
                                        ref={this.handleRef}
                                        fluid
                                        name="multiSearchInput"
                                        placeholder='Search...'
                                        onChange={this.handleFilterChange} />
                                </Grid.Column>
                            </Grid.Row>
                        )}
                    </Transition.Group>
                </Grid>
            )
        }
        else {
            table = (
                <Table compact padded basic='very'>
                    <Table.Header>
                        <Table.Row className="textAlignCenter">
                            <Table.HeaderCell width={1}>#</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Date</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Value</Table.HeaderCell>
                            <Table.HeaderCell width={3}>VS</Table.HeaderCell>
                            <Table.HeaderCell width={6}>Note</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {mappedTransactions}
                    </Table.Body>
                </Table>
            )

            pageHeader = (
                <Grid>
                    <Grid.Row columns={5} style={{ marginBottom: '1em' }}>
                        <Grid.Column width={2}>
                            <Header as='h1' content='Bank' />
                        </Grid.Column>
                        <Grid.Column width={2}>
                        </Grid.Column>
                        <Grid.Column width={5}>
                        </Grid.Column>
                        <Grid.Column width={4}>
                        </Grid.Column>
                        <Grid.Column width={3} textAlign='left' floated='right'>
                            <Transition animation='drop' duration={500} visible={showMultiSearchFilter}>
                                <>
                                    <Input
                                        fluid
                                        ref={this.handleRef}
                                        name="multiSearchInput"
                                        placeholder='Search...'
                                        onChange={this.handleFilterChange} />
                                </>
                            </Transition>
                            {
                                showMultiSearchFilter ? null : (
                                    <div style={{ textAlign: 'right' }}>
                                        <Icon
                                            name='search'
                                            style={{ backgroundColor: '#f20056', color: 'white', marginRight: '0.2em' }}
                                            circular
                                            link
                                            onClick={this.showFilter} />
                                    </div>
                                )
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }

        // render page
        return (
            <>
                {pageHeader}
                {table}
                {
                    multiSearchInput !== "" ? null : (
                        <Button onClick={this.loadMoreOrders} style={{ marginTop: '0.5em' }} fluid>Show More</Button>
                    )
                }
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        bankStore: state.BankReducer,
        ordersStore: state.OrdersReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getBankTransactionsAction,
        getOrdersAction,
        getOrderAction,
        mapOrdersToTransactionsActions,
        showGenericModalAction,
        openOrderDetailsAction,
        getAllProductsAction,
        updateOrderInTransactionAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Bank);