import React from 'react';
import { Icon, Message, Grid, Header, Table, Input, Button, Transition, Popup, Modal, Dropdown, Segment } from 'semantic-ui-react';
import numeral from 'numeral';
import ErrorMessage from '../components/ErrorMessage';
import { APP_TITLE } from '../appConfig';
import { filterInArrayOfObjects, debounce, contains, pick, buildFilter, sortMonthYear, mapDataForGenericChart } from '../utils/helpers';
import SummaryTable from '../components/SummaryTable';
import GenericBarChart from '../charts/GenericBarChart';
import ExportDropdown from '../components/ExportDropdown';

class Summary extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            multiSearchInput: "",
            isMobile: props.isMobile,
            showFunctionsMobile: false,
            showMultiSearchFilter: false,
            recordsLimit: 5
        };

        this.updateFilters = debounce(this.updateFilters, 500);
    }

    componentDidMount() {
        document.title = APP_TITLE + "Summary";
    }

    filterData = (data, multiSearchInput) => {

        return filterInArrayOfObjects(
            buildFilter(multiSearchInput),
            data,
            [
                "monthAndYear",
                "costs",
                "turnover",
                "profit"
            ])
    }

    toggleShowFunctionsMobile = () => {
        this.setState({ showFunctionsMobile: !this.state.showFunctionsMobile });
    }

    handleFilterChange = (e, { value }) => {
        this.updateFilters(value ? value : "");
    }

    updateFilters = (value) => {
        this.setState({ multiSearchInput: value });
    }

    showFilter = () => {
        this.setState({ showMultiSearchFilter: true })
    }

    render() {
        // in case of error
        if (!this.props.orderedOrders.success || !this.props.costs.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Summary
                            </Header>
                            <ErrorMessage handleRefresh={this.props.fetchDataAndHandleResult} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (!this.props.orderedOrders.data || !this.props.costs.data) {
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
        const { multiSearchInput, isMobile, showFunctionsMobile, recordsLimit } = this.state;
        let filteredByMultiSearch, table, pageHeader;

        if (isMobile) {

            if (multiSearchInput && multiSearchInput.length > 1) { // if filter is specified
                filteredByMultiSearch = this.filterData(this.props.orderedOrders.data, multiSearchInput);
            } else {
                filteredByMultiSearch = this.props.orderedOrders.data.slice(0, recordsLimit);
            }

            let mapped = filteredByMultiSearch.map((x, i) => {
                return (
                    <Table.Row className="textAlignCenter" key={i}>
                        <Table.Cell>
                            <Grid style={{ marginTop: '0', marginBottom: '0', paddingLeft: '1em', paddingRight: '1em' }}>
                                <Grid.Row style={{ padding: '0.5em' }}>
                                    <Grid.Column>
                                        {x.monthAndYear}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row style={{ padding: '0.5em' }}>
                                    <Grid.Column>
                                        {numeral(x.turnover).format('0,0')} <strong>|</strong> {numeral(x.costs).format('0,0')} <strong>|</strong> {numeral(x.profit).format('0,0')}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Table.Cell>
                    </Table.Row>
                )
            })


            table = (
                <Table compact basic='very'>
                    <Table.Header>
                        <Table.Row className="textAlignCenter">
                            <Table.HeaderCell width={2}>Month/Year</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Turnover | Costs | Profit</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {mapped}
                    </Table.Body>
                </Table>
            )

            pageHeader = (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Summary
                                <Button toggle onClick={this.toggleShowFunctionsMobile} floated='right' style={{ backgroundColor: showFunctionsMobile ? '#f2005696' : '#f20056', color: 'white' }} content={showFunctionsMobile ? 'Hide' : 'Show'} />
                            </Header>
                        </Grid.Column>
                        <Grid.Column>
                            <strong>Balance: {this.props.bankAccountInfo.closingBalance ? this.props.bankAccountInfo.closingBalance : <Icon fitted loading name='circle notched' />} CZK</strong>
                        </Grid.Column>
                    </Grid.Row>
                    <Transition.Group animation='drop' duration={500}>
                        {showFunctionsMobile && (
                            <Grid.Row>
                                <Grid.Column>
                                    <Input
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

            // render page
            return (
                <>
                    {pageHeader}
                    {table}
                </>
            )
        } else {

            let rawOrderedOrders = this.props.orderedOrders.data.slice();
            rawOrderedOrders.splice(0, 2);
            rawOrderedOrders = rawOrderedOrders.reverse();

            // render page
            return (
                <Grid stackable>
                    <Grid.Row style={{ marginBottom: '1em' }}>
                        <Grid.Column width={2}>
                            <Header as='h1'>
                                Summary
                            </Header>
                        </Grid.Column>
                        <Grid.Column width={3} textAlign='left' verticalAlign='bottom' >
                            <Header as='h4'>
                                <strong>Balance: {this.props.bankAccountInfo.closingBalance ? this.props.bankAccountInfo.closingBalance : <Icon fitted loading name='circle notched' />} CZK</strong>
                            </Header>
                        </Grid.Column>
                        <Grid.Column width={11} textAlign='left' verticalAlign='bottom' >
                            <Header as='h4'>
                                <strong>Turnover: {numeral(this.props.sum.turnover).format('0,0')} CZK</strong> | <strong>Costs: {numeral(this.props.sum.costs).format('0,0')} CZK</strong> | <strong>Profit: {numeral(this.props.sum.profit).format('0,0')}</strong> CZK | <strong># Orders: {numeral(this.props.sum.ordersCount).format('0,0')}</strong>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns='equal'>

                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Accounting Monthly
                            </Header>
                            <Segment attached='bottom'>
                                <SummaryTable tableHeader={["export"]} compact="very" rowsPerPage={6} data={this.props.orderedOrders.data} />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Accounting Yearly
                            </Header>
                            <Segment attached='bottom'>
                                <SummaryTable tableHeader={["export"]} compact="very" rowsPerPage={6} data={this.props.orderedOrdersYearly} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Graphs
                            </Header>
                            <Segment attached='bottom'>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={3}>
                                            <Header as='h3' content='Orders per month [order date]' />
                                        </Grid.Column>
                                        <Grid.Column width={13}>
                                            <ExportDropdown data={pick(rawOrderedOrders, ["monthAndYear", "ordersCount"])} />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <GenericBarChart
                                            data={rawOrderedOrders}
                                            xDataKey="monthAndYear"
                                            yDataKey="ordersCount"
                                            avgDataKey="ordersCountMedian" />
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }
    }
}

export default Summary;