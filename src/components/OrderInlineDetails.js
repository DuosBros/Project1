import React from 'react';
import { Grid, Table, Header, Divider } from 'semantic-ui-react'
import SimpleTable from './SimpleTable';
import { getOrderTableRowStyle } from '../utils/helpers';
const OrderInlineDetails = (props) => {
    let result;
    let totalProductCount = 0

    props.order.products.forEach(product => {
        totalProductCount += product.count
    })

    if (props.isMobile) {
        result = (
            <Table.Cell>
                <Grid style={{ marginTop: '0.5em' }}>
                    <Grid.Row textAlign='left' columns='equal' style={{ paddingTop: '0px' }}>
                        <Grid.Column>
                            <strong>First name:</strong> {props.order.address.firstName} <br />
                            <strong>Last name:</strong> {props.order.address.lastName} <br />
                            <strong>Phone:</strong> {props.order.address.phone} <br />
                            <strong>Street:</strong> {props.order.address.street} <br />
                            <strong>City:</strong> {props.order.address.city} <br />
                            <strong>Street number:</strong> {props.order.address.streetNumber} <br />
                            <strong>ZIP:</strong> {props.order.address.psc} <br />
                        </Grid.Column>
                        <Grid.Column textAlign='left'>
                            <strong>Company:</strong> {props.order.address.company} <br />
                            <strong>Bank payment:</strong> {props.order.payment.cashOnDelivery ? "yes" : "no"} <br />
                            <strong>Delivery:</strong> {props.order.deliveryCompany ? props.order.deliveryType + " + " + props.order.deliveryCompany : props.order.deliveryType} <br />
                            <strong>Note:</strong> {props.order.note} <br />
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
                                <Grid.Column width={1} style={{ fontSize: '0.8em', paddingLeft: '0px', paddingRight: '0px', maxWidth: '85px' }}>
                                    {product.count}
                                </Grid.Column>
                                <Grid.Column style={{ fontSize: '0.8em' }} width={3}>
                                    {product.pricePerOne}
                                </Grid.Column>
                                <Grid.Column style={{ fontSize: '0.8em' }} width={3}>
                                    <strong>{product.totalPricePerProduct}</strong>
                                </Grid.Column>
                            </Grid.Row>
                        )
                    })}
                    <Divider fitted style={{ marginTop: '0px', marginBottom: '0px' }} />
                    <Grid.Row style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                        <Grid.Column width={9}>
                        </Grid.Column>
                        <Grid.Column width={1} style={{ fontSize: '0.8em', paddingLeft: '0px', paddingRight: '0px', maxWidth: '85px' }}>
                            {totalProductCount}
                        </Grid.Column>
                        <Grid.Column style={{ fontSize: '0.8em' }} width={6}>
                            : Total product count
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column textAlign='left'>
                            {
                                props.order.payment.price ? (
                                    <>
                                        <strong>Delivery price:</strong> {props.order.payment.price} Kč<br />
                                    </>
                                ) : (
                                        null
                                    )
                            }
                            <strong>Total Price: {props.order.totalPrice} Kč</strong>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Table.Cell>
        )
    }
    else {
        let productTableBody = props.order.products.map((product, index) => {
            return (
                <Table.Row key={index}>
                    <Table.Cell >{product.productName}</Table.Cell>
                    <Table.Cell >{product.count}</Table.Cell>
                    <Table.Cell >{product.pricePerOne} Kč</Table.Cell>
                    <Table.Cell>{product.totalPricePerProduct} Kč</Table.Cell>
                </Table.Row>
            )
        })
        productTableBody.push(
            <Table.Row>
                <Table.Cell>
                </Table.Cell>
                <Table.Cell>
                    {totalProductCount + ": Total product count"}
                </Table.Cell>
                <Table.Cell>

                </Table.Cell>
                <Table.Cell>
                </Table.Cell>
            </Table.Row>
        )
        result = (
            <Table.Row>
                <Table.Cell style={getOrderTableRowStyle(props.order)} colSpan={9}>
                    <Grid style={{ marginTop: '1em', marginBottom: '1.5em', paddingLeft: '1em', paddingRight: '1em', color: 'black' }}>
                        <Grid.Row style={{ padding: '0.5em' }}>
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
                                <strong>First name:</strong> {props.order.address.firstName} <br />
                                <strong>Last name:</strong> {props.order.address.lastName} <br />
                                <strong>Phone:</strong> {props.order.address.phone} <br />
                                <strong>Company:</strong> {props.order.address.company} <br />
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <strong>Street:</strong> {props.order.address.street} <br />
                                <strong>City:</strong> {props.order.address.city} <br />
                                <strong>Street number:</strong> {props.order.address.streetNumber} <br />
                                <strong>ZIP:</strong> {props.order.address.psc} <br />
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
                                } body={productTableBody} />
                                <Grid>
                                    <Grid.Row columns='equal' style={{ padding: '0px', borderBottom: '0px' }}>
                                        <Grid.Column>
                                            <strong>Bank account payment:</strong> {props.order.payment.cashOnDelivery ? "yes" : "no"} <br />
                                            <strong>Delivery:</strong> {props.order.deliveryCompany ? props.order.deliveryType + " + " + props.order.deliveryCompany : props.order.deliveryType} <br />
                                        </Grid.Column>
                                        <Grid.Column style={{ paddingLeft: '0px' }}>
                                            <strong>Delivery price:</strong> {props.order.payment.price} Kč<br />
                                            <strong>Total Price: {props.order.totalPrice} Kč</strong>
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