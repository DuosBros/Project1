import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, Table, Message, Image, Icon, Input, Tab } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import ReactTable from "react-table";

import { getCurrentYearOrders } from '../../utils/requests';
import { getOrdersAction, openOrderDetailsAction } from '../../utils/actions';

import { errorColor, successColor, warningColor, notActiveColor, GET_ORDERS_LIMIT } from '../../appConfig'
import SimpleTable from '../../components/SimpleTable';
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
            ordersLimit: GET_ORDERS_LIMIT,
            orderIdsShowingDetails: []
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

        if (_.isEmpty(order.original.fullOrder)) {
            return {}
        }
        if (order.original.fullOrder.payment.paid) {
            backgroundColor = successColor
        }
        else if (!_.isEmpty(order.original.fullOrder.zaslatDate) && !order.original.fullOrder.payment.paid) {
            backgroundColor = warningColor
        }
        else if (_.isEmpty(order.original.fullOrder.zaslatDate) && order.original.fullOrder.state === "active") {
            backgroundColor = errorColor
        }
        else {
            backgroundColor = notActiveColor
        }


        return backgroundColor
    }

    handleToggleColumnFilters = () => {
        this.setState({ showColumnFilters: !this.state.showColumnFilters });
    }

    handleToggleShowPaidOrders = () => {
        if (this.state.showPaidOrders) {
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

                if (this.state.showPaidOrders) {
                    this.setState({ filteredOrders: [] });
                }
                else {
                    var filteredOrders = this.props.ordersPageStore.orders.filter(order => {
                        return !order.payment.paid
                    })
                    this.setState({ filteredOrders: filteredOrders });

                }
            })
    }

    toggleInlineOrderDetails = (orderId) => {
        if (this.state.orderIdsShowingDetails.indexOf(orderId) > -1) {
            this.setState({
                orderIdsShowingDetails: this.state.orderIdsShowingDetails.filter(id => {
                    return id !== orderId
                })
            });
        }
        else {
            this.setState(prevState => ({
                orderIdsShowingDetails: [...prevState.orderIdsShowingDetails, orderId]
            }))
        }

    }
    render() {
        console.log(this.props.ordersPageStore.orders)
        var { showColumnFilters, filteredOrders, showPaidOrders, ordersLimit } = this.state;
        var counter = 0;
        var sortedOrders;

        if (filteredOrders.length > 0) {
            sortedOrders = _.orderBy(filteredOrders, ['payment.orderDate'], ['desc']);
        }
        else {
            sortedOrders = _.orderBy(this.props.ordersPageStore.orders, ['payment.orderDate'], ['desc']);
        }
        var mappedOrders = [];
        mappedOrders = sortedOrders.map(order => {


            if (this.props.isMobile) {
                var orderInlineDetails = (
                    this.state.orderIdsShowingDetails.indexOf(order._id) > -1 ? (
                        <Table.Cell style={{ color: 'black' }}>
                            <Grid>
                                <Grid.Row style={{ padding: '1em' }}>
                                    <Grid.Column width={4}>
                                        <Header as='h4'>
                                            Customer info
                                </Header>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <Header as='h4'>
                                            Order info
                                </Header>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={4}>
                                        <b>First name:</b> {order.address.firstName} <br />
                                        <b>Last name:</b> {order.address.lastName} <br />
                                        <b>Phone:</b> {order.address.phone} <br />
                                        <b>Company:</b> {order.address.company} <br />
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <b>Street:</b> {order.address.street} <br />
                                        <b>City:</b> {order.address.city} <br />
                                        <b>Street number:</b> {order.address.streetNumber} <br />
                                        <b>ZIP:</b> {order.address.psc} <br />
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <SimpleTable columnProperties={
                                            [
                                                {
                                                    name: "Name",
                                                    width: 4,
                                                },
                                                {
                                                    name: "Count | Price per One",
                                                    width: 4,
                                                },
                                                {
                                                    name: "Total product price",
                                                    width: 4,
                                                }
                                            ]
                                        } body={order.products.map((product, index) => {
                                            return (
                                                <Table.Row key={index}>
                                                    <Table.Cell >{product.productName}</Table.Cell>
                                                    <Table.Cell >{product.count} | {product.pricePerOne}</Table.Cell>
                                                    <Table.Cell>{product.totalPricePerProduct}</Table.Cell>
                                                </Table.Row>
                                            )
                                        })} />
                                        <Grid.Column>
                                            <b>Delivery price:</b> {order.payment.price} <br />
                                            <b>Bank account payment:</b> {order.payment.cashOnDelivery ? "yes" : "no"} <br />
                                            <b>Delivery:</b> {order.deliveryCompany ? order.deliveryType + " + " + order.deliveryCompany : order.deliveryType} <br />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <b>Total Price:</b> {order.totalPrice} <br />
                                        </Grid.Column>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Table.Cell>
                    ) : (
                            <Table.Cell style={{ padding: '0px', borderBottom: '0px' }}></Table.Cell>
                        )
                )

                return (
                    <Table.Row onClick={() => { this.toggleInlineOrderDetails(order._id) }} key={order._id}
                        positive={order.payment.paid} negative={_.isEmpty(order.zaslatDate)} warning={!_.isEmpty(order.zaslatDate) && !order.payment.paid} textAlign='center'>
                        <Table.Cell style={{ color: 'black' }}>{(order.address.lastName ? order.address.lastName : "") + " " + (order.address.firstName ? order.address.firstName : "")}</Table.Cell>
                        <Table.Cell style={{ color: 'black' }}>{order.payment.vs} <b>|</b> {moment(order.payment.orderDate).format("DD.MM")} <b>|</b> <b>{order.totalPrice} Kč</b></Table.Cell>
                        <Table.Cell>
                            <Button onClick={(order) => this.openOrderDetails(order)} style={{ padding: '0.3em' }} size='medium' icon='edit' />
                            <Button style={{ padding: '0.3em' }} size='medium' icon='check' />
                            <Button style={{ padding: '0.3em' }} size='medium' icon='file pdf' />
                            <Button style={{ padding: '0.3em' }} size='medium' icon='shipping fast' />
                            <Button style={{ padding: '0.3em' }} size='medium' icon='close' />
                        </Table.Cell>
                        {orderInlineDetails}
                    </Table.Row>
                )

            }
            else {
                var orderInlineDetails = (
                    this.state.orderIdsShowingDetails.indexOf(order._id) > -1 ? (
                        <Table.Row style={{ color: 'black' }}>
                            <Table.Cell colSpan={9}>
                                <Grid>
                                    <Grid.Row style={{ padding: '1em' }}>
                                        <Grid.Column width={4}>
                                            <Header as='h4'>
                                                Customer info
                                </Header>
                                        </Grid.Column>
                                        <Grid.Column width={4}>
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <Header as='h4'>
                                                Order info
                                </Header>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width={4}>
                                            <b>First name:</b> {order.address.firstName} <br />
                                            <b>Last name:</b> {order.address.lastName} <br />
                                            <b>Phone:</b> {order.address.phone} <br />
                                            <b>Company:</b> {order.address.company} <br />
                                        </Grid.Column>
                                        <Grid.Column width={4}>
                                            <b>Street:</b> {order.address.street} <br />
                                            <b>City:</b> {order.address.city} <br />
                                            <b>Street number:</b> {order.address.streetNumber} <br />
                                            <b>ZIP:</b> {order.address.psc} <br />
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <SimpleTable columnProperties={
                                                [
                                                    {
                                                        name: "Name",
                                                        width: 4,
                                                    },
                                                    {
                                                        name: "Count",
                                                        width: 4,
                                                    },
                                                    {
                                                        name: "Price per One",
                                                        width: 4,
                                                    },
                                                    {
                                                        name: "Total product price",
                                                        width: 4,
                                                    }
                                                ]
                                            } body={order.products.map((product, index) => {
                                                return (
                                                    <Table.Row key={index}>
                                                        <Table.Cell >{product.productName}</Table.Cell>
                                                        <Table.Cell >{product.count}</Table.Cell>
                                                        <Table.Cell >{product.pricePerOne}</Table.Cell>
                                                        <Table.Cell>{product.totalPricePerProduct}</Table.Cell>
                                                    </Table.Row>
                                                )
                                            })} />
                                            <Grid.Row style={{ padding: '0px', borderBottom: '0px' }}>
                                                <Grid.Column width={8}>
                                                </Grid.Column>
                                                <Grid.Column width={4}>
                                                    <b>Delivery price:</b> {order.payment.price} <br />
                                                    <b>Bank account payment:</b> {order.payment.cashOnDelivery ? "yes" : "no"} <br />
                                                    <b>Delivery:</b> {order.deliveryCompany ? order.deliveryType + " + " + order.deliveryCompany : order.deliveryType} <br />
                                                </Grid.Column>
                                                <Grid.Column width={4}>
                                                    <b>Total Price:</b> {order.totalPrice} <br />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Table.Cell>
                            {/* <Table.Cell>
                                </Table.Cell> */}
                        </Table.Row>
                    ) : (
                            <Table.Row >
                                <Table.Cell style={{ padding: '0px', borderBottom: '0px' }} colSpan={9}>
                                </Table.Cell>
                                {/* <Table.Cell>
                                </Table.Cell> */}
                            </Table.Row>
                        )
                )
                counter++;
                return (
                    <React.Fragment>
                        <Table.Row
                            onClick={() => { this.toggleInlineOrderDetails(order._id) }}
                            negative={_.isEmpty(order.zaslatDate)}
                            warning={!_.isEmpty(order.zaslatDate) && !order.payment.paid}
                            positive={order.payment.paid}
                            textAlign='center'
                            key={order._id}>
                            <Table.Cell style={{ color: 'black' }}>{counter}</Table.Cell>
                            <Table.Cell style={{ color: 'black' }}>{order.address.lastName + " " + order.address.firstName}</Table.Cell>
                            <Table.Cell style={{ color: 'black' }}>{order.payment.vs}</Table.Cell>
                            <Table.Cell style={{ color: 'black' }}>{moment(order.payment.orderDate).format("DD.MM")}</Table.Cell>
                            <Table.Cell style={{ color: 'black' }}><b>{order.totalPrice} Kč</b></Table.Cell>
                            <Table.Cell style={{ color: 'black' }}>{order.note}</Table.Cell>
                            <Table.Cell>
                                <Button style={{ padding: '0.3em' }} size='medium' icon='edit' />
                                <Button style={{ padding: '0.3em' }} size='medium' icon='check' />
                                <Button style={{ padding: '0.3em' }} size='medium' icon='file pdf' />
                                <Button style={{ padding: '0.3em' }} size='medium' icon='shipping fast' />
                                <Button style={{ padding: '0.3em' }} size='medium' icon='close' />
                            </Table.Cell>
                        </Table.Row>
                        {orderInlineDetails}
                    </React.Fragment>

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
                <Table compact padded selectable basic='very'>
                    <Table.Header>
                        <Table.Row style={{ textAlign: 'center' }}>
                            <Table.HeaderCell width={1}>#</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Name</Table.HeaderCell>
                            <Table.HeaderCell width={1}>VS</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Order Date</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Price</Table.HeaderCell>
                            <Table.HeaderCell width={4}>Notes</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {mappedOrders}
                    </Table.Body>
                </Table>
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
                                <Message fluid={true} style={{ textAlign: 'center' }} warning>warning paceholder</Message>
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
                        <Grid.Column width={3} textAlign='left' floated='right'>
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