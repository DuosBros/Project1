import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, Table, Message, Image, Icon, Input, Tab, Transition } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { getCurrentYearOrders, getWarehouseNotifications, getNotPaidNotificationsNotifications } from '../../utils/requests';
import {
    getOrdersAction, openOrderDetailsAction, getNotPaidNotificationsAction, getWarehouseNotificationsAction,
    isGetWarehouseNotificationsAction, isGetNotPaidNotificationsAction, getMoreOrdersAction
} from '../../utils/actions';

import { errorColor, successColor, warningColor, notActiveColor, GET_ORDERS_LIMIT } from '../../appConfig'
import SimpleTable from '../../components/SimpleTable';
import Spinner from '../../assets/Spinner.svg'
import { filterInArrayOfObjects, debounce } from '../../utils/helpers';
import logo from '../../assets/logo.png';

class Orders extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            multiSearchInput: "",
            multiSearchInputValue: "",
            mobileShowHeader: false,
            expanded: null,
            filteredOrders: [],
            showPaidOrders: true,
            ordersLimit: GET_ORDERS_LIMIT,
            orderIdsShowingDetails: [],
            showFilterInput: false,
            notPaidNotificationsDone: false,
            warehouseNotificationsDone: false,
            orderLabelsToPrint: [],
            showPrintLabelsIcon: false,
            showMultiSearchFilter: false,
            ordersLimit: GET_ORDERS_LIMIT
        }

        this.updateFilters = debounce(this.updateFilters, 400);

        if (this.state.showMultiSearchFilter === false) {
            getCurrentYearOrders(GET_ORDERS_LIMIT, null)
                .then(res => {
                    this.props.getOrdersAction(res.data)
                })
        }

        this.props.isGetNotPaidNotificationsAction(false)
        getNotPaidNotificationsNotifications()
            .then(res => {
                this.props.getNotPaidNotificationsAction(res.data)
                this.props.isGetNotPaidNotificationsAction(true)
            })

        this.props.isGetWarehouseNotificationsAction(false)
        getWarehouseNotifications()
            .then(res => {
                this.props.getWarehouseNotificationsAction(res.data)
                this.props.isGetWarehouseNotificationsAction(true)
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

        if (order.payment.paid) {
            backgroundColor = successColor
        }
        else if (!_.isEmpty(order.zaslatDate) && !order.payment.paid) {
            backgroundColor = warningColor
        }
        else if (_.isEmpty(order.zaslatDate) && order.state === "active") {
            backgroundColor = errorColor
        }
        else {
            backgroundColor = notActiveColor
        }

        return backgroundColor
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

        var sinceId = this.props.ordersPageStore.orders[this.props.ordersPageStore.orders.length - 1].id
        getCurrentYearOrders(currentLimit, sinceId)
            .then(res => {
                this.props.getMoreOrdersAction(res.data)

                if (this.state.showPaidOrders) {
                    this.setState({ filteredOrders: [], ordersLimit: currentLimit });
                }
                else {
                    var filteredOrders = this.props.ordersPageStore.orders.filter(order => {
                        return !order.payment.paid
                    })
                    this.setState({ filteredOrders: filteredOrders, ordersLimit: currentLimit });

                }
            })
    }

    toggleInlineOrderDetails(orderId, e) {
        e.preventDefault();

        if (e.target.className === "") {
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
    }

    togglePrintLabelIcon(orderId, e) {


        if (this.state.orderLabelsToPrint.indexOf(orderId) > -1) {
            this.setState({
                orderLabelsToPrint: this.state.orderLabelsToPrint.filter(id => {
                    return id !== orderId
                })
            });
        }
        else {
            this.setState(prevState => ({
                orderLabelsToPrint: [...prevState.orderLabelsToPrint, orderId]
            }))
        }
    }

    handleChange = (e, { name, value }) => {
        if (value) {
            this.setState({ multiSearchInputValue: value });
            this.updateFilters(value);
        }
        else {
            this.setState({ multiSearchInputValue: "" });
            this.updateFilters("");
        }
    }

    updateFilters = (value) => {
        this.setState({ multiSearchInput: value });
    }

    handleNotPaidVs = (vs) => {
        this.setState({ multiSearchInputValue: vs });
        this.showFilter()
        // this.inputRef.focus()
        this.updateFilters(vs);
    }

    // handleRef = (c) => {
    //     this.inputRef = c
    // }

    showFilter = () => {
        this.setState({ showMultiSearchFilter: !this.state.showMultiSearchFilter })

        getCurrentYearOrders(null, null)
            .then(res => {
                this.props.getOrdersAction(res.data)
            })


    }

    render() {
        console.log(this.props.ordersPageStore.orders)
        var { filteredOrders, showPaidOrders, multiSearchInput, showPrintLabelsIcon, orderLabelsToPrint } = this.state;
        console.log(this.state.ordersLimit)
        var counter = 0;
        var sortedOrders;
        var filteredByMultiSearch;

        if (filteredOrders.length > 0) {

            sortedOrders = _.orderBy(filteredOrders.slice(0, this.state.ordersLimit), ['payment.orderDate'], ['desc']);
        }
        else {
            sortedOrders = _.orderBy(this.props.ordersPageStore.orders.slice(0, this.state.ordersLimit), ['payment.orderDate'], ['desc']);
        }

        if (multiSearchInput !== "" && multiSearchInput.length > 1) {
            var mappedOrders = _.orderBy(this.props.ordersPageStore.orders, ['payment.orderDate'], ['desc']).map(order => {
                var products = order.products.map(product => {
                    return (product.productName)
                }).join(" ")

                return (
                    {
                        original: order,
                        fullName: order.address.firstName + " " + order.address.lastName,
                        fullNameReversed: order.address.lastName + " " + order.address.firstName,
                        phone: order.address.phone,
                        street: order.address.street,
                        vs: order.payment.vs,
                        totalPrice: order.totalPrice,
                        products: products
                    }
                )
            })

            filteredByMultiSearch = filterInArrayOfObjects(multiSearchInput, mappedOrders).map(order => order.original)
        }
        else {
            filteredByMultiSearch = sortedOrders
        }

        var mappedOrders = [];
        mappedOrders = filteredByMultiSearch.map(order => {
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
                    <Table.Row onClick={(e) => { this.toggleInlineOrderDetails(e, order._id) }} key={order._id} style={{ backgroundColor: this.getBackgroundColor(order) }}
                        textAlign='center'>
                        <Table.Cell style={{ color: 'black' }}>{(order.address.lastName ? order.address.lastName : "") + " " + (order.address.firstName ? order.address.firstName : "")}</Table.Cell>
                        <Table.Cell style={{ color: 'black' }}>{order.payment.vs} <b>|</b> {moment(order.payment.orderDate).format("DD.MM")} <b>|</b> <b>{order.totalPrice} Kč</b></Table.Cell>
                        <Table.Cell>
                            <Button onClick={(order) => this.openOrderDetails(order)} style={{ padding: '0.3em' }} size='medium' icon='edit' />
                            <Button style={{ padding: '0.3em' }} size='medium' icon='check' />
                            <Button style={{ padding: '0.3em' }} size='medium' icon='file pdf' />
                            {order.payment.paid ? (
                                null
                            ) : (
                                    <>
                                        <Button style={{ padding: '0.3em' }} size='medium' icon='shipping fast' />
                                        <Button style={{ padding: '0.3em' }} size='medium' color='red' icon='close' />
                                    </>
                                )}
                            {
                                this.state.showPrintLabelsIcon ? (
                                    <Button onClick={() => { this.togglePrintLabelIcon(order.id) }} style={{ padding: '0.3em' }} size='medium'>
                                        <Icon.Group>
                                            <Icon name='barcode' />
                                            {
                                                orderLabelsToPrint.indexOf(order.id) > -1 ? (<Icon color="red" name='minus' />) : (<Icon color="green" name='add' />)
                                            }
                                        </Icon.Group>
                                    </Button>
                                ) : (
                                        null
                                    )
                            }
                        </Table.Cell>
                        {orderInlineDetails}
                    </Table.Row>
                )

            }
            else {
                var orderInlineDetails = (
                    this.state.orderIdsShowingDetails.indexOf(order._id) > -1 ? (
                        <Table.Row
                            style={{ backgroundColor: this.getBackgroundColor(order) }}>
                            <Table.Cell colSpan={9}>
                                <Grid style={{ marginTop: '1.5em', marginBottom: '2em', paddingLeft: '1em', paddingRight: '1em', color: 'black' }}>
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
                                            <Grid>
                                                <Grid.Row columns='equal' style={{ padding: '0px', borderBottom: '0px' }}>
                                                    {/* <Grid.Column width={8}>
                                                </Grid.Column> */}
                                                    <Grid.Column>
                                                        <b>Delivery price:</b> {order.payment.price} <br />
                                                        <b>Bank account payment:</b> {order.payment.cashOnDelivery ? "yes" : "no"} <br />
                                                        <b>Delivery:</b> {order.deliveryCompany ? order.deliveryType + " + " + order.deliveryCompany : order.deliveryType} <br />
                                                    </Grid.Column>
                                                    <Grid.Column>
                                                        <b>Total Price:</b> {order.totalPrice} <br />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Table.Cell>
                        </Table.Row>
                    ) : (
                            <Table.Row >
                                <Table.Cell style={{ padding: '0px', borderBottom: '0px' }} colSpan={9}>
                                </Table.Cell>
                            </Table.Row>
                        )
                )
                counter++;
                return (
                    <React.Fragment key={order._id}>
                        <Table.Row
                            onClick={this.toggleInlineOrderDetails.bind(this, order._id)}
                            style={{ backgroundColor: this.getBackgroundColor(order) }}
                            textAlign='center'
                            key={order._id}>
                            <Table.Cell style={{ color: 'black' }}>{counter}</Table.Cell>
                            <Table.Cell style={{ color: 'black' }}>{order.address.lastName + " " + order.address.firstName}</Table.Cell>
                            <Table.Cell style={{ color: 'black' }}>{order.payment.vs}</Table.Cell>
                            <Table.Cell style={{ color: 'black' }}>{moment(order.payment.orderDate).format("DD.MM")}</Table.Cell>
                            <Table.Cell style={{ color: 'black' }}><b>{order.totalPrice} Kč</b></Table.Cell>
                            <Table.Cell style={{ color: 'black' }}>{order.note}</Table.Cell>
                            <Table.Cell>
                                {
                                    moment().add(-30, 'days').isAfter(order.payment.paymentDate) ? (
                                        null
                                    ) : (
                                            <>
                                                <Button style={{ padding: '0.3em' }} size='medium' icon='edit' />
                                                <Button style={{ padding: '0.3em' }} size='medium' icon={
                                                    <>
                                                        <Icon name='dollar' />
                                                        {
                                                            order.payment.paid ? (<Icon color="red" corner name='minus' />) : (<Icon color="green" corner name='add' />)
                                                        }
                                                    </>
                                                } />
                                            </>
                                        )
                                }

                                <Button style={{ padding: '0.3em' }} size='medium' icon='file pdf' />
                                {
                                    order.payment.paid ? (
                                        null
                                    ) : (
                                            <>
                                                <Button style={{ padding: '0.3em' }} size='medium' icon='shipping fast' />
                                                <Button style={{ padding: '0.3em' }} size='medium' icon={<Icon name='close' color='red' />} />
                                            </>
                                        )
                                }
                                {
                                    this.state.showPrintLabelsIcon ? (
                                        <Button onClick={this.togglePrintLabelIcon.bind(this, order.id)} style={{ padding: '0.3em' }} size='medium'
                                            icon={
                                                <>
                                                    <Icon name='barcode' />
                                                    {
                                                        orderLabelsToPrint.indexOf(order.id) > -1 ? (<Icon color="red" corner name='minus' />) : (<Icon color="green" corner name='add' />)
                                                    }
                                                </>
                                            } >
                                        </Button>
                                    ) : (
                                            null
                                        )
                                }
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

        var notPaidNotificationsMessage, warehouseNotificationsMessage;

        if (this.props.ordersPageStore.isWarehouseNotificationsDone) {
            if (this.props.ordersPageStore.warehouseNotifications.length > 0) {
                var message = this.props.ordersPageStore.warehouseNotifications.map(notification => {
                    return (
                        <React.Fragment key={notification.product}>
                            <strong>{notification.product}: </strong> {notification.current} <br />
                        </React.Fragment>
                    )
                })

                warehouseNotificationsMessage = (
                    <Message style={{ textAlign: 'center' }} warning>Some of the products are below treshold:<br />{message}
                        <Link to="/warehouse">Go to Warehouse</Link></Message>
                )
            }
        }
        else {
            warehouseNotificationsMessage = (
                <Message warning icon>
                    <Icon name='circle notched' loading />
                    <Message.Content>
                        <Message.Header>Checking what's wrong in warehouse</Message.Header>
                    </Message.Content>
                </Message>
            )
        }

        if (this.props.ordersPageStore.isNotPaidNotificationsDone) {
            if (this.props.ordersPageStore.notPaidNotifications.length > 0) {
                var VSs = this.props.ordersPageStore.notPaidNotifications.map(notification => {
                    return (
                        <span key={notification.vs} onClick={() => this.handleNotPaidVs(notification.vs.toString())} style={{ padding: '0.2em', cursor: "pointer" }}>
                            <strong>
                                {notification.vs} <br />
                            </strong>
                        </span>
                    )
                })

                if (this.props.ordersPageStore.notPaidNotifications.length > 1) {
                    notPaidNotificationsMessage = (
                        <Message style={{ textAlign: 'center' }} warning>Orders are delivered but not paid: <br />{VSs}</Message>
                    )
                }
                else {
                    notPaidNotificationsMessage = (
                        <Message style={{ textAlign: 'center' }} warning>
                            Order is delivered but not paid: <br />
                            <strong>{VSs}</strong>
                        </Message>
                    )
                }
            }
        }
        else {
            notPaidNotificationsMessage = (
                <Message warning icon>
                    <Icon name='circle notched' loading />
                    <Message.Content>
                        <Message.Header>Findind not paid orders</Message.Header>
                    </Message.Content>
                </Message>
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
                    <Transition.Group animation='drop' duration={500}>
                        {this.state.mobileShowHeader && (
                            <Grid.Row>
                                <Grid.Column style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                                    <Button fluid size='small' content='Add Order' id="primaryButton" />
                                    <Button onClick={() => this.setState({ showPrintLabelsIcon: !this.state.showPrintLabelsIcon })} style={{ marginTop: '0.5em' }} fluid size='small' compact content={this.state.orderLabelsToPrint.length > 0 ? ("Print labels " + "(" + this.state.orderLabelsToPrint.length + ")") : "Print labels"} />
                                </Grid.Column>
                                <Grid.Column style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                                    {warehouseNotificationsMessage}
                                </Grid.Column>
                                <Grid.Column style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                                    {notPaidNotificationsMessage}
                                </Grid.Column>
                                <Grid.Column>
                                    {/* ref={this.handleRef}  */}
                                    <Input fluid focus name="multiSearchInput" placeholder='Search...' onChange={this.handleChange} value={this.state.multiSearchInputValue} />
                                    {
                                        this.state.multiSearchInputValue === "" ? (
                                            null
                                        ) : (
                                                <Button onClick={() => this.handleChange({}, {})} style={{ padding: '0.3em', marginLeft: '0.5em' }} icon="delete" />
                                            )
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        )}
                    </Transition.Group>
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
                            <Button
                                onClick={() => this.setState({ showPrintLabelsIcon: !this.state.showPrintLabelsIcon })}
                                style={{ marginTop: '0.5em' }} id={this.state.orderLabelsToPrint.length > 0 ? null : "secondaryButton"} fluid size='small'
                                compact content={this.state.orderLabelsToPrint.length > 0 ? ("Print labels " + "(" + this.state.orderLabelsToPrint.length + ")") : "Print labels"}
                                color={this.state.orderLabelsToPrint.length > 0 ? "green" : null}
                            />
                        </Grid.Column>
                        <Grid.Column width={5}>
                            {warehouseNotificationsMessage}
                        </Grid.Column>
                        <Grid.Column width={4}>
                            {notPaidNotificationsMessage}
                        </Grid.Column>
                        <Grid.Column width={3} textAlign='left' floated='right'>
                            <Transition animation='drop' duration={500} visible={this.state.showMultiSearchFilter}>
                                <Input
                                    style={{ minWidth: '100px' }}
                                    ref={this.handleRef}
                                    fluid
                                    name="multiSearchInput"
                                    icon={
                                        <Icon
                                            name={this.state.multiSearchInputValue === "" ? 'search' : 'delete'}
                                            style={{ backgroundColor: '#f20056', color: 'white' }}
                                            circular
                                            link
                                            onClick={this.state.multiSearchInputValue === "" ? () => { } : () => this.handleChange({}, {})} />
                                    }
                                    placeholder='Search...'
                                    onChange={this.handleChange}
                                    value={this.state.multiSearchInputValue} />
                            </Transition>
                            {
                                this.state.showMultiSearchFilter ? (
                                    null
                                ) : (
                                        <div style={{ textAlign: 'right' }}>
                                            <Icon
                                                name='search'
                                                style={{ backgroundColor: '#f20056', color: 'white' }}
                                                circular
                                                link
                                                onClick={this.showFilter} />
                                        </div>

                                    )
                            }


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
                    this.props.ordersPageStore.orders.length > 0 && !_.isEmpty(grid) && !_.isEmpty(table) ? (
                        <div>
                            {grid}
                            {table}
                            <Button onClick={() => this.loadMoreOrders()} style={{ marginTop: '0.5em' }} fluid>Show More</Button>
                        </div>
                    ) : (
                            <div className="centered">
                                <Message positive icon>
                                    <Icon name='circle notched' loading />
                                    <Message.Content>
                                        <Message.Header>

                                            Loading orders
                                            <Image inline size='tiny' src={logo} />
                                        </Message.Header>

                                    </Message.Content>
                                </Message>
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
        getNotPaidNotificationsAction,
        getWarehouseNotificationsAction,
        isGetWarehouseNotificationsAction,
        isGetNotPaidNotificationsAction,
        getMoreOrdersAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);