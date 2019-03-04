import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, Icon, Segment, Form, Dropdown, Divider, Table, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { deliveryTypes, deliveryCompanies, LOCALSTORAGE_NAME, DEFAULT_ORDER_LOCK_SECONDS } from '../../appConfig';
import { getAllProductsAction, openOrderDetailsAction } from '../../utils/actions';
import { getAllProducts, verifyLock, lockOrder, getOrder, getHighestVS, saveOrder, createOrder } from '../../utils/requests';
import SimpleTable from '../../components/SimpleTable';
import ProductRow from '../../components/ProductRow';
import { handleVerifyLockError, getGLSDeliveryPrice, contains } from '../../utils/helpers';
import _ from 'lodash';
import moment from 'moment';

const DeliveryCompanyButtonGroup = (props) => {
    return (
        <Button.Group fluid size='medium'>
            <Button
                onClick={() => props.handleToggleDeliveryAndPaymentTypeButtons("deliveryCompany", deliveryCompanies[0].company)}
                id={contains(props.deliveryCompany, deliveryCompanies[0].company) ? "primaryButton" : "secondaryButton"}>
                GLS
            </Button>
            <Button.Or text='OR' />
            <Button
                onClick={() => props.handleToggleDeliveryAndPaymentTypeButtons("deliveryCompany", deliveryCompanies[1].company)}
                id={contains(props.deliveryCompany, deliveryCompanies[1].company) ? "primaryButton" : "secondaryButton"}>
                Česká Pošta
            </Button>
        </Button.Group>
    )
}

const BankAccountPaymentButtonGroup = (props) => {
    return (
        <Button.Group fluid size='medium'>
            <Button
                onClick={() => props.handleToggleBankAccountPaymentButtons(false)}
                id={props.cashOnDelivery ? "secondaryButton" : "primaryButton"}>
                Yes
            </Button>
            <Button.Or text='OR' />
            <Button
                onClick={() => props.handleToggleBankAccountPaymentButtons(true)}
                id={props.cashOnDelivery ? "primaryButton" : "secondaryButton"}>
                NO
            </Button>
        </Button.Group>
    )
}

const PaymentTypeButtonGroup = (props) => {
    return (
        <Button.Group fluid size='medium'>
            <Button
                onClick={() => props.handleToggleDeliveryAndPaymentTypeButtons("deliveryType", deliveryTypes[0].type)}
                id={contains(props.deliveryType, deliveryTypes[0].type) ? "primaryButton" : "secondaryButton"}>
                VS
        </Button>
            <Button.Or text='OR' />
            <Button
                onClick={() => props.handleToggleDeliveryAndPaymentTypeButtons("deliveryType", deliveryTypes[1].type)}
                id={contains(props.deliveryType, deliveryTypes[0].type) ? "secondaryButton" : "primaryButton"}>
                Cash
        </Button>
        </Button.Group>
    )
}

const TotalPriceForm = (props) => {
    return (
        <Form className='form' size='large'>
            <Form.Input defaultValue={props.isEdit ? props.deliveryPrice : null} onChange={() => props.getTotalPrice(false)} label='Delivery Price [CZK]' fluid name='price' id='deliveryPrice' />
            <label><strong>Total price [CZK]</strong></label>
            <input style={{ marginBottom: '0.5em' }} readOnly value={props.totalPrice} ></input>
            <Form.Input defaultValue={props.isEdit ? props.note : null} id='note' label='Note' fluid name='note' />
        </Form>
    )
}

class OrderInfo extends React.Component {
    constructor(props) {
        super(props);

        var hasId = this.props.match.params.id ? true : false
        var isInStore = this.props.ordersPageStore.orderToEdit.data ? true : false
        var isEdit = hasId || isInStore
        console.log("isEdit: ", isEdit)

        this.state = {
            streetAndNumberInput: null,
            isEdit: isEdit,
            isMobile: this.props.isMobile,
            user: localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : "",
            order: isEdit ? this.props.ordersPageStore.orderToEdit.data : {
                address: {},
                state: "active",
                products: [],
                deliveryType: 'VS',
                deliveryCompany: 'GLS',
                totalPrice: 0,
                payment: {
                    price: 0,
                    cashOnDelivery: true
                },
                note: ""
            }
        }
    }

    componentWillUnmount() {
        if (this.state.isEdit) {
            this.props.openOrderDetailsAction({ success: true })
            clearInterval(this.intervalId);
        }

        clearInterval(this.smartformInterval)
        window.smartformReloaded = false

        this.isCancelled = true;
    }

