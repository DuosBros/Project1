import React from 'react';
import { Icon, Message, Grid, Header, Table, Input, Button, Transition, Popup, Modal, Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import ErrorMessage from '../components/ErrorMessage';
import { APP_TITLE } from '../appConfig';
import { filterInArrayOfObjects, debounce, contains, pick, buildFilter, sortMonthYear } from '../utils/helpers';
import SummaryTable from '../components/SummaryTable';

class Summary extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            multiSearchInput: "",
            isMobile: props.isMobile,
            showFunctionsMobile: false,
            showMultiSearchFilter: false,
        }

        this.updateFilters = debounce(this.updateFilters, 500);
    }

    componentDidMount() {
        document.title = APP_TITLE + "Summary"
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

    render() {
        // in case of error
        if (!this.props.orders.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Summary
                            </Header>
                            <ErrorMessage handleRefresh={this.props.fetchDataAndHandleResult} error={this.props.orders.error} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        if (!this.props.costs.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Summary
                            </Header>
                            <ErrorMessage handleRefresh={this.props.fetchDataAndHandleResult} error={this.props.costs.error} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (!this.props.orders.data || !this.props.costs.data) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching summary data</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        const { multiSearchInput, isMobile, showFunctionsMobile, showMultiSearchFilter, recordsLimit, rowIdsShowingDetails } = this.state;
        let filteredByMultiSearch, mappedTransactions, table, pageHeader, notPaidOrders;

        // if (multiSearchInput && multiSearchInput.length > 1) { // if filter is specified
        //     filteredByMultiSearch = this.filterData(transactions, multiSearchInput);
        // } else {
        //     filteredByMultiSearch = transactions.slice(0, recordsLimit);
        // }

        // notPaidOrders = []
        // mappedTransactions = filteredByMultiSearch.map(transaction => {
        //     let transactionInlineDetails, actionButtons = null

        //     if (rowIdsShowingDetails.indexOf(transaction.index) > -1) {
        //         if (transaction.order) {
        //             transactionInlineDetails = <OrderInlineDetails products={this.props.products} order={transaction.order} isMobile={isMobile} />
        //         } else {
        //             transactionInlineDetails = isMobile ? <Table.Cell>No order details mapped. Probably not an incoming transaction.</Table.Cell> : <Table.Row style={transaction.rowStyle}><Table.Cell colSpan='6'>No order details mapped. Probably not an incoming transaction.</Table.Cell></Table.Row>
        //         }
        //     }

        //     if (transaction.isTransactionIncoming) {
        //         if (transaction.order) {
        //             if (transaction.order.totalPrice !== transaction.value) {
        //                 transaction.areValuesNotMatching = true
        //             }
        //             if (!transaction.order.payment.paid) {
        //                 notPaidOrders.push(transaction.order)
        //                 actionButtons = <Button onClick={() => this.handleTogglePaidOrder(transaction.order)} className="buttonIconPadding" size={isMobile ? 'huge' : 'medium'} icon='dollar sign' />
        //             }
        //         }
        //     } else {
        //         let found = costs.some(cost => {
        //             return (cost.dateFormated === transaction.date && cost.description === transaction.note && contains(cost.note, "Generated from Bank page"))
        //         })

        //         if (!found) {
        //             actionButtons = <Button onClick={() => this.setState({ showCategoryModal: !this.state.showCategoryModal, transaction: transaction })} className="buttonIconPadding" size={isMobile ? 'huge' : 'medium'} icon='dollar sign' />
        //         }
        //     }

        //     if (isMobile) {
        //         // mobile return
        //         return (
        //             <Table.Row
        //                 onClick={(e) => this.toggleInlineDetails(transaction.index, e)}
        //                 key={transaction.index}
        //                 style={transaction.rowStyle}
        //                 textAlign='center'>
        //                 <Table.Cell>
        //                     <Grid style={{ marginTop: '0', marginBottom: '0', paddingLeft: '1em', paddingRight: '1em' }}>
        //                         <Grid.Row style={{ padding: '0.5em' }}>
        //                             <Grid.Column width={13}>
        //                                 {transaction.note}
        //                             </Grid.Column>
        //                             <Grid.Column style={{ textAlign: 'right' }} width={3}>
        //                                 {actionButtons}
        //                             </Grid.Column>
        //                         </Grid.Row>
        //                         <Grid.Row style={{ padding: '0.5em' }}>
        //                             <Grid.Column width={13}>
        //                                 {transaction.vs} <strong>|</strong> {moment(transaction.date, 'DD.MM.YYYY').format('DD.MM')} <strong>|</strong> {transaction.value}
        //                             </Grid.Column>
        //                             <Grid.Column style={{ textAlign: 'right' }} width={3}>
        //                             </Grid.Column>
        //                         </Grid.Row>
        //                     </Grid>
        //                 </Table.Cell>
        //                 {transactionInlineDetails}
        //             </Table.Row>
        //         )
        //     } else {
        //         // desktop return
        //         return (
        //             <React.Fragment key={transaction.index}>
        //                 <Table.Row
        //                     onClick={(e) => this.toggleInlineDetails(transaction.index, e)}
        //                     style={transaction.rowStyle}
        //                     textAlign='center'>
        //                     <Table.Cell>{transaction.index}</Table.Cell>
        //                     <Table.Cell>{transaction.date}</Table.Cell>
        //                     <Table.Cell><strong>{transaction.value}</strong>{transaction.areValuesNotMatching && <Popup inverted trigger={<Icon color="red" name="warning" />} content="Transaction value is not matching with order value" />}</Table.Cell>
        //                     <Table.Cell>{transaction.vs}</Table.Cell>
        //                     <Table.Cell>{transaction.note}</Table.Cell>
        //                     <Table.Cell>{actionButtons}</Table.Cell>
        //                 </Table.Row>
        //                 {transactionInlineDetails}
        //             </React.Fragment>
        //         )
        //     }
        // })


        if (isMobile) {
            // table = (
            //     <Table compact basic='very'>
            //         <Table.Header>
            //             <Table.Row className="textAlignCenter">
            //                 <Table.HeaderCell width={2}>Note</Table.HeaderCell>
            //                 <Table.HeaderCell width={1}>VS | Date | Price [CZK]</Table.HeaderCell>
            //             </Table.Row>
            //         </Table.Header>
            //         <Table.Body>
            //             {mappedTransactions}
            //         </Table.Body>
            //     </Table>
            // )

            // pageHeader = (
            //     <Grid stackable>
            //         <Grid.Row>
            //             <Grid.Column>
            //                 <Header as='h1'>
            //                     Bank
            //                     <Button toggle onClick={this.toggleShowFunctionsMobile} floated='right' style={{ backgroundColor: showFunctionsMobile ? '#f2005696' : '#f20056', color: 'white' }} content={showFunctionsMobile ? 'Hide' : 'Show'} />
            //                 </Header>
            //             </Grid.Column>
            //             <Grid.Column>
            //                 <strong>Balance:</strong> {this.props.bankAccountInfo.closingBalance} CZK
            //             </Grid.Column>
            //         </Grid.Row>
            //         <Transition.Group animation='drop' duration={500}>
            //             {showFunctionsMobile && (
            //                 <Grid.Row>
            //                     <MarkAllButtons hasMarkAllAsPaidStarted={this.props.hasMarkAllAsPaidStarted} handleMarkAllAsPaidButton={this.props.handleMarkAllAsPaidButton} notPaidOrders={notPaidOrders} />
            //                     <Grid.Column>
            //                         <Input
            //                             style={{ width: document.getElementsByClassName("ui fluid input drop visible transition")[0] ? document.getElementsByClassName("ui fluid input drop visible transition")[0].clientWidth : null }}
            //                             ref={this.handleRef}
            //                             fluid
            //                             name="multiSearchInput"
            //                             placeholder='Search...'
            //                             onChange={this.handleFilterChange} />
            //                     </Grid.Column>
            //                 </Grid.Row>
            //             )}
            //         </Transition.Group>
            //     </Grid>
            // )

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
        } else {
            let data = this.props.orders.data.slice()
            data.map(x => {
                let found = this.props.costs.data.find(y => y._id.month === x._id.month && y._id.year === x._id.year)
                if (found) {
                    x.costs = found.costs
                    x.profit = x.turnover - x.costs
                }
                x.monthAndYear = (x._id.month < 10 ? "0" + x._id.month : x._id.month) + "." + x._id.year

                return x;
            })

            data = sortMonthYear(data);
            let costsSummary = data.map(x => x.costs).reduce((a, b) => { return a + b });
            let turnoverSummary = data.map(x => x.turnover).reduce((a, b) => { return a + b });
            let profitSummary = data.map(x => x.profit).reduce((a, b) => { return a + b });

            let length = data.length;
            let costsAvg = costsSummary / length;
            let turnoverAvg = turnoverSummary / length;
            let profitAvg = profitSummary / length;

            data.unshift({
                monthAndYear: <em><strong>Average</strong></em>,
                costs: costsAvg,
                turnover: turnoverAvg,
                profit: profitAvg
            });

            data.unshift({
                monthAndYear: <em><strong>Total</strong></em>,
                costs: costsSummary,
                turnover: turnoverSummary,
                profit: profitSummary
            });

            // render page
            return (
                <Grid stackable>
                    <Grid.Row style={{ marginBottom: '1em' }}>
                        <Grid.Column width={2}>
                            <Header as='h1'>
                                Summary
                            </Header>
                        </Grid.Column>
                        {/* <Grid.Column width={2} textAlign='left'>
                            <Button onClick={() => this.handleToggleEditCostModal()} fluid size='large' compact content='Add Cost' id="primaryButton" />
                        </Grid.Column> */}
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <SummaryTable compact="very" rowsPerPage={5} data={data} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }
    }
}

export default Summary;