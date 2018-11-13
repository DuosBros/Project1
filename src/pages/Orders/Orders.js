import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, Table, Message, Image, Icon, Input } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import ReactTable from "react-table";

import { getCurrentYearOrders } from '../../utils/requests';
import { getOrdersAction, openOrderDetailsAction } from '../../utils/actions';

import { errorColor, successColor, warningColor, GET_ORDERS_LIMIT } from '../../appConfig'

import Spinner from '../../assets/Spinner.svg'


class Orders extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mobileShowHeader: false,
            expanded: null,
            showColumnFilters: false,
            filteredOrders: [],
            showPaidOrders: true,
            ordersLimit: GET_ORDERS_LIMIT
        }

        getCurrentYearOrders(GET_ORDERS_LIMIT)
            .then(res => {
                this.props.getOrdersAction(res.data)
            })
    }

    openOrderDetails = (order) => {
        this.props.openOrderDetailsAction(order);
    }

    expandRow = (row) => {
        var expanded = { ...this.state.expanded };
        if (expanded[row.index]) {
            expanded[row.index] = !expanded[row.index];
        } else {
            expanded[row.index] = true;
        }

        this.setState({
            expanded: expanded
        });
    }

    getBackgroundColor(order) {
        var backgroundColor;

        if (_.isEmpty(order)) {
            return {}
        }

        if(order.original.fullOrder.payment.paid) {
            backgroundColor = successColor
        }
        else if (!_.isEmpty(order.original.fullOrder.zaslatDate) && !order.original.fullOrder.payment.paid) {
            backgroundColor = warningColor
        }
        else {
            backgroundColor = errorColor
        }
        

        return backgroundColor
    }

    handleToggleColumnFilters = () => {
        this.setState({ showColumnFilters: !this.state.showColumnFilters });
    }

    handleToggleShowPaidOrders = () => {
        if(this.state.showPaidOrders) {
            var filteredOrders = this.props.ordersPageStore.orders.filter(order => {
                return !order.payment.paid
            })
            this.setState({ filteredOrders: filteredOrders, showPaidOrders: !this.state.showPaidOrders });
        }
        else {
            this.setState({ filteredOrders: [], showPaidOrders: !this.state.showPaidOrders });
        }
    }

    loadMoreOrders = () => {
        var currentLimit = this.state.ordersLimit + 100

        getCurrentYearOrders(currentLimit)
        .then(res => {
            this.props.getOrdersAction(res.data)
            this.setState({ ordersLimit: currentLimit });
        })
    }

    render() {

        var { showColumnFilters, filteredOrders, showPaidOrders, ordersLimit } = this.state;
        var counter = 0;
        var sortedOrders;

        if (filteredOrders.length > 0) {
            sortedOrders = _.orderBy(filteredOrders, ['payment.orderDate'], ['desc']);
        }
        else {
            sortedOrders = _.orderBy(this.props.ordersPageStore.orders, ['payment.orderDate'], ['desc']);
        }

        var mappedOrders = sortedOrders.map(order => {

            if (this.props.isMobile) {
                return (
                    <Table.Row positive={order.payment.paid} negative={_.isEmpty(order.zaslatDate)} warning={!_.isEmpty(order.zaslatDate) && !order.payment.paid}  textAlign='center' key={order._id}>
                        <Table.Cell style={{ color: 'black' }}>{(order.address.lastName ? order.address.lastName : "") + " " + (order.address.firstName ? order.address.firstName : "")}</Table.Cell>
                        <Table.Cell style={{ color: 'black' }}>{order.payment.vs} <b>|</b> {moment(order.payment.orderDate).format("DD.MM")} <b>|</b> <b>{order.totalPrice} Kč</b></Table.Cell>
                        <Table.Cell>
                            <Button onClick={(order) => this.openOrderDetails(order)} style={{ padding: '0.3em' }} size='medium' icon='edit' />
                            <Button style={{ padding: '0.3em' }} size='medium' icon='check' />
                            <Button style={{ padding: '0.3em' }} size='medium' icon='file pdf' />
                            <Button style={{ padding: '0.3em' }} size='medium' icon='shipping fast' />
                            <Button style={{ padding: '0.3em' }} size='medium' icon='close' />
                        </Table.Cell>
                    </Table.Row>
                )
            }
            else {
                counter++;
                return (
                    {
                        counter: counter,
                        fullName: (order.address.lastName ? order.address.lastName : "") + " " + (order.address.firstName ? order.address.firstName : ""),
                        vs: order.payment.vs,
                        date: moment(order.payment.orderDate).format("DD.MM"),
                        totalPrice: order.totalPrice,
                        note: order.note,
                        fullOrder: order
                    }
                )
            }
        })

        var table;

        if (this.props.isMobile) {
            table = (
                <Table compact basic='very'>
                    <Table.Header>
                        <Table.Row style={{ textAlign: 'center' }}>
                            <Table.HeaderCell width={2}>Name</Table.HeaderCell>
                            <Table.HeaderCell width={1}>VS | Order Date | Price</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {mappedOrders}
                    </Table.Body>
                </Table>
            )
        }
        else {
            table = (
                <ReactTable

                    data={mappedOrders}
                    columns={[
                        {
                            columns: [
                                {
                                    width: 45,
                                    expander: true,
                                    accessor: "counter",
                                    Header: "",
                                    width: 65,

                                    Expander: ({ isExpanded, ...rest }) =>
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            textAlign: 'center'
                                        }}>
                                            {
                                                isExpanded
                                                    ? <Button id="buttonIconPadding" size='medium' icon='compress' />
                                                    : <Button id="buttonIconPadding" size='medium' icon='expand' />
                                            }

                                        </div>,
                                },
                                {
                                    width: 170,
                                    filterable: showColumnFilters,
                                    Header: () =>
                                        <div>
                                            <strong>Name</strong>
                                        </div>,
                                    accessor: "fullName"
                                }
                                ,
                                {
                                    width: 70,
                                    filterable: showColumnFilters,
                                    accessor: "vs",
                                    Header: () => <strong>VS</strong>,
                                    Cell: (row) => (
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        >
                                            <strong>{row.original.vs}</strong>
                                        </div>
                                    )
                                },
                                {
                                    filterable: showColumnFilters,
                                    width: 90,
                                    accessor: "date",
                                    Header: () => <strong>Order Date</strong>,
                                    Cell: (row) => (
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        >
                                            {row.original.date}
                                        </div>
                                    )
                                },
                                {
                                    filterable: showColumnFilters,
                                    width: 90,
                                    accessor: "totalPrice",
                                    Header: () => <strong>Price [CZK]</strong>,
                                    Cell: (row) => (
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        >
                                            <strong>{row.original.totalPrice + " Kč"}</strong>
                                        </div>
                                    )
                                },
                                {
                                    filterable: showColumnFilters,
                                    Header: () => <strong>Notes</strong>,
                                    accessor: "note"
                                },
                                {
                                    maxWidth: 165,
                                    Header: () => <strong>Actions</strong>,
                                    Cell: row => (
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <Button id="buttonIconPadding" size='medium' icon='edit' />
                                            <Button id="buttonIconPadding" size='medium' icon='check' />
                                            <Button id="buttonIconPadding" size='medium' icon='file pdf' />
                                            <Button id="buttonIconPadding" size='medium' icon='shipping fast' />
                                            <Button id="buttonIconPadding" size='medium' icon='close' />
                                        </div>
                                    ),
                                }
                            ]
                        }
                    ]}
                    minRows={0}
                    sortable={false}
                    getTrProps={(state, rowInfo, column) => {
                        return {
                            style: {
                                background: this.getBackgroundColor(rowInfo)
                            }
                        };
                    }}

                    getTheadGroupThProps={() => {
                        return {
                            style: { display: 'none' } // override style for 'myHeaderTitle'.
                        }
                    }}
                    pageSize={ordersLimit}
                    expanded={this.state.expanded}
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: () => {
                                this.expandRow(rowInfo);
                            }
                        };
                    }}
                    showPagination={false}
                    SubComponent={() => <div style={{ padding: '10px' }}>Hello</div>}
                />
            )
        }

        var grid;
        if (this.props.isMobile) {
            grid = (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Orders
                                <Button toggle onClick={() => this.setState({ mobileShowHeader: !this.state.mobileShowHeader })} floated='right' style={{ backgroundColor: this.state.mobileShowHeader ? '#f2005696' : '#f20056', color: 'white' }} content={this.state.mobileShowHeader ? 'Hide' : 'Show'} />
                            </Header>
                        </Grid.Column>

                    </Grid.Row>
                    {this.state.mobileShowHeader ? (
                        <Grid.Row>
                            <Grid.Column>
                                <Button fluid size='small' content='Add Order' id="primaryButton" />
                                <Button style={{ marginTop: '0.5em' }} fluid size='small' compact content='Print Labels' />
                            </Grid.Column>
                            <Grid.Column>
                                <Message fluid style={{ textAlign: 'center' }} warning>warning paceholder</Message>
                            </Grid.Column>
                            <Grid.Column textAlign='right' floated='right'>
                                <Button size="medium" id="primaryButton" icon='search' />
                            </Grid.Column>
                        </Grid.Row>
                    ) : (
                            <div></div>
                        )}
                </Grid>
            )
        }
        else {
            grid = (
                <Grid>
                    <Grid.Row columns={5} style={{ marginBottom: '1em' }}>
                        <Grid.Column width={2}>
                            <Header as='h1' content='Orders' />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button fluid size='medium' compact content='Add Order' id="primaryButton" />
                            <Button style={{ marginTop: '0.5em' }} id="secondaryButton" fluid size='small' compact content='Print Labels' />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Message style={{ textAlign: 'center' }} warning>warning paceholder</Message>
                        </Grid.Column>
                        <Grid.Column width={3} textAlign='right' floated='right'>
                            <Input name="multisearch" icon='search' placeholder='Search...' />
                            <Button
                                fluid
                                size="small"
                                onClick={() => this.handleToggleColumnFilters()}
                                compact
                                content={showColumnFilters ? 'Hide Column Filters' : 'Show Column Filters'}
                                style={{ padding: '0.3em', marginTop: '0.5em' }}
                                id="secondaryButton"
                                icon={showColumnFilters ? 'eye slash' : 'eye'}
                                labelPosition='left' />
                            <Button
                                fluid
                                size="small"
                                onClick={() => this.handleToggleShowPaidOrders()}
                                compact
                                content={showPaidOrders ? 'Hide Paid Orders' : 'Show Paid Orders'}
                                style={{ padding: '0.3em', marginTop: '0.5em' }}
                                id="secondaryButton"
                                icon={showPaidOrders ? 'eye slash' : 'eye'}
                                labelPosition='left' />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }

        return (
            <div>
                {
                    this.props.ordersPageStore.orders.length > 0 ? (
                        <div>
                            {grid}
                            {table}
                            <Button onClick={() => this.loadMoreOrders()} style={{ marginTop: '0.5em' }} fluid>Show More</Button>
                        </div>
                    ) : (
                            <div className="centered">
                                <Image src={Spinner} />
                            </div>
                        )
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        ordersPageStore: state.OrdersReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getOrdersAction,
        openOrderDetailsAction,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);