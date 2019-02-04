import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, Message, Icon, Segment, Form, Dropdown, Divider, Label, Table } from 'semantic-ui-react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { deliveryTypes, deliveryCompanies, LOCALSTORAGE_NAME } from '../../appConfig';
import { getAllProductsAction, openOrderDetailsAction } from '../../utils/actions';
import { getAllProducts, getOrder, createOrder, getHighestVS } from '../../utils/requests';
import SimpleTable from '../../components/SimpleTable';
import moment from 'moment';
import { getGLSDeliveryPrice } from '../../utils/helpers';
import { handleOrder, handleProductDropdownOnChangeHelper, getTotalPriceHelper, handleInputChangeHelper, handleToggleDeliveryButtonsHelper, handleToggleBankAccountPaymentButtonsHelper, removeProductFromOrder } from './OrdersHelpers';
import ProductRow from '../../components/ProductRow';
import GenericModal from '../../components/GenericModal';

class AddOrder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : "",
            orderToAdd: {
                state: "active",
                products: [],
                deliveryType: 'vs',
                deliveryCompany: 'gls',
                address: {
                    city: "",
                    firstName: "",
                    lastName: "",
                    phone: "",
                    psc: "",
                    street: "",
                    streetNumber: ""
                },
                payment: {
                    price: 0,
                    cashOnDelivery: true
                }
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.smartformInterval)
        window.smartformReloaded = false

        this.isCancelled = true;
    }

    componentDidMount() {
        if (this.props.ordersPageStore.products.length === 0) {
            getAllProducts()
                .then(res => this.props.getAllProductsAction(res.data))
        }

        this.smartformInterval = setInterval(() => {
            if (window.smartform && !window.smartformReloaded) {
                window.smartformReloaded = true
                window.smartform.rebindAllForms(true);
            }
        }, 5000);

    }

    handleProductDropdownOnChange = (e, m, i, product) => {
        var temp = handleProductDropdownOnChangeHelper(
            product, this.state.orderToAdd, i)
        if (!this.isCancelled) {
            this.setState(() => ({
                orderToAdd: temp
            }))
        }
    }

    handleInputChange = (e, { name, value }, prop) => {
        var temp = handleInputChangeHelper(name, value, prop, this.state.orderToAdd);

        this.setState({ orderToAdd: temp });
    }

    getTotalPrice = (raw) => {
        return getTotalPriceHelper(raw, this.state.orderToAdd);
    }


    renderProducts = () => {

        var result = []

        // map existing products
        result = this.state.orderToAdd.products.map((product, i) => {
            return (
                <React.Fragment key={i}>
                    <ProductRow
                        allProducts={this.props.ordersPageStore.products}
                        i={i}
                        product={product}
                        handleProductDropdownOnChange={this.handleProductDropdownOnChange} />
                </React.Fragment>
            )
        })

        // add new product
        let i = this.state.orderToAdd.products.length + 1;

        result.push(
            <React.Fragment key={i}>
                <Form.Field>
                    <label><Icon name='add' />Product Name</label>
                    <Dropdown
                        selection
                        onChange={(e, m) => this.handleProductDropdownOnChange(e, m, i, { productName: m.value, count: 1, pricePerOne: this.props.ordersPageStore.products[m.value].price })}
                        options={Object.keys(this.props.ordersPageStore.products).map(x =>
                            ({
                                value: x,
                                text: x
                            })
                        )}
                        fluid
                        selectOnBlur={false}
                        selectOnNavigation={false}
                        placeholder='Type to search & add...'
                        search
                    />
                </Form.Field>
            </React.Fragment>
        )

        return result;
    }

    handleToggleDeliveryButtons = (prop, type) => {
        var temp = handleToggleDeliveryButtonsHelper(prop, type, this.state.orderToAdd);

        this.setState({ orderToAdd: temp });
    }

    handleToggleBankAccountPaymentButtons = (type) => {
        var temp = handleToggleBankAccountPaymentButtonsHelper(type);

        this.setState({ orderToAdd: temp });
    }

    removeProductFromOrder = (index) => {
        var temp = removeProductFromOrder(index, this.state.orderToAdd);

        this.setState({ orderToAdd: temp });
    }

    render() {
        if (this.props.baseStore.showGenericModal) {
            return (
                <GenericModal
                    show={this.props.baseStore.showGenericModal}
                    header={this.props.baseStore.modal.modalHeader}
                    content={this.props.baseStore.modal.modalContent}
                    redirectTo={this.props.baseStore.modal.redirectTo}
                    parentProps={this.props.baseStore.modal.parentProps}
                    err={this.props.baseStore.modal.err} />)
        }

        var grid;
        const { orderToAdd } = this.state;

        if (this.props.isMobile) {
            // mobile
            grid = (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                {'Edit Order'}
                            </Header>
                        </Grid.Column>
                        <Grid.Column style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                            <Button fluid size='medium' compact content='Save' id="primaryButton" />
                            <Button style={{ marginTop: '0.5em' }} fluid size='medium' compact content='Save Draft' id="tercialButton" />
                            <Link to={{ pathname: '/orders', state: { fromDetails: true } }}>
                                <Button
                                    style={{ marginTop: '0.5em' }} id="secondaryButton" fluid size='small'
                                    compact content='Back'
                                />
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns='equal'>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Contact Info
                                {/* <Button content='Save' /> */}
                            </Header>
                            <Segment attached='bottom'>
                                <Form className='form' size='large'>
                                    <Form.Field onClick={this.scrollToTop} >
                                        <label>
                                            Street and number
                                        </label>
                                        <input id="streetAndNumber" className="smartform-street-and-number"></input>
                                        <input type="text" style={{ display: 'none' }} className="smartform-street" id="hiddenStreet" />
                                        <input type="text" style={{ display: 'none' }} className="smartform-number" id="hiddenStreetNumber" />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>City</label>
                                        <input readOnly id="city" className="smartform-city"></input>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>ZIP</label>
                                        <input readOnly id="zip" className="smartform-zip"></input>
                                    </Form.Field>
                                    <Form.Input label='First Name' fluid name='firstName' onChange={(e, m) => this.handleInputChange(e, m, "address")} />
                                    <Form.Input label='Last Name' fluid name='lastName' onChange={(e, m) => this.handleInputChange(e, m, "address")} />
                                    <Form.Input label='Phone Number' fluid name='phone' onChange={(e, m) => this.handleInputChange(e, m, "address")} />
                                    <Form.Input label='Company' fluid name='company' onChange={(e, m) => this.handleInputChange(e, m, "address")} />
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Delivery Info
                            </Header>
                            <Segment attached='bottom'>
                                <Form className='form' size='large'>
                                    <Form.Input label='Delivery Price [CZK]' fluid name='price' onChange={(e, m) => this.handleInputChange(e, m, "payment")} />
                                    <Form.Input label='VS' fluid name='vs' onChange={(e, m) => this.handleInputChange(e, m, "payment")} />
                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                        <label><b>Payment type</b></label>
                                        <Button.Group fluid size='medium'>
                                            <Button
                                                onClick={() => this.handleToggleDeliveryButtons("deliveryType", deliveryTypes[0].type)}
                                                id={orderToAdd.deliveryType.toLowerCase() === deliveryTypes[0].type ? "primaryButton" : "secondaryButton"}>
                                                VS
                                            </Button>
                                            <Button.Or text='OR' />
                                            <Button
                                                onClick={() => this.handleToggleDeliveryButtons("deliveryType", deliveryTypes[1].type)}
                                                id={orderToAdd.deliveryType.toLowerCase() === deliveryTypes[0].type ? "secondaryButton" : "primaryButton"}>
                                                Cash
                                            </Button>
                                        </Button.Group>
                                    </div>
                                    {
                                        orderToAdd.deliveryType === deliveryTypes[1].type ? (
                                            null
                                        ) : (
                                                <>
                                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                                        <label><b>Delivery company</b></label>
                                                        <Button.Group fluid size='medium'>
                                                            <Button
                                                                onClick={() => this.handleToggleDeliveryButtons("deliveryCompany", deliveryCompanies[0].company)}
                                                                id={orderToAdd.deliveryCompany.toLowerCase() === deliveryCompanies[0].company ? "primaryButton" : "secondaryButton"}>
                                                                GLS
                                                            </Button>
                                                            <Button.Or text='OR' />
                                                            <Button
                                                                onClick={() => this.handleToggleDeliveryButtons("deliveryCompany", deliveryCompanies[1].company)}
                                                                id={orderToAdd.deliveryCompany.toLowerCase() === deliveryCompanies[1].company ? "primaryButton" : "secondaryButton"}>
                                                                Česká Pošta
                                                            </Button>
                                                        </Button.Group>
                                                    </div>
                                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                                        <label><b>Bank account payment</b></label>
                                                        <Button.Group fluid size='medium'>
                                                            <Button
                                                                onClick={() => this.handleToggleBankAccountPaymentButtons(false)}
                                                                id={orderToAdd.payment.cashOnDelivery ? "secondaryButton" : "primaryButton"}>
                                                                Yes
                                                            </Button>
                                                            <Button.Or text='OR' />
                                                            <Button
                                                                onClick={() => this.handleToggleBankAccountPaymentButtons(true)}
                                                                id={orderToAdd.payment.cashOnDelivery ? "primaryButton" : "secondaryButton"}>
                                                                NO
                                                            </Button>
                                                        </Button.Group>
                                                    </div>
                                                </>
                                            )
                                    }
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns="equal" >
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Products
                            </Header>
                            <Segment attached='bottom'>
                                <Form className='form' size='large'>
                                    {this.renderProducts()}
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Summary
                            </Header>
                            <Segment attached='bottom'>
                                <Form className='form' size='large'>
                                    <label><b>Total price [CZK]</b></label>
                                    {/* <label style={{marginBottom: '0.5em'}} ><b>Total price [CZK]</b></label> */}
                                    <input style={{ marginBottom: '0.5em' }} readOnly value={this.getTotalPrice()} ></input>
                                    <Form.Input label='Note' fluid value={orderToAdd.note ? orderToAdd.note : ""} name='note' onChange={(e, m) => this.handleInputChange(e, m)} />
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                            <Button fluid size='medium' compact content='Save' id="primaryButton" />
                            <Button style={{ marginTop: '0.5em' }} fluid size='medium' compact content='Save Draft' id="tercialButton" />
                            <Link to={{ pathname: '/orders', state: { fromDetails: true } }}>
                                <Button
                                    style={{ marginTop: '0.5em' }} id="secondaryButton" fluid size='small'
                                    compact content='Back'
                                />
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid >
            )
        }
        // desktop
        else {
            var productsTableColumnProperties = [
                {
                    name: "#",
                    collapsing: true
                },
                {
                    name: "Product Name",
                    width: 14,
                },
                {
                    name: "Product Price [CZK]",
                    collapsing: true
                },
                {
                    name: "Product Count [Pcs]",
                    collapsing: true
                },
                {
                    name: "Total Product Price [CZK]",
                    collapsing: true
                },
                {
                    name: "Remove",
                    collapsing: true
                }
            ];

            var productsTableRow = this.state.orderToAdd.products.map((product, i) => {
                return (
                    <Table.Row key={i} >
                        <Table.Cell collapsing>
                            {i + 1}
                        </Table.Cell>
                        <Table.Cell>
                            <Dropdown
                                selection
                                onChange={(e, m) => this.handleProductDropdownOnChange(
                                    e, m, i,
                                    {
                                        productName: m.value,
                                        count: 1,
                                        pricePerOne: this.props.ordersPageStore.products[m.value].price,
                                        product: this.props.ordersPageStore.products[m.value]
                                    })}
                                options={Object.keys(this.props.ordersPageStore.products).map(x =>
                                    ({
                                        value: x,
                                        text: x
                                    })
                                )}
                                defaultValue={product.productName}
                                fluid
                                selectOnBlur={false}
                                selectOnNavigation={false}
                                placeholder='Type to search...'
                                search
                            />
                        </Table.Cell>
                        <Table.Cell collapsing>
                            <Form.Input
                                fluid
                                value={product.pricePerOne}
                                onChange={(e, m) => this.handleProductDropdownOnChange(e, m, i, {
                                    pricePerOne: m.value,
                                    productName: product.productName,
                                    count: product.count
                                })} />
                        </Table.Cell>
                        <Table.Cell collapsing>
                            <Form.Input
                                fluid
                                value={product.count}
                                onChange={(e, m) => this.handleProductDropdownOnChange(e, m, i, {
                                    pricePerOne: product.pricePerOne,
                                    productName: product.productName,
                                    count: parseInt(m.value)
                                })} />
                        </Table.Cell>
                        <Table.Cell collapsing>
                            <Form.Input fluid readOnly value={product.totalPricePerProduct}></Form.Input>
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <Button onClick={() => this.removeProductFromOrder(i)} style={{ padding: '0.3em' }} icon="close"></Button>
                        </Table.Cell>
                    </Table.Row>
                )
            })

            // add new product
            let i = this.state.orderToAdd.products.length + 1;

            productsTableRow.push(
                <Table.Row key={i}>
                    <Table.Cell colSpan={6}>
                        <Dropdown
                            selection
                            onChange={(e, m) => this.handleProductDropdownOnChange(
                                e, m, i - 1, {
                                    productName: m.value,
                                    count: 1,
                                    pricePerOne: this.props.ordersPageStore.products[m.value].price,
                                    product: this.props.ordersPageStore.products[m.value]
                                })}
                            options={Object.keys(this.props.ordersPageStore.products).map(x =>
                                ({
                                    value: x,
                                    text: x
                                })
                            )}
                            fluid
                            selectOnBlur={false}
                            selectOnNavigation={false}
                            placeholder='Type to search & add...'
                            search
                        />
                    </Table.Cell>
                </Table.Row>
            )

            var buttons = (
                <Grid.Column width={13}>
                    <Button onClick={() => handleOrder(this.state.orderToAdd, "create")} size='medium' compact content='Save' id="primaryButton" />
                    <Button style={{ marginTop: '0.5em' }} size='medium' compact content='Save Draft' id="tercialButton" />
                    <Link to={{ pathname: '/orders', state: { fromDetails: true } }}>
                        <Button
                            style={{ marginTop: '0.5em' }} id="secondaryButton" size='small'
                            compact content='Back'
                        />
                    </Link>
                </Grid.Column>
            )

            grid = (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            <Header as='h1'>
                                {'Edit Order'}
                            </Header>
                        </Grid.Column>
                        {buttons}
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={7}>
                            <Header block attached='top' as='h4'>
                                Contact Info
                            </Header>
                            <Segment attached='bottom'>
                                <Form size='small'>
                                    <Grid>
                                        <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.25em', paddingBottom: '0.25em' }}>
                                            <Grid.Column width={4}>
                                                <strong>
                                                    Street and number
                                                </strong>
                                            </Grid.Column>
                                            <Grid.Column width={12}>
                                                <Form.Field>
                                                    <Form.Input >
                                                        <input id="streetAndNumber" name="nope" type="text" className="smartform-street-and-number"></input>
                                                        <input type="text" style={{ display: 'none' }} className="smartform-street" id="hiddenStreet" />
                                                        <input type="text" style={{ display: 'none' }} className="smartform-number" id="hiddenStreetNumber" />
                                                    </Form.Input>
                                                </Form.Field>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.25em', paddingBottom: '0.25em' }}>
                                            <Grid.Column width={4}>
                                                <strong>
                                                    City
                                                </strong>
                                            </Grid.Column>
                                            <Grid.Column width={12}>
                                                <Form.Field>
                                                    <Form.Input>
                                                        <input readOnly id="city" className="smartform-city"></input>
                                                    </Form.Input>
                                                </Form.Field>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.25em', paddingBottom: '0.25em' }}>
                                            <Grid.Column width={4}>
                                                <strong>
                                                    ZIP
                                                </strong>
                                            </Grid.Column>
                                            <Grid.Column width={12}>
                                                <Form.Field>
                                                    <Form.Input>
                                                        <input readOnly id="zip" className="smartform-zip"></input>
                                                    </Form.Input>
                                                </Form.Field>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Divider></Divider>
                                        <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.25em', paddingBottom: '0.25em' }}>
                                            <Grid.Column width={4}>
                                                <strong>
                                                    First Name
                                                </strong>
                                            </Grid.Column>
                                            <Grid.Column width={12}>
                                                <Form.Input fluid id="firstName" name="nope" />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.25em', paddingBottom: '0.25em' }}>
                                            <Grid.Column width={4}>
                                                <strong>
                                                    Last Name
                                                </strong>
                                            </Grid.Column>
                                            <Grid.Column width={12}>
                                                <Form.Input fluid id='lastName' name="nope" />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.25em', paddingBottom: '0.25em' }}>
                                            <Grid.Column width={4}>
                                                <strong>
                                                    Phone Number
                                                </strong>
                                            </Grid.Column>
                                            <Grid.Column width={12}>
                                                <Form.Input fluid id='phone' name="nope" />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.25em', paddingBottom: '1em' }}>
                                            <Grid.Column width={4}>
                                                <strong>
                                                    Company
                                                </strong>
                                            </Grid.Column>
                                            <Grid.Column width={12}>
                                                <Form.Input fluid id='company' name="nope" />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Form>
                            </Segment>
                            <Header block attached='top' as='h4'>
                                Delivery Info
                            </Header>
                            <Segment attached='bottom'>
                                <Grid>
                                    <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                                        <Grid.Column width={4}>
                                            <strong>
                                                Delivery Price [CZK]
                                            </strong>
                                        </Grid.Column>
                                        <Grid.Column width={12}>
                                            <Form.Input fluid value={orderToAdd.payment.price} name='price' onChange={(e, m) => this.handleInputChange(e, m, "payment")} />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                                        <Grid.Column width={4}>
                                            <strong>
                                                Payment type
                                            </strong>
                                        </Grid.Column>
                                        <Grid.Column width={7}>
                                            <Button.Group fluid size='medium'>
                                                <Button
                                                    onClick={() => this.handleToggleDeliveryButtons("deliveryType", deliveryTypes[0].type)}
                                                    id={orderToAdd.deliveryType.toLowerCase() === deliveryTypes[0].type ? "primaryButton" : "secondaryButton"}>
                                                    VS
                                            </Button>
                                                <Button.Or text='OR' />
                                                <Button
                                                    onClick={() => this.handleToggleDeliveryButtons("deliveryType", deliveryTypes[1].type)}
                                                    id={orderToAdd.deliveryType.toLowerCase() === deliveryTypes[0].type ? "secondaryButton" : "primaryButton"}>
                                                    Cash
                                            </Button>
                                            </Button.Group>
                                        </Grid.Column>
                                    </Grid.Row>
                                    {
                                        orderToAdd.deliveryType === deliveryTypes[1].type ? (
                                            null
                                        ) : (
                                                <>
                                                    <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                                                        <Grid.Column width={4}>
                                                            <strong>
                                                                Delivery company
                                                            </strong>
                                                        </Grid.Column>
                                                        <Grid.Column width={7}>
                                                            <Button.Group fluid size='medium'>
                                                                <Button
                                                                    onClick={() => this.handleToggleDeliveryButtons("deliveryCompany", deliveryCompanies[0].company)}
                                                                    id={orderToAdd.deliveryCompany.toLowerCase() === deliveryCompanies[0].company ? "primaryButton" : "secondaryButton"}>
                                                                    GLS
                                                            </Button>
                                                                <Button.Or text='OR' />
                                                                <Button
                                                                    onClick={() => this.handleToggleDeliveryButtons("deliveryCompany", deliveryCompanies[1].company)}
                                                                    id={orderToAdd.deliveryCompany.toLowerCase() === deliveryCompanies[1].company ? "primaryButton" : "secondaryButton"}>
                                                                    Česká Pošta
                                                            </Button>
                                                            </Button.Group>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                                                        <Grid.Column width={4}>
                                                            <strong>
                                                                Bank account payment
                                                            </strong>
                                                        </Grid.Column>
                                                        <Grid.Column width={7}>
                                                            <Button.Group fluid size='medium'>
                                                                <Button
                                                                    onClick={() => this.handleToggleBankAccountPaymentButtons(false)}
                                                                    id={orderToAdd.payment.cashOnDelivery ? "secondaryButton" : "primaryButton"}>
                                                                    Yes
                                                            </Button>
                                                                <Button.Or text='OR' />
                                                                <Button
                                                                    onClick={() => this.handleToggleBankAccountPaymentButtons(true)}
                                                                    id={orderToAdd.payment.cashOnDelivery ? "primaryButton" : "secondaryButton"}>
                                                                    NO
                                                            </Button>
                                                            </Button.Group>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </>
                                            )
                                    }
                                </Grid>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <Header block attached='top' as='h4'>
                                Products
                            </Header>
                            <Segment attached='bottom'>
                                <SimpleTable columnProperties={productsTableColumnProperties} body={productsTableRow} showHeader={productsTableRow.length > 1 ? true : false} compact="very" />
                            </Segment>
                            <Header block attached='top' as='h4'>
                                Summary
                            </Header>
                            <Segment attached='bottom'>
                                <Form className='form' size='small'>
                                    <label><b>Total price [CZK]</b></label>
                                    <input style={{ marginBottom: '0.5em' }} readOnly value={this.getTotalPrice(false)} ></input>
                                    <Form.Input label='Note' fluid value={orderToAdd.note ? orderToAdd.note : ""} name='note' onChange={(e, m) => this.handleInputChange(e, m)} />
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid >
            )

        }
        return (
            <div>
                {grid}
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        ordersPageStore: state.OrdersReducer,
        baseStore: state.BaseReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAllProductsAction,
        openOrderDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddOrder);