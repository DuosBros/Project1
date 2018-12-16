import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, Message, Icon, Segment, Form, Dropdown, Divider, Label } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { deliveryTypes, deliveryCompanies, LOCALSTORAGE_NAME } from '../../appConfig';
import { getAllProductsAction, openOrderDetailsAction } from '../../utils/actions';
import { getAllProducts, getOrder, saveOrder } from '../../utils/requests';

class OrderDetails extends React.Component {
    constructor(props) {
        super(props);

        setInterval(() => {
            window.smartform.rebindAllForms(false);
        }, 1000)
        
        this.state = {
        }

        if (_.isEmpty(props.ordersPageStore.orderToEdit)) {
            getOrder(this.props.match.params.id)
                .then(res => {
                    if (res.data === null) {
                        alert("Could not open order " + this.props.match.params.id);
                        this.props.history.push('/orders')

                    }
                    // TODO implement this
                    if (moment(res.data.lock.timestamp).isAfter(moment())) {
                        console.log("pica")
                        this.props.history.push('/orders')
                    }

                    this.state.orderToEdit = res.data
                    this.props.openOrderDetailsAction(res.data)
                })
        }
        else {
            this.state.orderToEdit = props.ordersPageStore.orderToEdit
        }
    }

    // OK
    componentDidUpdate() {
        if (this.props.match && this.props.match.params) {
            if (!_.isEmpty(this.state.orderToEdit) && !_.isEmpty(document.getElementById("streetAndNumber"))) {
                document.getElementById("streetAndNumber").value = this.state.orderToEdit.address.street + " " + this.state.orderToEdit.address.streetNumber
                document.getElementById("city").value = this.state.orderToEdit.address.city
                document.getElementById("zip").value = this.state.orderToEdit.address.psc
            }
        }
    }

    // OK
    componentDidMount() {
        getAllProducts()
            .then(res => this.props.getAllProductsAction(res.data))
    }

    // OK
    handleProductOnChange = (e, m, i, product) => {

        if (_.isNaN(product.count)) {
            product.count = ""
        }

        if (_.isNumber(product.count) || _.isNumber(product.pricePerOne)) {
            product.totalPricePerProduct = product.pricePerOne * product.count
        }
        else {
            product.totalPricePerProduct = ""
        }

        var o = Object.assign({}, this.state.orderToEdit)
        o.products[i] = product;

        this.setState(() => ({
            orderToEdit: o
        }))
    }

    // OK
    handleInputChange = (e, { name, value }, prop) => {
        var o = Object.assign({}, this.state.orderToEdit)
        if (_.isEmpty(prop)) {
            o[name] = value
        }
        else {
            o[prop][name] = value
        }
        this.setState({ orderToEdit: o });
    }

    // needed to make smartform working
    scrollToTop = () => {
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(this.scrollToTop);
            window.scrollTo(0, currentScroll - (currentScroll / 5));
        }
    }

    // OK
    getTotalPrice = () => {
        var sum = this.state.orderToEdit.payment.price

        this.state.orderToEdit.products.forEach(product => {
            sum += product.count * product.pricePerOne
        });

        return sum;
    }

    // OK
    renderProducts = () => {

        var result = []

        // map existing products
        result = this.state.orderToEdit.products.map((product, i) => {
            return (
                <React.Fragment key={i}>
                    <Form.Field>
                        <label>Product Name</label>
                        <Dropdown
                            selection
                            onChange={(e, m) => this.handleProductOnChange(
                                e, m, i,
                                {
                                    productName: m.value,
                                    count: 1,
                                    pricePerOne: this.props.ordersPageStore.products[m.value].price
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
                    </Form.Field>
                    <Form.Field>
                        <Form.Input
                            label='Product Price [CZK]'
                            fluid
                            value={product.pricePerOne}
                            onChange={(e, m) => this.handleProductOnChange(e, m, i, {
                                pricePerOne: m.value,
                                productName: product.productName,
                                count: product.count
                            })} />
                    </Form.Field>
                    <Form.Input
                        label='Product Count'
                        fluid
                        value={product.count}
                        onChange={(e, m) => this.handleProductOnChange(e, m, i, {
                            pricePerOne: product.pricePerOne,
                            productName: product.productName,
                            count: parseInt(m.value)
                        })} />
                    <Form.Field>
                        <label>Total Product Price</label>
                        <input readOnly value={product.totalPricePerProduct}></input>
                    </Form.Field>
                    <Divider style={{ borderColor: '#f20056' }} />
                </React.Fragment>
            )
        })

        // add new product
        let i = this.state.orderToEdit.products.length + 1;

        result.push(
            <React.Fragment key={i}>
                <Form.Field>
                    <label>Product Name</label>
                    <Dropdown
                        selection
                        onChange={(e, m) => this.handleProductOnChange(e, m, i, { productName: m.value, count: 1, pricePerOne: this.props.ordersPageStore.products[m.value].price })}
                        options={Object.keys(this.props.ordersPageStore.products).map(x =>
                            ({
                                value: x,
                                text: x
                            })
                        )}
                        fluid
                        selectOnBlur={false}
                        selectOnNavigation={false}
                        placeholder='Type to search...'
                        search
                    />
                </Form.Field>
                <Form.Field>
                    <label>Product Price [CZK]</label>
                    <input value="" readOnly></input>
                </Form.Field>
                <Form.Field>
                    <label>Product Count</label>
                    <input value="" readOnly></input>
                </Form.Field>
                <Form.Field>
                    <label>Total Product Price</label>
                    <input readOnly value=""></input>
                </Form.Field>
            </React.Fragment>
        )

        return result;
    }

    handleToggleDeliveryButtons = (prop, type) => {
        this.setState({
            orderToEdit: {
                ...this.state.orderToEdit,
                [prop]: type
            }
        });
    }

    save = (order) => {

        order.address.street = document.getElementById("hiddenStreet").value
        order.address.city = document.getElementById("city").value
        order.address.psc = document.getElementById("zip").value
        order.address.streetNumber = document.getElementById("hiddenStreetNumber").value


        if (order.deliveryType === deliveryTypes[1].type) {
            delete order.deliveryCompany
            delete order.payment.cashOnDelivery
            delete order.payment.vs
            delete order.payment.price
        }

        var user = localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : ""
        saveOrder(order, user)
            .then(() => {
                this.props.history.push('/orders')
            })
            .catch((res) => {
                alert(res)
            })
        // pri cash order smazat cashOnDelivery a deliveryCompany
    }

    handleToggleBankAccountPaymentButtons = (type) => {
        var o = Object.assign({}, this.state.orderToEdit)
        o.payment.cashOnDelivery = type
        this.setState({ orderToEdit: o });
    }

    render() {

        var grid;
        console.log(this.state.orderToEdit)
        console.log("products:")
        console.log(this.state.products)
        console.log("state")
        console.log(this.state)
        var orderToEdit;
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

        if (this.props.isMobile) {
            // mobile
            var buttons = (
                <Grid.Column style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                    <Button onClick={() => this.save(this.state.orderToEdit)} fluid size='medium' compact content='Save' id="primaryButton" />
                    <Button style={{ marginTop: '0.5em' }} fluid size='medium' compact content='Save Draft' id="tercialButton" />
                    <Link to={{ pathname: '/orders', state: { fromDetails: true } }}>
                        <Button
                            style={{ marginTop: '0.5em' }} id="secondaryButton" fluid size='small'
                            compact content='Back'
                        />
                    </Link>
                </Grid.Column>
            )

            grid = (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                {'Edit Order'}
                            </Header>
                        </Grid.Column>
                        {buttons}
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
                                    <input style={{ marginBottom: '0.5em' }} readOnly value={this.getTotalPrice()} ></input>
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
            grid = (
                <Grid>
                    <Grid.Row columns={5} style={{ marginBottom: '1em' }}>
                        <Grid.Column width={2}>
                            <Header as='h1' content="Edit Order" />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button fluid size='medium' compact content='Save' id="primaryButton" />
                            <Button
                                onClick={() => this.props.history.push('/orders')}
                                style={{ marginTop: '0.5em' }} id="secondaryButton" fluid size='small'
                                compact content='Back'
                            />
                        </Grid.Column>
                        <Grid.Column width={5}>
                            {/* {warehouseNotificationsMessage} */}
                        </Grid.Column>
                        <Grid.Column width={4}>
                            {/* {notPaidNotificationsMessage} */}
                        </Grid.Column>
                        <Grid.Column width={3} textAlign='left' floated='right'>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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
        loginPageStore: state.LoginReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAllProductsAction,
        openOrderDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);