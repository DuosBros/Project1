import React from 'react';
import { Icon, Message, Grid, Header, Table, Input, Button, Transition, Popup, Modal, Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import ErrorMessage from '../../components/ErrorMessage';
import { APP_TITLE, GET_ORDERS_LIMIT } from '../../appConfig';
import { filterInArrayOfObjects, debounce, contains, pick, buildFilter } from '../../utils/helpers';
import OrderInlineDetails from '../../components/OrderInlineDetails';
import ExportDropdown from '../../components/ExportDropdown';

const MarkAllButtons = (props) => {
    return (
        <>
            <Button loading={props.hasMarkAllAsPaidStarted} onClick={() => props.handleMarkAllAsPaidButton(props.notPaidOrders)} fluid size='small' disabled={props.notPaidOrders.length > 0 ? false : true} content={'Mark orders as paid (' + props.notPaidOrders.length + ')'} id="primaryButton" />
        </>
    )
}
class Bank extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showCategoryModal: false,
            multiSearchInput: "",
            isMobile: props.isMobile,
            showFunctionsMobile: false,
            inputWidth: 0,
            showMultiSearchFilter: false,
            recordsLimit: props.isMobile ? GET_ORDERS_LIMIT / 5 : GET_ORDERS_LIMIT,
            rowIdsShowingDetails: [],
        }

        this.updateFilters = debounce(this.updateFilters, 500);

        this.showTogglePaidOrdersButtonRef = React.createRef()
    }

    componentDidMount() {
        document.title = APP_TITLE + "Bank"
    }

    loadMoreTransactions = () => {
        var currentLimit = this.state.recordsLimit + 100
        this.setState({ recordsLimit: currentLimit });
    }

    filterData = (transactions, multiSearchInput) => {

        return filterInArrayOfObjects(
            buildFilter(multiSearchInput),
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

    handleCategoryModalAddCost = () => {
        let transaction = this.state.transaction;
        transaction.category = this.state.category;

        this.props.handleAddTransactionToCost(transaction)
        this.setState({ showCategoryModal: !this.state.showCategoryModal })
    }

    handleAddition = (e, { value }) => {
        this.setState({ category: value });
    }

    handleCategoryDropdownOnChange = (e, b) => {
        let category = this.props.costCategories[b.value]
        if (category) {
            this.setState({ category: category.text });
        }
    }

    render() {
        // in case of error
        if (!(this.props.transactions.success && this.props.costs.success)) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Bank transaction
                            </Header>
                            <ErrorMessage handleRefresh={this.props.fetchBankTransactions} error={this.props.transactions.error} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (!(this.props.transactions.data && this.props.costs.data)) {
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

        if (this.state.showCategoryModal) {
            return (
                <Modal
                    closeOnDimmerClick={false}
                    dimmer={true}
                    size='small'
                    open={this.state.showCategoryModal}
                    closeOnEscape={true}
                    closeIcon={true}
                    onClose={() => this.setState({ showCategoryModal: !this.state.showCategoryModal })}
                >
                    <Modal.Header>
                        Add Category
                    </Modal.Header>
                    <Modal.Content>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column>
                                    <dl className="dl-horizontal">
                                        <dt>Date:</dt>
                                        <dd>{this.state.transaction.date}</dd>
                                        <dt>Cost:</dt>
                                        <dd>{this.state.transaction.value}</dd>
                                        <dt>Note:</dt>
                                        <dd>{this.state.transaction.note}</dd>
                                    </dl>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    Category
                                <Dropdown
                                        search
                                        allowAdditions
                                        onAddItem={this.handleAddition}
                                        fluid
                                        selection
                                        text={this.state.category}
                                        onChange={this.handleCategoryDropdownOnChange}
                                        options={this.props.costCategories}
                                        selectOnBlur={false}
                                        selectOnNavigation={false} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            content="Close"
                            onClick={() => this.setState({ showCategoryModal: false })}
                        />
                        <Button
                            primary
                            onClick={() => this.handleCategoryModalAddCost()}
                            labelPosition='right'
                            icon='checkmark'
                            content='Add to Cost'
                        />
                    </Modal.Actions>
                </Modal>
            )
        }

        const { multiSearchInput, isMobile, showFunctionsMobile, showMultiSearchFilter, recordsLimit, rowIdsShowingDetails } = this.state;
        let filteredByMultiSearch, mappedTransactions, table, pageHeader, notPaidOrders;
        let transactions = this.props.transactions.data;
        let costs = this.props.costs.data;

        if (multiSearchInput && multiSearchInput.length > 1) { // if filter is specified
            filteredByMultiSearch = this.filterData(transactions, multiSearchInput);
        } else {
            filteredByMultiSearch = transactions.slice(0, recordsLimit);
        }

        notPaidOrders = []
        mappedTransactions = filteredByMultiSearch.map(transaction => {
            let transactionInlineDetails, actionButtons = null

            if (rowIdsShowingDetails.indexOf(transaction.index) > -1) {
                if (transaction.order) {
                    transactionInlineDetails = <OrderInlineDetails products={this.props.products} order={transaction.order} isMobile={isMobile} />
                } else {
                    transactionInlineDetails = isMobile ? <Table.Cell>No order details mapped. Probably not an incoming transaction.</Table.Cell> : <Table.Row style={transaction.rowStyle}><Table.Cell colSpan='6'>No order details mapped. Probably not an incoming transaction.</Table.Cell></Table.Row>
                }
            }

            if (transaction.isTransactionIncoming) {
                if (transaction.order) {
                    if (transaction.order.totalPrice !== transaction.value) {
                        transaction.areValuesNotMatching = true
                    }
                    if (!transaction.order.payment.paid) {
                        notPaidOrders.push(transaction.order)
                        actionButtons = <Button onClick={() => this.handleTogglePaidOrder(transaction.order)} className="buttonIconPadding" size={isMobile ? 'huge' : 'medium'} icon='dollar sign' />
                    }
                }
            } else {
                let found = costs.some(cost => {
                    return (cost.dateFormated === transaction.date && cost.description === transaction.note && contains(cost.note, "Generated from Bank page"))
                })

                if (!found) {
                    actionButtons = <Button onClick={() => this.setState({ showCategoryModal: !this.state.showCategoryModal, transaction: transaction })} className="buttonIconPadding" size={isMobile ? 'huge' : 'medium'} icon='dollar sign' />
                }
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
                                        {transaction.vs} <strong>|</strong> {moment(transaction.date, 'DD.MM.YYYY').local().format('DD.MM')} <strong>|</strong> {transaction.value}
                                    </Grid.Column>
                                    <Grid.Column style={{ textAlign: 'right' }} width={3}>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Table.Cell>
                        {transactionInlineDetails}
                    </Table.Row>
                )
            } else {
                // desktop return
                return (
                    <React.Fragment key={transaction.index}>
                        <Table.Row
                            onClick={(e) => this.toggleInlineDetails(transaction.index, e)}
                            style={transaction.rowStyle}
                            textAlign='center'>
                            <Table.Cell>{transaction.index}</Table.Cell>
                            <Table.Cell>{transaction.date}</Table.Cell>
                            <Table.Cell><strong>{transaction.value}</strong>{transaction.areValuesNotMatching && <Popup inverted trigger={<Icon color="red" name="warning" />} content="Transaction value is not matching with order value" />}</Table.Cell>
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
                        <Grid.Column>
                            <strong>Balance:</strong> {this.props.bankAccountInfo.closingBalance} CZK
                        </Grid.Column>
                    </Grid.Row>
                    <Transition.Group animation='drop' duration={500}>
                        {showFunctionsMobile && (
                            <Grid.Row>
                                <MarkAllButtons hasMarkAllAsPaidStarted={this.props.hasMarkAllAsPaidStarted} handleMarkAllAsPaidButton={this.props.handleMarkAllAsPaidButton} notPaidOrders={notPaidOrders} />
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
        } else {
            table = (
                <Table compact padded basic='very'>
                    <Table.Header>
                        <Table.Row className="textAlignCenter">
                            <Table.HeaderCell width={1}>#</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Date</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Value [CZK]</Table.HeaderCell>
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
                            <ExportDropdown data={pick(filteredByMultiSearch, ["date", "value", "vs", "note"])} />
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Header as='h4'>
                                <strong>Balance:</strong> {this.props.bankAccountInfo.closingBalance} CZK
                            </Header>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <MarkAllButtons hasMarkAllAsPaidStarted={this.props.hasMarkAllAsPaidStarted} handleMarkAllAsPaidButton={this.props.handleMarkAllAsPaidButton} notPaidOrders={notPaidOrders} />
                        </Grid.Column>
                        <Grid.Column width={3}>
                        </Grid.Column>
                        <Grid.Column width={2}>
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
                                !showMultiSearchFilter && (
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
                    multiSearchInput === "" && (
                        <Button onClick={this.loadMoreTransactions} style={{ marginTop: '0.5em' }} fluid>Show More</Button>
                    )
                }
            </>
        )
    }
}

export default Bank;