    async componentDidMount() {
        if (!this.props.ordersPageStore.products.data) {
            try {
                var res = await getAllProducts()
                this.props.getAllProductsAction({ success: true, data: res.data })
            }
            catch (err) {
                this.props.getAllProductsAction({ success: false, error: err })
            }
        }

        if (this.state.isEdit) {
            // check if order is locked
            try {
                await verifyLock(this.props.match.params.id, this.state.user)
            }
            catch (err) {
                handleVerifyLockError(this.props, err, this.state.user)
            }

            // if the order to edit is not in store
            // temp needed to set the value of address elements
            let temp;
            if (!this.props.ordersPageStore.orderToEdit.data) {
                temp = await this.getOrderDetails()
            }
            else {
                temp = this.props.ordersPageStore.orderToEdit.data
            }

            // fire immediately after mounting
            await lockOrder(this.props.match.params.id, this.state.user, DEFAULT_ORDER_LOCK_SECONDS)

            this.intervalId = setInterval(() => {
                lockOrder(this.props.match.params.id, this.state.user, DEFAULT_ORDER_LOCK_SECONDS)
            }, DEFAULT_ORDER_LOCK_SECONDS * 1000)

            // mapping for calculating the total delivery price
            temp.products.forEach(x => {
                x.product = this.props.ordersPageStore.products.data[x.productName]
            })
        }

        // run regardless if its add or edit
        this.smartformInterval = setInterval(() => {
            if (window.smartform && !window.smartformReloaded) {
                window.smartformReloaded = true
                window.smartform.rebindAllForms(true);
            }
        }, 5000);
    }

    componentDidUpdate() {
        if (this.state.isEdit && this.state.order && document.getElementById("streetAndNumber")) {
            var temp = this.state.order
            document.getElementById("streetAndNumber").value = temp.address.street + " " + temp.address.streetNumber
            document.getElementById("city").value = temp.address.city ? temp.address.city : ""
            document.getElementById("zip").value = temp.address.psc ? temp.address.psc : ""
            document.getElementById("firstName").value = temp.address.firstName ? temp.address.firstName : ""
            document.getElementById("lastName").value = temp.address.lastName ? temp.address.lastName : ""
            document.getElementById("phone").value = temp.address.phone ? temp.address.phone : ""
            document.getElementById("company").value = temp.address.company ? temp.address.company : ""
            document.getElementById("deliveryPrice").value = temp.payment.price ? temp.payment.price : ""
            document.getElementById("vs").value = temp.payment.vs
        }
    }

    getOrderDetails = async () => {
        try {
            var res = await getOrder(this.props.match.params.id)
            this.setState({ order: res.data });
            this.props.openOrderDetailsAction({ data: res.data, success: true })
            return res.data;
        }
        catch (err) {
            this.props.showGenericModalAction({
                redirectTo: '/orders',
                parentProps: this.props,
                err: err
            })
        }
    }

    handleProductDropdownOnChange = (e, m, i, product) => {
        product.product = this.props.ordersPageStore.products.data[product.productName];
        var temp = this.handleProductDropdownOnChangeHelper(product, this.state.order, i);
        temp.totalPrice = this.getTotalPriceHelper(false, this.state.order);
        if (!this.isCancelled) {
            this.setState(() => ({
                order: temp
            }));
        }
    };

    handleProductDropdownOnChangeHelper = (product, stateOrder, i) => {
        if (_.isNaN(product.count)) {
            product.count = ""
        }

        if (_.isNumber(product.count) || _.isNumber(product.pricePerOne)) {
            product.totalPricePerProduct = product.pricePerOne * product.count
        }
        else {
            product.totalPricePerProduct = ""
        }

        var o = Object.assign({}, stateOrder)
        o.products[i] = product;
        document.getElementById("deliveryPrice").value = getGLSDeliveryPrice(
            o.products.map(x => x.product.weight).reduce((a, b) => a + b, 0))

        return o;
    }

    getTotalPrice = (raw) => {
        var o = Object.assign({}, this.state.order)
        o.totalPrice = this.getTotalPriceHelper(raw, this.state.order);
        this.setState({ order: o });
    }

    getTotalPriceHelper = (raw, orderState) => {
        var sum = 0;

        if (document.getElementById("deliveryPrice")) {
            var parsed = parseInt(document.getElementById("deliveryPrice").value)
            if (!isNaN(parsed)) {
                sum = parsed
            }
        }

        orderState.products.forEach(product => {
            sum += product.count * product.pricePerOne
        });

        if (raw) {
            return sum
        }
        else {
            // adding space after 3 digits
            return sum.toLocaleString('cs-CZ');
        }
    }

