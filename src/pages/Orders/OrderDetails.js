import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, Message, Icon, Segment, Form, Dropdown, Divider, Label, Table } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { deliveryTypes, deliveryCompanies, LOCALSTORAGE_NAME, DEFAULT_ORDER_LOCK_SECONDS } from '../../appConfig';
import { getAllProductsAction, openOrderDetailsAction, showGenericModalAction } from '../../utils/actions';
import { getAllProducts, getOrder, verifyLock, lockOrder } from '../../utils/requests';
import GenericModal from '../../components/GenericModal';
import SimpleTable from '../../components/SimpleTable';
import { handleOrder, handleProductDropdownOnChangeHelper, handleInputChangeHelper, getTotalPriceHelper, handleToggleDeliveryButtonsHelper, handleToggleBankAccountPaymentButtonsHelper, removeProductFromOrder } from './OrdersHelpers';
import ProductRow from '../../components/ProductRow';
import OrderDetailsButtons from '../../components/OrderDetailsButtons';

class OrderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            streetAndNumberInput: null,
            dropdownAddressSugestionInput: "",
            user: localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : "",
        }

        // check if order is locked
        verifyLock(this.props.match.params.id, this.state.user)
            .then(res => {
                this.getOrderDetails()
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data) {
                        if (err.response.data.message) {
                            if (err.response.data.message.lockedBy !== this.state.user) {
                                this.props.showGenericModalAction({
                                    modalContent: (
                                        <span>
                                            This order is locked by <b>{err.response.data.message.lockedBy}</b>!
                                        </span>
                                    ),
                                    modalHeader: "Locked order",
                                    redirectTo: '/orders',
                                    parentProps: props
                                })
                            }
                            else {
                                this.getOrderDetails()
                            }
                        }
                    }
                }
                else {
                    this.props.showGenericModalAction({
                        modalContent: (
                            <span>
                                Details:
                            </span>
                        ),
                        modalHeader: "Something happened",
                        redirectTo: '/orders',
                        parentProps: props,
                        err: err
                    })
                }
            })
    }


    getOrderDetails = () => {
        if (_.isEmpty(this.props.ordersPageStore.orderToEdit)) {
            getOrder(this.props.match.params.id)
                .then(res => {
                    if (res.data === null) {
                        this.props.showGenericModalAction({
                            modalContent: (
                                <span>
                                    Could not open order <b>{this.props.match.params.id}</b>!
                                </span>
                            ),
                            modalHeader: "Failed to open!",
                            redirectTo: '/orders',
                            parentProps: this.props
                        })
                    }

                    this.setState({ orderToEdit: res.data });

                    this.props.openOrderDetailsAction(res.data)
                })
                .catch(err => {
                    this.props.showGenericModalAction({
                        modalContent: (
                            <span>
                                Could not open order <b>{this.props.match.params.id}</b>!
                                {err.data ? err.data.message : err.message}
                            </span>
                        ),
                        modalHeader: "Failed to open!",
                        redirectTo: '/orders',
                        parentProps: this.props,
                        err: err
                    })
                })
        }
        else {
            this.setState({ orderToEdit: this.props.ordersPageStore.orderToEdit });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match && this.props.match.params) {
            if (!_.isEmpty(this.state.orderToEdit) && !_.isEmpty(document.getElementById("streetAndNumber"))) {
                document.getElementById("streetAndNumber").value = this.state.orderToEdit.address.street + " " + this.state.orderToEdit.address.streetNumber
                document.getElementById("city").value = this.state.orderToEdit.address.city
                document.getElementById("zip").value = this.state.orderToEdit.address.psc
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
        clearInterval(this.smartformInterval)
        window.smartformReloaded = false
    }

    componentDidMount() {
        // fire immediately after mounting
        lockOrder(this.props.match.params.id, this.state.user, DEFAULT_ORDER_LOCK_SECONDS)

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


        this.intervalId = setInterval(() => {

            lockOrder(this.props.ordersPageStore.orderToEdit.id, this.state.user, DEFAULT_ORDER_LOCK_SECONDS)
        }, DEFAULT_ORDER_LOCK_SECONDS * 1000)


    }

    handleProductDropdownOnChange = (e, m, i, product) => {
        product.product = this.props.ordersPageStore.products[product.productName]
        var temp = handleProductDropdownOnChangeHelper(product, this.state.orderToEdit, i);

        this.setState(() => ({
            orderToEdit: temp
        }))
    }

    handleInputChange = (e, { name, value }, prop) => {
        var temp = handleInputChangeHelper(name, value, prop, this.state.orderToEdit);

        this.setState({ orderToEdit: temp });
    }

    getTotalPrice = (raw) => {
        return getTotalPriceHelper(raw, this.state.orderToEdit);
    }

    // render products segment
    // rendering existing products plus one empty slot for adding new one
    renderProducts = () => {

        var result = []

        // map existing products
        result = this.state.orderToEdit.products.map((product, i) => {
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
        let i = this.state.orderToEdit.products.length;

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
        var temp = handleToggleDeliveryButtonsHelper(prop, type, this.state.orderToEdit);

        this.setState({ orderToAdd: temp });
    }

    handleToggleBankAccountPaymentButtons = (type) => {
        var temp = handleToggleBankAccountPaymentButtonsHelper(type, this.state.orderToEdit);

        this.setState({ orderToAdd: temp });
    }

    removeProductFromOrder = (index) => {
        var temp = removeProductFromOrder(index, this.state.orderToEdit);

        this.setState({ orderToEdit: temp });
    }

    render() {
        var grid, orderToEdit;

        if (_.isEmpty(this.state.orderToEdit)) {
            return (
                <div className="centered">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Loading order details</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }
        else {
            orderToEdit = this.state.orderToEdit
        }

        console.log(orderToEdit);

        var pica = this.state.streetAndNumberInput !== null ? this.state.streetAndNumberInput : orderToEdit.address.street + " " + orderToEdit.address.streetNumber

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
                        <OrderDetailsButtons isMobile={this.props.isMobile} order={this.state.orderToEdit} mode='update' props={this.props} />
                    </Grid.Row>
                    <Grid.Row columns='equal'>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Contact Info
                            </Header>
                            <Segment attached='bottom'>
                                <Form className='form' size='large'>
                                    <Form.Field>
                                        <label>Street and number</label>
                                        <input name="toto-neni-ulice" id="streetAndNumber" type="text" className="smartform-street-and-number" value={pica} onChange={(e) => this.setState({ streetAndNumberInput: e.target.value })}></input>
                                        <input type="text" style={{ display: 'none' }} className="smartform-street" id="hiddenStreet" />
                                        <input type="text" style={{ display: 'none' }} className="smartform-number" id="hiddenStreetNumber" />
                                        {/* <input disabled readOnly value={orderToEdit.address.street + " " + orderToEdit.address.streetNumber}></input> */}
                                    </Form.Field>
                                    <Form.Field>
                                        <label>City</label>
                                        <input readOnly id="city" value={orderToEdit.address.city} className="smartform-city"></input>
                                        {/* <input disabled readOnly ></input> */}
                                    </Form.Field>
                                    <Form.Field>
                                        <label>ZIP</label>
                                        <input readOnly id="zip" value={orderToEdit.address.psc} className="smartform-zip"></input>
                                        {/* <input disabled readOnly value={orderToEdit.address.psc}></input> */}
                                    </Form.Field>
                                    <Form.Input label='First Name' fluid value={orderToEdit.address.firstName} name='firstName' onChange={(e, m) => this.handleInputChange(e, m, "address")} />
                                    <Form.Input label='Last Name' fluid value={orderToEdit.address.lastName} name='lastName' onChange={(e, m) => this.handleInputChange(e, m, "address")} />
                                    <Form.Input label='Phone Number' fluid value={orderToEdit.address.phone} name='phone' onChange={(e, m) => this.handleInputChange(e, m, "address")} />
                                    <Form.Input label='Company' fluid value={orderToEdit.address.company} name='company' onChange={(e, m) => this.handleInputChange(e, m, "address")} />
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Delivery Info
                            </Header>
                            <Segment attached='bottom'>
                                <Form className='form' size='large'>
                                    <Form.Input label='Delivery Price [CZK]' fluid value={orderToEdit.payment.price} name='price' onChange={(e, m) => this.handleInputChange(e, m, "payment")} />
                                    <Form.Input label='VS' fluid value={orderToEdit.payment.vs} name='vs' onChange={(e, m) => this.handleInputChange(e, m, "payment")} />
                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                        <label><b>Payment type</b></label>
                                        <Button.Group fluid size='medium'>
                                            <Button
                                                onClick={() => this.handleToggleDeliveryButtons("deliveryType", deliveryTypes[0].type)}
                                                id={orderToEdit.deliveryType.toLowerCase() === deliveryTypes[0].type ? "primaryButton" : "secondaryButton"}>
                                                VS
                                            </Button>
                                            <Button.Or text='OR' />
                                            <Button
                                                onClick={() => this.handleToggleDeliveryButtons("deliveryType", deliveryTypes[1].type)}
                                                id={orderToEdit.deliveryType.toLowerCase() === deliveryTypes[0].type ? "secondaryButton" : "primaryButton"}>
                                                Cash
                                            </Button>
                                        </Button.Group>
                                    </div>
                                    {
                                        orderToEdit.deliveryType === deliveryTypes[1].type ? (
                                            null
                                        ) : (
                                                <>
                                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                                        <label><b>Delivery company</b></label>
                                                        <Button.Group fluid size='medium'>
                                                            <Button
                                                                onClick={() => this.handleToggleDeliveryButtons("deliveryCompany", deliveryCompanies[0].company)}
                                                                id={orderToEdit.deliveryCompany.toLowerCase() === deliveryCompanies[0].company ? "primaryButton" : "secondaryButton"}>
                                                                GLS
                                                            </Button>
                                                            <Button.Or text='OR' />
                                                            <Button
                                                                onClick={() => this.handleToggleDeliveryButtons("deliveryCompany", deliveryCompanies[1].company)}
                                                                id={orderToEdit.deliveryCompany.toLowerCase() === deliveryCompanies[1].company ? "primaryButton" : "secondaryButton"}>
                                                                Česká Pošta
                                                            </Button>
                                                        </Button.Group>
                                                    </div>
                                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                                        <label><b>Bank account payment</b></label>
                                                        <Button.Group fluid size='medium'>
                                                            <Button
                                                                onClick={() => this.handleToggleBankAccountPaymentButtons(false)}
                                                                id={orderToEdit.payment.cashOnDelivery ? "secondaryButton" : "primaryButton"}>
                                                                Yes
                                                            </Button>
                                                            <Button.Or text='OR' />
                                                            <Button
                                                                onClick={() => this.handleToggleBankAccountPaymentButtons(true)}
                                                                id={orderToEdit.payment.cashOnDelivery ? "primaryButton" : "secondaryButton"}>
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
                                    <input style={{ marginBottom: '0.5em' }} readOnly value={this.getTotalPrice(false)} ></input>
                                    <Form.Input label='Note' fluid value={orderToEdit.note ? orderToEdit.note : ""} name='note' onChange={(e, m) => this.handleInputChange(e, m)} />
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        {buttons}
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

            var productsTableRow = this.state.orderToEdit.products.map((product, i) => {
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
            let i = this.state.orderToEdit.products.length + 1;

            productsTableRow.push(
                <Table.Row key={i}>
                    <Table.Cell colSpan={6}>
                        <Dropdown
                            selection
                            onChange={(e, m) => this.handleProductDropdownOnChange(e, m, i - 1, { productName: m.value, count: 1, pricePerOne: this.props.ordersPageStore.products[m.value].price })}
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
                    <Button onClick={() => handleOrder(this.state.orderToEdit, "update", this.props)} size='medium' compact content='Save' id="primaryButton" />
                    <Button style={{ marginTop: '0.5em' }} size='medium' compact content='Save Draft' id="tercialButton" />
                    <Link to={{ pathname: '/orders', state: { isFromDetails: true } }}>
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
                        <OrderDetailsButtons isMobile={this.props.isMobile} order={this.state.orderToEdit} mode='update' props={this.props} />
                        {/* {buttons} */}
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
                                                        <input id="streetAndNumber" type="text" className="smartform-street-and-number" value={pica} onChange={(e) => this.setState({ streetAndNumberInput: e.target.value })}></input>
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
                                                        <input readOnly id="city" value={orderToEdit.address.city} className="smartform-city"></input>
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
                                                        <input readOnly id="zip" value={orderToEdit.address.psc} className="smartform-zip"></input>
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
                                                <Form.Input fluid value={orderToEdit.address.firstName} name='firstName' onChange={(e, m) => this.handleInputChange(e, m, "address")} />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.25em', paddingBottom: '0.25em' }}>
                                            <Grid.Column width={4}>
                                                <strong>
                                                    Last Name
                                                </strong>
                                            </Grid.Column>
                                            <Grid.Column width={12}>
                                                <Form.Input fluid value={orderToEdit.address.lastName} name='lastName' onChange={(e, m) => this.handleInputChange(e, m, "address")} />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.25em', paddingBottom: '0.25em' }}>
                                            <Grid.Column width={4}>
                                                <strong>
                                                    Phone Number
                                                </strong>
                                            </Grid.Column>
                                            <Grid.Column width={12}>
                                                <Form.Input fluid value={orderToEdit.address.phone} name='phone' onChange={(e, m) => this.handleInputChange(e, m, "address")} />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.25em', paddingBottom: '1em' }}>
                                            <Grid.Column width={4}>
                                                <strong>
                                                    Company
                                                </strong>
                                            </Grid.Column>
                                            <Grid.Column width={12}>
                                                <Form.Input fluid value={orderToEdit.address.company} name='company' onChange={(e, m) => this.handleInputChange(e, m, "address")} />
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
                                            <Form.Input fluid value={orderToEdit.payment.price} name='price' onChange={(e, m) => this.handleInputChange(e, m, "payment")} />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                                        <Grid.Column width={4}>
                                            <strong>
                                                VS
                                            </strong>
                                        </Grid.Column>
                                        <Grid.Column width={12}>
                                            <Form.Input disabled fluid value={orderToEdit.payment.vs} name='price' onChange={(e, m) => this.handleInputChange(e, m, "payment")} />
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
                                                    id={orderToEdit.deliveryType.toLowerCase() === deliveryTypes[0].type ? "primaryButton" : "secondaryButton"}>
                                                    VS
                                            </Button>
                                                <Button.Or text='OR' />
                                                <Button
                                                    onClick={() => this.handleToggleDeliveryButtons("deliveryType", deliveryTypes[1].type)}
                                                    id={orderToEdit.deliveryType.toLowerCase() === deliveryTypes[0].type ? "secondaryButton" : "primaryButton"}>
                                                    Cash
                                            </Button>
                                            </Button.Group>
                                        </Grid.Column>
                                    </Grid.Row>
                                    {
                                        orderToEdit.deliveryType === deliveryTypes[1].type ? (
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
                                                                    id={orderToEdit.deliveryCompany ? (orderToEdit.deliveryCompany.toLowerCase() === deliveryCompanies[0].company ? "primaryButton" : "secondaryButton") : "primaryButton"}>
                                                                    GLS
                                                            </Button>
                                                                <Button.Or text='OR' />
                                                                <Button
                                                                    onClick={() => this.handleToggleDeliveryButtons("deliveryCompany", deliveryCompanies[1].company)}
                                                                    id={orderToEdit.deliveryCompany ? (orderToEdit.deliveryCompany.toLowerCase() === deliveryCompanies[1].company ? "primaryButton" : "secondaryButton") : "secondaryButton"}>
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
                                                                    id={orderToEdit.payment.cashOnDelivery ? "primaryButton" : "secondaryButton"}>
                                                                    Yes
                                                            </Button>
                                                                <Button.Or text='OR' />
                                                                <Button
                                                                    onClick={() => this.handleToggleBankAccountPaymentButtons(true)}
                                                                    id={orderToEdit.payment.cashOnDelivery === true || orderToEdit.payment.cashOnDelivery === undefined ? "primaryButton" : "secondaryButton"}>
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
                                    <Form.Input label='Note' fluid value={orderToEdit.note ? orderToEdit.note : ""} name='note' onChange={(e, m) => this.handleInputChange(e, m)} />
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
        loginPageStore: state.LoginReducer,
        baseStore: state.BaseReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAllProductsAction,
        openOrderDetailsAction,
        showGenericModalAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);