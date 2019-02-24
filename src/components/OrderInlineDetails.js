import React from 'react';
import { Grid, Table, Header } from 'semantic-ui-react'
import SimpleTable from './SimpleTable';
import { getOrderTableRowStyle } from '../utils/helpers';
const OrderInlineDetails = (props) => {
    let result;
    if (props.isMobile) {
        result = (
            <Table.Cell>
                <Grid style={{ marginTop: '0.5em' }}>
                    <Grid.Row textAlign='left' columns='equal' style={{ paddingTop: '0px' }}>
                        <Grid.Column>
                            <b>First name:</b> {props.order.address.firstName} <br />
                            <b>Last name:</b> {props.order.address.lastName} <br />
                            <b>Phone:</b> {props.order.address.phone} <br />
                            <b>Street:</b> {props.order.address.street} <br />
                            <b>City:</b> {props.order.address.city} <br />
                            <b>Street number:</b> {props.order.address.streetNumber} <br />
                            <b>ZIP:</b> {props.order.address.psc} <br />
                        </Grid.Column>
                        <Grid.Column textAlign='left'>
                            <b>Company:</b> {props.order.address.company} <br />
                            <b>Bank payment:</b> {props.order.payment.cashOnDelivery ? "yes" : "no"} <br />
                            <b>Delivery:</b> {props.order.deliveryCompany ? props.order.deliveryType + " + " + props.order.deliveryCompany : props.order.deliveryType} <br />

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ fontWeight: 'bold', fontSize: '0.8em', paddingTop: '0px', paddingBottom: '0px' }}>
                        <Grid.Column width={9}>
                            Product
                    </Grid.Column>
                        <Grid.Column width={1} style={{ paddingLeft: '0px', paddingRight: '0px', maxWidth: '85px' }}>
                            Count
                    </Grid.Column>
                        <Grid.Column width={3}>
                            Price/piece [CZK]
                    </Grid.Column>
                        <Grid.Column width={3}>
                            Sum [CZK]
                    </Grid.Column>
                    </Grid.Row>
                    {props.order.products.map((product, index) => {
                        return (
                            <Grid.Row key={index} style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                                <Grid.Column style={{ fontSize: '0.8em' }} width={9}>
                                    {product.productName}
                                </Grid.Column>
                                <Grid.Column width={1} style={{fontSize: '0.8em', paddingLeft: '0px', paddingRight: '0px', maxWidth: '85px' }}>
                                    {product.count}
                                </Grid.Column>
                                <Grid.Column style={{ fontSize: '0.8em' }} width={3}>
                                    {product.pricePerOne}
                                </Grid.Column>
                                <Grid.Column style={{ fontSize: '0.8em' }} width={3}>
                                    <b>{product.totalPricePerProduct}</b>
                                </Grid.Column>

                            </Grid.Row>
                        )
                    })}
                    <Grid.Row>
                        <Grid.Column textAlign='left'>
                            {
                                props.order.payment.price ? (
                                    <>
                                        <b>Delivery price:</b> {props.order.payment.price} Kč<br />
                                    </>
                                ) : (
                                        null
                                    )
                            }
                            <b>Total Price: {props.order.totalPrice} Kč</b>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Table.Cell>
        )
    }
    else {
        result = (
            <Table.Row>
                <Table.Cell style={getOrderTableRowStyle(props.order)} colSpan={9}>
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
                                <b>First name:</b> {props.order.address.firstName} <br />
                                <b>Last name:</b> {props.order.address.lastName} <br />
                                <b>Phone:</b> {props.order.address.phone} <br />
                                <b>Company:</b> {props.order.address.company} <br />
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <b>Street:</b> {props.order.address.street} <br />
                                <b>City:</b> {props.order.address.city} <br />
                                <b>Street number:</b> {props.order.address.streetNumber} <br />
                                <b>ZIP:</b> {props.order.address.psc} <br />
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <SimpleTable showHeader={true} columnProperties={
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
                                } body={props.order.products.map((product, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell >{product.productName}</Table.Cell>
                                            <Table.Cell >{product.count}</Table.Cell>
                                            <Table.Cell >{product.pricePerOne} Kč</Table.Cell>
                                            <Table.Cell>{product.totalPricePerProduct} Kč</Table.Cell>
                                        </Table.Row>
                                    )
                                })} />
                                <Grid>
                                    <Grid.Row columns='equal' style={{ padding: '0px', borderBottom: '0px' }}>
                                        <Grid.Column>
                                            <b>Bank account payment:</b> {props.order.payment.cashOnDelivery ? "yes" : "no"} <br />
                                            <b>Delivery:</b> {props.order.deliveryCompany ? props.order.deliveryType + " + " + props.order.deliveryCompany : props.order.deliveryType} <br />
                                        </Grid.Column>
                                        <Grid.Column style={{ paddingLeft: '0px' }}>
                                            <b>Delivery price:</b> {props.order.payment.price} Kč<br />
                                            <b>Total Price: {props.order.totalPrice} Kč</b>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Table.Cell>
            </Table.Row>
        )
    }

    return (
        result
    )
}

export default OrderInlineDetails;