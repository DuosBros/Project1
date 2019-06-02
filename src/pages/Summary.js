import React from 'react';
import { Icon, Message, Grid, Header, Button, Dropdown, Segment, Modal } from 'semantic-ui-react';
import numeral from 'numeral';
import ErrorMessage from '../components/ErrorMessage';
import { APP_TITLE, SUMMARY_TYPES, MONTHS, YEARS } from '../appConfig';
import { pick } from '../utils/helpers';
import SummaryTable from '../components/SummaryTable';
import ExportDropdown from '../components/ExportDropdown';
import moment from 'moment';
import GenericLineChart from '../charts/GenericLineChart';

class Summary extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            showModalWarning: false,
            isMobile: props.isMobile,
            recordsLimit: 5,
            type: "Monthly",
            month: moment().month() + 1,
            year: moment().year()
        };
    }

    componentDidMount() {
        document.title = APP_TITLE + "Summary?month=" + this.state.month + "&year=" + this.state.year;
    }

    handleTypeDropdownChange = (e, { value }) => {
        this.setState({ type: value });
    }

    handleMonthDropdownChange = (e, { value }) => {
        let start = moment([this.state.year, value]).utc().startOf('month').toISOString();
        let end = moment([this.state.year, value]).utc().endOf('month').toISOString();
        this.props.fetchOrderedOrdersDaily(start, end)
        this.props.fetchProductsDaily(start, end)

        this.setState({ month: Number.parseInt(value) });
    }

    handleYearDropdownChange = (e, { value }) => {
        if (this.state.type === "Monthly") {
            let start = moment([value, this.state.month]).utc().startOf('month').toISOString();
            let end = moment([value, this.state.month]).utc().endOf('month').toISOString();
            this.props.fetchOrderedOrdersDaily(start, end);
        }

        // if (this.state.type === "Yearly") {
        //     this.props.fetchOrdersAndHandleResult(
        //         moment().year(value).utc().startOf('year').toISOString(),
        //         moment().year(value).utc().endOf('year').toISOString());
        // }

        this.setState({ year: Number.parseInt(value) });
    }

    render() {
        // in case of error
        if (!this.props.orderedOrders.success || !this.props.costs.success || !this.props.orderedOrdersDaily.success
            || !this.props.productsDaily.success) {
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
        if (!this.props.orderedOrders.data || !this.props.costs.data
            || !this.props.orderedOrdersDaily.data || !this.props.productsDaily.data) {
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

        if (this.state.isMobile && !this.state.showModalWarning) {
            return (
                <Modal
                    closeOnDimmerClick={false}
                    dimmer={true}
                    size='small'
                    open={!this.state.showModalWarning}
                    closeOnEscape={true}
                    closeIcon={true}
                    onClose={() => this.setState({ showModalWarning: !this.state.showModalWarning })}
                >
                    <Modal.Header>Page warning</Modal.Header>
                    <Modal.Content>
                        For optimal experience, you should use desktop for this page. For okay-ish visibility, use your mobile/tablet horizontally.
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            onClick={() => this.setState({ showModalWarning: !this.state.showModalWarning })}
                            labelPosition='right'
                            icon='checkmark'
                            content='OK'
                        />
                    </Modal.Actions>
                </Modal>
            )
        }

        // remove average which was used for table
        let rawOrderedOrders = this.props.orderedOrders.data.slice(1, this.props.orderedOrders.data.length).reverse().filter(x => x._id.year !== 2016);
        let yearlyOrderedOrdersFiltered = rawOrderedOrders
            .filter(x => x._id.year === this.state.year)

        let tempSum = yearlyOrderedOrdersFiltered.reduce((a, b) => { return { turnoverAverage: Number.parseFloat(a.turnoverAverage) + Number.parseFloat(b.turnoverAverage) } }).turnoverAverage
        let tempSumCount = yearlyOrderedOrdersFiltered.reduce((a, b) => { return { ordersCountAverage: Number.parseFloat(a.ordersCountAverage) + Number.parseFloat(b.ordersCountAverage) } }).ordersCountAverage

        yearlyOrderedOrdersFiltered.forEach(x => {
            x.turnoverAverage = (tempSum / yearlyOrderedOrdersFiltered.length).toFixed(2)
            x.ordersCountAverage = (tempSumCount / yearlyOrderedOrdersFiltered.length).toFixed(2)
        })

        let dropdowns, ordersTurnoverGraph, ordersCountGraph, dataToExport, ordersTotalPriceAvgRow,
            productsMonthlyCountRow, productsMonthlyTurnoverRow, productCategoriesTurnoverRow;

        if (this.state.type === "Monthly") {
            dataToExport = this.props.orderedOrdersDaily.data;

            ordersTurnoverGraph = (
                <GenericLineChart
                    data={this.props.orderedOrdersDaily.data}
                    xDataKey="date"
                    ydataKey1="turnover"
                    ydataKey2="turnoverMedian"
                    tooltipFormatter={{
                        formatter: "CZK"
                    }}
                />
            )

            ordersCountGraph = (
                <GenericLineChart
                    data={this.props.orderedOrdersDaily.data}
                    xDataKey="date"
                    ydataKey1="ordersCount"
                    ydataKey2="ordersCountMedian"
                    tooltipFormatter={{
                        formatter: "pcs"
                    }}
                />
            )

            productsMonthlyCountRow = (
                <>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <Header as='h3' content={'Products count - ' + this.state.type} />
                        </Grid.Column>
                        <Grid.Column textAlign="right" width={11}>
                            <ExportDropdown data={pick(this.props.productsDaily.data, ["name", "category", "totalAmount", "totalCount"])} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <GenericLineChart
                            longNames={true}
                            data={this.props.productsDaily.data}
                            xDataKey="name"
                            ydataKey1="totalCount"
                            tooltipFormatter={{
                                formatter: "pcs"
                            }}
                        />
                    </Grid.Row>
                </>
            )

            productsMonthlyTurnoverRow = (
                <>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <Header as='h3' content={'Products turnover - ' + this.state.type} />
                        </Grid.Column>
                        <Grid.Column textAlign="right" width={11}>
                            <ExportDropdown data={pick(this.props.productsDaily.data, ["name", "category", "totalAmount", "totalCount"])} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <GenericLineChart
                            longNames={true}
                            data={this.props.productsDaily.data}
                            xDataKey="name"
                            ydataKey1="totalAmount"
                            tooltipFormatter={{
                                formatter: "CZK"
                            }}
                        />
                    </Grid.Row>
                </>
            )

            productCategoriesTurnoverRow = (
                <>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <Header as='h3' content={'Product categories - ' + this.state.type} />
                        </Grid.Column>
                        <Grid.Column textAlign="right" width={11}>
                            <ExportDropdown data={pick(this.props.productsDaily.data, ["name", "category", "totalAmount", "totalCount"])} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <GenericLineChart
                            data={this.props.categoriesDaily}
                            xDataKey="category"
                            ydataKey1="totalAmount"
                            tooltipFormatter={{
                                formatter: "CZK"
                            }}
                        />
                    </Grid.Row>
                </>
            )

            dropdowns = (
                <>
                    <Dropdown
                        style={{ marginLeft: '0.3em' }}
                        selection
                        onChange={this.handleMonthDropdownChange}
                        options={MONTHS}
                        text={this.state.month.toString()}
                        selectOnBlur={false}
                        selectOnNavigation={false} />
                    < Dropdown
                        style={{ marginLeft: '0.3em' }
                        }
                        selection
                        onChange={this.handleYearDropdownChange}
                        options={YEARS}
                        text={this.state.year.toString()}
                        selectOnBlur={false}
                        selectOnNavigation={false} />
                </>
            )
        }

        if (this.state.type === "Yearly") {
            dataToExport = yearlyOrderedOrdersFiltered;
            ordersTurnoverGraph = (
                <GenericLineChart
                    data={yearlyOrderedOrdersFiltered}
                    xDataKey="date"
                    ydataKey1="turnover"
                    ydataKey2="turnoverAverage"
                    tooltipFormatter={{
                        formatter: "CZK"
                    }}
                />
            )

            ordersCountGraph = (
                <GenericLineChart
                    data={yearlyOrderedOrdersFiltered}
                    xDataKey="date"
                    ydataKey1="ordersCount"
                    ydataKey2="ordersCountAverage"
                    tooltipFormatter={{
                        formatter: "pcs"
                    }}
                />
            )

            ordersTotalPriceAvgRow = (
                <>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <Header as='h3' content={'Total price of order - ' + this.state.type} />
                        </Grid.Column>
                        <Grid.Column textAlign="right" width={11}>
                            <ExportDropdown data={pick(dataToExport, ["monthAndYear", "totalPriceMonthlyMedian", "totalPriceTotalMedian"])} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <GenericLineChart
                            data={this.props.ordersTotalPriceMedian.filter(x => x.year === this.state.year)}
                            xDataKey="monthAndYear"
                            ydataKey1="totalPriceMonthlyMedian"
                            ydataKey2="totalPriceTotalMedian"
                            tooltipFormatter={{
                                formatter: "CZK"
                            }}
                        />
                    </Grid.Row>
                </>
            )

            dropdowns = (
                < Dropdown
                    style={{ marginLeft: '0.3em' }
                    }
                    selection
                    onChange={this.handleYearDropdownChange}
                    options={YEARS}
                    text={this.state.year.toString()}
                    selectOnBlur={false}
                    selectOnNavigation={false} />
            )
        }

        if (this.state.type === "Total") {
            dataToExport = rawOrderedOrders;
            ordersTurnoverGraph = (
                <GenericLineChart
                    data={rawOrderedOrders}
                    xDataKey="date"
                    ydataKey1="turnover"
                    ydataKey2="turnoverAverage"
                    tooltipFormatter={{
                        formatter: "CZK"
                    }}
                />
            )

            ordersCountGraph = (
                <GenericLineChart
                    data={rawOrderedOrders}
                    xDataKey="date"
                    ydataKey1="ordersCount"
                    ydataKey2="ordersCountMedian"
                    tooltipFormatter={{
                        formatter: "pcs"
                    }}
                />
            )

            ordersTotalPriceAvgRow = (
                <>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <Header as='h3' content={'Total price of order - ' + this.state.type} />
                        </Grid.Column>
                        <Grid.Column textAlign="right" width={11}>
                            <ExportDropdown data={pick(dataToExport, ["monthAndYear", "totalPriceMonthlyMedian", "totalPriceTotalMedian"])} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <GenericLineChart
                            data={this.props.ordersTotalPriceMedian}
                            xDataKey="monthAndYear"
                            ydataKey1="totalPriceMonthlyMedian"
                            ydataKey2="totalPriceTotalMedian"
                            tooltipFormatter={{
                                formatter: "CZK"
                            }}
                        />
                    </Grid.Row>
                </>
            )
        }

        let totalAssets = this.props.bankAccountInfo.closingBalance ? (this.props.receivables + this.props.warehouseValue + this.props.bankAccountInfo.closingBalance) : <Icon fitted loading name='circle notched' />

        // render page
        return (
            <Grid stackable>
                <Grid.Row style={{ marginBottom: '1em' }}>
                    <Grid.Column width={2}>
                        <Header as='h1'>
                            Summary
                            </Header>
                    </Grid.Column>
                    <Grid.Column width={5} textAlign='left' verticalAlign='bottom' >
                        <Header as='h4'>
                            <dl className="dl-horizontal">
                                <dt>Balance:</dt>
                                <dd>{this.props.bankAccountInfo.closingBalance ? numeral(this.props.bankAccountInfo.closingBalance).format('0,0') : <Icon fitted loading name='circle notched' />} CZK</dd>
                                <dt>Receivables:</dt>
                                <dd>{this.props.receivables ? numeral(this.props.receivables).format('0,0') : <Icon fitted loading name='circle notched' />} CZK</dd>
                                <dt>WH value:</dt>
                                <dd>{this.props.warehouseValue ? numeral(this.props.warehouseValue).format('0,0') : <Icon fitted loading name='circle notched' />} CZK</dd>
                                <dt>Total assets:</dt>
                                <dd>{numeral(totalAssets).format('0,0')} CZK</dd>
                            </dl>
                        </Header>
                    </Grid.Column>
                    <Grid.Column width={9} textAlign='left' verticalAlign='bottom' >
                        {/* <Header as='h4'>
                            <strong>Turnover: {numeral(this.props.sum.turnover).format('0,0')} CZK</strong> | <strong>Costs: {numeral(this.props.sum.costs).format('0,0')} CZK</strong> | <strong>Profit: {numeral(this.props.sum.profit).format('0,0')}</strong> CZK | <strong># Orders: {numeral(this.props.sum.ordersCount).format('0,0')}</strong>
                        </Header> */}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns='equal'>

                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Accounting Monthly
                                <ExportDropdown direction='left' style={{ float: 'right' }} data={pick(this.props.orderedOrders.data, ["monthAndYear", "turnover", "costs", "profit"])} />
                        </Header>
                        <Segment attached='bottom'>
                            <SummaryTable tableHeader={false} compact="very" rowsPerPage={6} data={this.props.orderedOrders.data} />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Accounting Yearly
                                <ExportDropdown direction='left' style={{ float: 'right' }} data={pick(this.props.orderedOrdersYearly, ["monthAndYear", "turnover", "costs", "profit"])} />
                        </Header>
                        <Segment attached='bottom'>
                            <SummaryTable tableHeader={false} compact="very" rowsPerPage={6} data={this.props.orderedOrdersYearly} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Graphs
                                <Dropdown
                                style={{ marginLeft: '0.3em' }}
                                selection
                                onChange={this.handleTypeDropdownChange}
                                options={SUMMARY_TYPES}
                                text={this.state.type}
                                selectOnBlur={false}
                                selectOnNavigation={false} />
                            {dropdowns}
                        </Header>
                        <Segment attached='bottom'>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={5}>
                                        <Header as='h3' content={'Orders turnover - ' + this.state.type} />
                                    </Grid.Column>
                                    <Grid.Column textAlign="right" width={11}>
                                        <ExportDropdown data={pick(dataToExport, ["date", "turnover", "turnoverAverage"])} />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    {ordersTurnoverGraph}

                                    {/* <GenericBarChart
                                            data={rawOrderedOrders}
                                            xDataKey="monthAndYear"
                                            yDataKey="ordersCount"
                                            avgDataKey="ordersCountMedian" /> */}
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={5}>
                                        <Header as='h3' content={'Order count - ' + this.state.type} />
                                    </Grid.Column>
                                    <Grid.Column textAlign="right" width={11}>
                                        <ExportDropdown data={pick(dataToExport, ["date", "ordersCount", "ordersCountAverage"])} />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    {ordersCountGraph}
                                </Grid.Row>
                                {productsMonthlyCountRow}
                                {productsMonthlyTurnoverRow}
                                {ordersTotalPriceAvgRow}
                                {productCategoriesTurnoverRow}
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )

    }
}

export default Summary;