    renderProductsForMobile = () => {

        var result = []

        // map existing products
        result = this.state.order.products.map((product, i) => {
            return (
                <React.Fragment key={i}>
                    <ProductRow
                        allProducts={this.props.ordersPageStore.products.data ? this.props.ordersPageStore.products.data : {}}
                        i={i}
                        product={product}
                        handleProductDropdownOnChange={this.handleProductDropdownOnChange} />
                </React.Fragment>
            )
        })

        // add new product
        result.push(
            <React.Fragment key={-1}>
                <Form.Field>
                    <label><Icon name='add' />Product Name</label>
                    <Dropdown
                        selection
                        onChange={(e, m) => this.handleProductDropdownOnChange(
                            null,
                            null,
                            this.state.order.products.length, {
                                productName: m.value,
                                count: 1,
                                pricePerOne: this.props.ordersPageStore.products.data[m.value].price
                            })}
                        options={Object.keys(this.props.ordersPageStore.products.data ? this.props.ordersPageStore.products.data : {}).map(x =>
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

    handleToggleDeliveryAndPaymentTypeButtons = (prop, type) => {
        var temp = this.handleToggleDeliveryButtonsHelper(prop, type, this.state.order);

        this.setState({ order: temp });
    }

    handleToggleDeliveryButtonsHelper = (prop, type, stateOrder) => {
        var o = Object.assign({}, stateOrder)
        if ((prop === "deliveryType" && type === deliveryTypes[0].type) || (prop === "deliveryCompany" && type === deliveryCompanies[0].company)) {
            o.payment.price = getGLSDeliveryPrice(o.products.map(x => x.product.weight).reduce((a, b) => a + b, 0))
        }
        else {
            o.payment.price = 0
        }

        o[prop] = type

        return o;
    }

    handleToggleBankAccountPaymentButtons = (type) => {
        var o = Object.assign({}, this.state.order)
        o.payment.cashOnDelivery = type

        this.setState({ order: o });
    }

    removeProductFromOrder = (index) => {
        var o = Object.assign({}, this.state.order)
        o.products.splice(index, 1);

        this.setState({ order: o });
    }

    // needed to make smartform working
    scrollToTop = () => {
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(this.scrollToTop);
            window.scrollTo(0, currentScroll - (currentScroll / 5));
        }
    }

    handleOrder = async (order, props) => {
        if (contains(order.deliveryType, deliveryTypes[1].type)) {
            delete order.deliveryCompany
            delete order.payment.cashOnDelivery
            delete order.payment.vs
            delete order.payment.price
        }
        else {
            let res = await getHighestVS();
            order.payment.vs = res.data
        }

        order.products.forEach(x => {
            delete x.product
        })

        // TODO: add branch picker
        order.branch = order.branch ? order.branch : "VN"

        order.address.street = document.getElementById("hiddenStreet").value
        order.address.city = document.getElementById("city").value
        order.address.psc = document.getElementById("zip").value
        order.address.streetNumber = document.getElementById("hiddenStreetNumber").value

        order.totalPrice = this.getTotalPriceHelper(true, order);

        order.address.firstName = document.getElementById("firstName").value
        order.address.lastName = document.getElementById("lastName").value
        order.address.phone = document.getElementById("phone").value
        order.address.company = document.getElementById("company").value

        order.payment.price = document.getElementById("deliveryPrice").value ? parseInt(document.getElementById("deliveryPrice").value) : null
        order.note = document.getElementById("note").value

        var user = localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : ""

        if (this.state.isEdit) {
            saveOrder(order, user)
                .then(() => {
                    props.history.push('/orders')
                })
                .catch((err) => {
                    props.showGenericModalAction({
                        header: 'Failed to update order: ' + order.id,
                        parentProps: this.props,
                        err: err
                    })
                })
        }
        else {
            order.payment.orderDate = moment().toISOString()

            createOrder(order, user)
                .then(() => {
                    props.history.push('/orders')
                })
                .catch((err) => {
                    props.showGenericModalAction({
                        header: 'Failed to create order',
                        parentProps: this.props,
                        err: err
                    })
                })
        }
    }

    handleStreetInput = (e) => {
        this.setState({ streetAndNumberInput: e.target.value })
    }

    handleStreetInputOnChange = (e) => {
        console.log("fired");

        this.scrollToTop()
        if (this.state.isEdit) {
            this.handleStreetInput(e);
        }

    }

    render() {
        var grid;
        const { order, isMobile, isEdit } = this.state;

        if (isEdit) {
            if (!this.state.order) {
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
        }

        var headerButtons = (
            <Grid.Column width={isMobile ? null : 13} style={isMobile ? { paddingTop: '1em', paddingBottom: '1em' } : null}>
                <Button onClick={() => this.handleOrder(order, this.props)} fluid={isMobile} size='medium' compact content='Save' id="primaryButton" />
                {/* <Button style={{ marginTop: '0.5em' }} fluid={isMobile} size='medium' compact content='Save Draft' id="tercialButton" /> */}
                <Link to={{ pathname: '/orders', state: { isFromDetails: true } }}>
                    <Button
                        style={{ marginTop: '0.5em' }} id="secondaryButton" fluid={isMobile} size='small'
                        compact content='Back'
                    />
                </Link>
            </Grid.Column>
        )

        if (isMobile) {
            // mobile
            grid = (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                {isEdit ? 'Edit Order' : 'Add Order'}
                            </Header>
                        </Grid.Column>
                        {headerButtons}
                    </Grid.Row>
                    <Grid.Row columns='equal'>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Contact Info
                            </Header>
                            <Segment attached='bottom'>
                                <Form className='form' size='large'>
                                    <Form.Field onClick={this.scrollToTop} >
                                        <label>
                                            Street and number
                                        </label>
                                        {isEdit ?
                                            <input name="nope" id="streetAndNumber" className="smartform-street-and-number" value={
                                                this.state.streetAndNumberInput !== null ? this.state.streetAndNumberInput : order.address.street + " " + order.address.streetNumber
                                            } onChange={(e) => this.handleStreetInputOnChange(e)}></input> :
                                            <input onChange={() => this.handleStreetInputOnChange()} name="nope" id="streetAndNumber" className="smartform-street-and-number"></input>}

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
                                    <Form.Input id='firstName' label='First Name' fluid name='nope' />
                                    <Form.Input id='lastName' label='Last Name' fluid name='nope' />
                                    <Form.Input id='phone' label='Phone Number' fluid name='nope' />
                                    <Form.Input id='company' label='Company' fluid name='nope' />
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Delivery Info
                            </Header>
                            <Segment attached='bottom'>
                                <Form className='form' size='large'>
                                    {isEdit ? (
                                        <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                            <label><strong>VS</strong></label>
                                            <input readOnly id='vs' label='VS' name='vs' />
                                        </div>
                                    ) : null}
                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                        <label><strong>Payment type</strong></label>
                                        <PaymentTypeButtonGroup deliveryType={order.deliveryType} handleToggleDeliveryAndPaymentTypeButtons={this.handleToggleDeliveryAndPaymentTypeButtons} />
                                    </div>
                                    {
                                        contains(order.deliveryType, deliveryTypes[0].type) ? (
                                            <>
                                                <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                                    <label><strong>Delivery company</strong></label>
                                                    <DeliveryCompanyButtonGroup deliveryCompany={order.deliveryCompany} handleToggleDeliveryAndPaymentTypeButtons={this.handleToggleDeliveryAndPaymentTypeButtons} />
                                                </div>
                                                <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                                    <label><strong>Bank account payment</strong></label>
                                                    <BankAccountPaymentButtonGroup handleToggleBankAccountPaymentButtons={this.handleToggleBankAccountPaymentButtons} cashOnDelivery={order.payment.cashOnDelivery} />
                                                </div>
                                            </>
                                        ) : null
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
                                    {this.renderProductsForMobile()}
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Summary
                            </Header>
                            <Segment attached='bottom'>
                                <TotalPriceForm note={order.note} isEdit={isEdit} deliveryPrice={order.payment.price} getTotalPrice={this.getTotalPrice} totalPrice={order.totalPrice} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        {headerButtons}
                    </Grid.Row>
                </Grid >
            )
        }
        // desktop
        else {
            var productsTableColumnProperties = [
                {
                    name: "#",
                    width: 1,
                },
                {
                    name: "Product Name",
                    width: 7,
                },
                {
                    name: "Product Price [CZK]",
                    width: 2,
                },
                {
                    name: "Product Count [Pcs]",
                    width: 2,
                },
                {
                    name: "Total Product Price [CZK]",
                    width: 3,
                },
                {
                    name: "Remove",
                    width: 1,
                }
            ];

            var mappedAllProductsForDropdown = []
            if (this.props.ordersPageStore.products.data) {
                mappedAllProductsForDropdown = Object.keys(this.props.ordersPageStore.products.data).map(x =>
                    ({
                        value: x,
                        text: x
                    })
                )
            }

            var productsTableRow = order.products.map((product, i) => {
                return (
                    <Table.Row key={i} >
                        <Table.Cell collapsing>
                            {i + 1}
                        </Table.Cell>
                        <Table.Cell>
                            <Dropdown
                                selection
                                onChange={(e, m) => this.handleProductDropdownOnChange(
                                    null, null, i,
                                    {
                                        productName: m.value,
                                        count: 1,
                                        pricePerOne: this.props.ordersPageStore.products.data[m.value].price,
                                        product: this.props.ordersPageStore.products.data[m.value]
                                    })}
                                options={mappedAllProductsForDropdown}
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
                                onChange={(e, m) => this.handleProductDropdownOnChange(null, null, i, {
                                    pricePerOne: m.value,
                                    productName: product.productName,
                                    count: product.count
                                })} />
                        </Table.Cell>
                        <Table.Cell collapsing>
                            <Form.Input
                                fluid
                                value={product.count}
                                onChange={(e, m) => this.handleProductDropdownOnChange(null, null, i, {
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
            productsTableRow.push(
                <Table.Row key={-1}>
                    <Table.Cell colSpan={6}>
                        <Dropdown
                            selection
                            onChange={(e, m) => this.handleProductDropdownOnChange(
                                null, null, order.products.length, {
                                    productName: m.value,
                                    count: 1,
                                    pricePerOne: this.props.ordersPageStore.products.data[m.value].price,
                                    product: this.props.ordersPageStore.products.data[m.value]
                                })}
                            options={mappedAllProductsForDropdown}
                            fluid
                            selectOnBlur={false}
                            selectOnNavigation={false}
                            placeholder='Type to search & add...'
                            search
                        />
                    </Table.Cell>
                </Table.Row>
            )

            grid = (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            <Header as='h1'>
                                {isEdit ? 'Edit Order' : 'Add Order'}
                            </Header>
                        </Grid.Column>
                        {headerButtons}
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
                                                        {isEdit ?
                                                            <input name="nope" id="streetAndNumber" className="smartform-street-and-number" value={
                                                                this.state.streetAndNumberInput !== null ? this.state.streetAndNumberInput : order.address.street + " " + order.address.streetNumber
                                                            } onChange={(e) => this.handleStreetInputOnChange(e)}></input> :
                                                            <input onChange={() => this.handleStreetInputOnChange()} name="nope" id="streetAndNumber" className="smartform-street-and-number"></input>}

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
                                    <Grid.Row>
                                        <Grid.Column width={5}>
                                            <strong>
                                                VS
                                            </strong>
                                        </Grid.Column>
                                        <Grid.Column width={10}>
                                            <Form>
                                                <input readOnly id='vs' label='VS' name='vs' />
                                            </Form>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                                        <Grid.Column width={5}>
                                            <strong>
                                                Payment type
                                            </strong>
                                        </Grid.Column>
                                        <Grid.Column width={10}>
                                            <PaymentTypeButtonGroup deliveryType={order.deliveryType} handleToggleDeliveryAndPaymentTypeButtons={this.handleToggleDeliveryAndPaymentTypeButtons} />
                                        </Grid.Column>
                                    </Grid.Row>
                                    {
                                        contains(order.deliveryType, deliveryTypes[0].type) ? (
                                            <>
                                                <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                                                    <Grid.Column width={5}>
                                                        <strong>
                                                            Delivery company
                                                            </strong>
                                                    </Grid.Column>
                                                    <Grid.Column width={10}>
                                                        <DeliveryCompanyButtonGroup deliveryCompany={order.deliveryCompany} handleToggleDeliveryAndPaymentTypeButtons={this.handleToggleDeliveryAndPaymentTypeButtons} />
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
                                                    <Grid.Column width={5}>
                                                        <strong>
                                                            Bank account payment
                                                            </strong>
                                                    </Grid.Column>
                                                    <Grid.Column width={10}>
                                                        <BankAccountPaymentButtonGroup handleToggleBankAccountPaymentButtons={this.handleToggleBankAccountPaymentButtons} cashOnDelivery={order.payment.cashOnDelivery} />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </>
                                        ) : null
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
                                <TotalPriceForm note={order.note} isEdit={isEdit} deliveryPrice={order.payment.price} getTotalPrice={this.getTotalPrice} totalPrice={order.totalPrice} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid >
            )
        }
        return (
            <>
                {grid}
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderInfo);