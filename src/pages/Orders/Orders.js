import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, Table, Message } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';

import { getCurrentYearOrders } from '../../utils/requests';
import { getOrdersAction, openOrderDetailsAction } from '../../utils/actions';

class Orders extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mobileShowHeader: false
        }

        getCurrentYearOrders()
            .then(res => {
                this.props.getOrdersAction(res.data)
            })
    }

    openOrderDetails = (order) => {
        this.props.openOrderDetailsAction(order);
    }
    render() {
        console.log(this.props.ordersPageStore.orders)

        var counter = 0;
        var sortedOrders = _.orderBy(this.props.ordersPageStore.orders, ['payment.orderDate'], ['desc']);
        var mappedOrders = sortedOrders.map(order => {

            if (this.props.isMobile) {
                return (
                    <Table.Row negative={_.isEmpty(order.zaslatDate)} warning={!_.isEmpty(order.zaslatDate) && !order.payment.paid} positive={order.payment.paid} textAlign='center' key={order._id}>
                        <Table.Cell style={{ color: 'black' }}>{(order.address.lastName ? order.address.lastName : "") + " " + (order.address.firstName ? order.address.firstName : "")}</Table.Cell>
                        <Table.Cell style={{ color: 'black' }}>{order.payment.vs} <b>|</b> {moment(order.payment.orderDate).format("DD.MM")} <b>|</b> <b>{order.totalPrice} Kč</b></Table.Cell>
                        <Table.Cell>
                            <Button onClick={this.openOrderDetails(order)} style={{ padding: '0.3em' }} size='medium' icon='edit' />
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
                    <Table.Row negative={_.isEmpty(order.zaslatDate)} warning={!_.isEmpty(order.zaslatDate) && !order.payment.paid} positive={order.payment.paid} textAlign='center' key={order._id}>
                        <Table.Cell style={{ color: 'black' }}>{counter}</Table.Cell>
                        <Table.Cell style={{ color: 'black' }}>{(order.address.lastName ? order.address.lastName : "") + " " + (order.address.firstName ? order.address.firstName : "")}</Table.Cell>
                        <Table.Cell style={{ color: 'black' }}>{order.payment.vs}</Table.Cell>
                        <Table.Cell style={{ color: 'black' }}>{moment(order.payment.orderDate).format("DD.MM")}</Table.Cell>
                        <Table.Cell style={{ color: 'black' }}><b>{order.totalPrice} Kč</b></Table.Cell>
                        <Table.Cell style={{ color: 'black' }}>{order.note}</Table.Cell>
                        <Table.Cell>
                            <Button id="buttonIconPadding" size='medium' icon='edit' />
                            <Button id="buttonIconPadding" size='medium' icon='check' />
                            <Button id="buttonIconPadding" size='medium' icon='file pdf' />
                            <Button id="buttonIconPadding" size='medium' icon='shipping fast' />
                            <Button id="buttonIconPadding" size='medium' icon='close' />
                        </Table.Cell>
                    </Table.Row>
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
                                <Button fluid size='small' content='Add Order' style={{ backgroundColor: '#f20056', color: 'white' }} />
                                <Button style={{ marginTop: '0.5em' }} fluid size='small' compact content='Print Labels' />
                            </Grid.Column>
                            <Grid.Column>
                                <Message fluid style={{ textAlign: 'center' }} warning>warning paceholder</Message>
                            </Grid.Column>
                            <Grid.Column textAlign='right' floated='right'>
                                <Button size="medium" style={{ backgroundColor: '#f20056', color: 'white' }} icon='search' />
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
                <Grid stackable>
                    <Grid.Row columns={5}>
                        <Grid.Column width={2}>
                            <Header as='h1' content='Orders' />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button fluid size='small' compact content='Add Order' style={{ backgroundColor: '#f20056', color: 'white' }} />
                            <Button style={{ marginTop: '0.5em' }} fluid size='small' compact content='Print Labels' />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Message style={{ textAlign: 'center' }} warning>warning paceholder</Message>
                        </Grid.Column>
                        <Grid.Column width={1} textAlign='right' floated='right'>
                            <Button size="medium" compact style={{ backgroundColor: '#f20056', color: 'white' }} icon='search' />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }
        return (
            <div>
                {grid}
                {table}
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
        openOrderDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);