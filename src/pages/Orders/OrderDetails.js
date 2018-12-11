import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, Message, Icon, Segment, Form, Dropdown, Divider } from 'semantic-ui-react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { paymentTypes, deliveryCompanies } from '../../appConfig';
import { getAllProductsAction, openOrderDetailsAction } from '../../utils/actions';
import { getAllProducts, getOrder } from '../../utils/requests';

class OrderDetails extends React.Component {
    constructor(props) {
        super(props);

        if (_.isEmpty(props.ordersPageStore.orderToEdit)) {
            getOrder(this.props.match.params.id)
                .then(res => {
                    if (res.data === null) {
                        alert("Could not open order " + this.props.match.params.id);
                        this.props.history.push('/orders')

                    }
                    this.props.openOrderDetailsAction(res.data)
                })
        }

        this.state = {
            bankAccountPayment: null,
            paymentType: null,
            deliveryCompany: null,
            deliveryPrice: 0,
            firstName: "",
            lastName: "",
            company: "",
            phone: "",
            products: null,
            productCounter: null,
            note: "",
            vs: 0,
            deliveryPrice: 0,
            smartformStreetAndNumber: "",
            eraseAddress: false
        }
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.match && this.props.match.params) {
            const params = this.props.match.params;
            if (!_.isEmpty(this.props.ordersPageStore.orderToEdit) && !_.isEmpty(document.getElementById("streetAndNumber"))) {
                document.getElementById("streetAndNumber").value = this.props.ordersPageStore.orderToEdit.address.street + " " + this.props.ordersPageStore.orderToEdit.address.streetNumber
                document.getElementById("city").value = this.props.ordersPageStore.orderToEdit.address.city
                document.getElementById("zip").value = this.props.ordersPageStore.orderToEdit.address.psc
            }
            // if (params.id && params.id !== prevProps.match.params.id) {
            //     if (_.isEmpty(this.props.ordersPageStore.orderToEdit)) {
            //         getOrder(this.props.match.params.id)
            //             .then(res => {
            //                 this.props.openOrderDetailsAction(res.data)
            //             })
            //     }
            // }
        }
    }

    componentDidMount() {


        // setInterval(() => {
        //     window.smartform.rebindAllForms(false);
        // }, 1000)

        // if (document.getElementById("street")) {
        //     document.getElementById("street").value = this.state.streetAndNumber
        // }


        // if (_.isEmpty(this.props.ordersPageStore.orderToEdit)) {
        //     getOrder(this.props.match.params.id)
        //         .then(res => {
        //             this.props.openOrderDetailsAction(res.data)
        //         })
        // }

        getAllProducts()
            .then(res => this.props.getAllProductsAction(res.data))
    }



    handleOnChange = (e, m, product) => {
        this.setState({ productCounter: this.state.productCounter + 1 })
        var found = this.state.products.filter(x => x.index === product.index)
        if (found.length > 0) {
            var newArray = Object.assign([], this.state.products)
            newArray[product.index].name = product.name;
            newArray[product.index].count = product.count;
            newArray[product.index].price = product.price;
            this.setState({ products: newArray });
        }
        else {

            this.setState(() => ({
                products: [...this.state.products,
                {
                    name: m.value,
                    index: product.index,
                    count: product.count,
                    price: product.price
                }]
            }))
        }
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    scrollToTop = () => {
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(this.scrollToTop);
            window.scrollTo(0, currentScroll - (currentScroll / 5));
        }
    }

    getTotalPrice = () => {
        var sum = this.state.deliveryPrice

        if (this.state.products !== null) {
            this.state.products.forEach(product => {
                sum += product.count * product.price
            });
        }
        else {
            sum = this.props.ordersPageStore.orderToEdit.totalPrice
        }

        return sum;
    }

    renderProducts = () => {
        var pica = []
        var counter = 0;
        if (this.state.productCounter === null) {
            counter = this.props.ordersPageStore.orderToEdit.products.length
        }
        else {
            counter = this.state.productCounter
        }

        if (this.state.products === null) {
            for (let i = 0; i < counter; i++) {
                var product = this.props.ordersPageStore.orderToEdit.products[i];

                pica.push(
                    <React.Fragment key={i}>
                        <Form.Field>
                            <Dropdown
                                selection
                                onChange={(e, m) => this.handleOnChange(e, m, { name: m.value, index: i, count: 1, price: this.props.ordersPageStore.products[m.value].price })}
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
                                // onSearchChange={this.handleOnSearchChange}
                                search
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Product Price [CZK]</label>
                            <input value={product.pricePerOne} disabled></input>
                        </Form.Field>
                        <Form.Input
                            label='Product Count'
                            fluid
                            value={product.count}
                            onChange={(e, m) => this.handleOnChange(e, m, {
                                pricePerOne: product.pricePerOne,
                                productName: product.productName,
                                index: i,
                                count: m.value
                            })} />
                        <Form.Field>
                            <label>Total Product Price</label>
                            <input disabled value={product.totalPricePerProduct}></input>
                        </Form.Field>
                        <Divider />
                    </React.Fragment>
                )
            }
        }
        else {
            for (let i = 0; i < counter + 1; i++) {
                pica.push(
                    <React.Fragment key={i}>
                        <Form.Field>
                            <Dropdown
                                selection
                                onChange={(e, m) => this.handleOnChange(e, m, { name: m.value, index: i, count: 1, price: this.props.ordersPageStore.products[m.value].price })}
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
                                // onSearchChange={this.handleOnSearchChange}
                                search
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Product Price [CZK]</label>
                            <input value={this.props.ordersPageStore.products[this.state.products[i].name].price} disabled></input>
                        </Form.Field>
                        <Form.Input
                            label='Product Count'
                            fluid
                            value={this.state.products[i].count}
                            onChange={(e, m) => this.handleOnChange(e, m, {
                                price: this.props.ordersPageStore.products[this.state.products[i].name].price,
                                name: this.state.products[i].name,
                                index: i,
                                count: m.value
                            })} />
                        <Form.Field>
                            <label>Total Product Price</label>
                            <input disabled value={(this.props.ordersPageStore.products[this.state.products[i].name].price * this.state.products[i].count).toString()}></input>
                        </Form.Field>
                        <Divider />
                    </React.Fragment>
                )
            }
        }

        return pica;
    }

    render() {

        var grid;
        console.log(this.props.ordersPageStore.orderToEdit)
        // console.log("products:")
        // console.log(this.state.products)
        // console.log("state")
        // console.log(this.state)
        var orderToEdit;
        if (_.isEmpty(this.props.ordersPageStore.orderToEdit)) {
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
            orderToEdit = this.props.ordersPageStore.orderToEdit
        }

        if (this.props.isMobile) {
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
                                        <input disabled id="city" className="smartform-city"></input>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>ZIP</label>
                                        <input disabled id="zip" className="smartform-zip"></input>
                                    </Form.Field>
                                    <Form.Input label='First Name' fluid value={this.state.firstName === "" ? orderToEdit.address.firstName : this.state.firstName} name='firstName' onChange={this.handleChange} />
                                    <Form.Input label='Last Name' fluid value={this.state.lastName === "" ? orderToEdit.address.lastName : this.state.lastName} name='lastName' onChange={this.handleChange} />
                                    <Form.Input label='Phone Number' fluid value={this.state.phone === "" ? orderToEdit.address.phone : this.state.phone} name='phone' onChange={this.handleChange} />
                                    <Form.Input label='Company' fluid value={this.state.company === "" ? orderToEdit.address.company : this.state.company} name='company' onChange={this.handleChange} />
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Delivery Info
                            </Header>
                            <Segment attached='bottom'>
                                <Form className='form' size='large'>
                                    <Form.Input label='Delivery Price [CZK]' fluid value={this.state.deliveryPrice === 0 ? orderToEdit.payment.price : ""} name='deliveryPrice' onChange={this.handleChange} />
                                    <Form.Input label='VS' fluid value={this.state.vs === 0 ? orderToEdit.payment.vs : ""} name='vs' onChange={this.handleChange} />
                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                        <label><b>Payment type</b></label>
                                        <Button.Group fluid size='medium'>
                                            <Button
                                                onClick={() => this.setState({ paymentType: this.state.paymentType === paymentTypes[0].type ? paymentTypes[1].type : paymentTypes[0].type })}
                                                id={this.state.paymentType === null ? (
                                                    orderToEdit.deliveryType.toLowerCase() === paymentTypes[0].type ? "primaryButton" : "secondaryButton")
                                                    : (
                                                        this.state.paymentType === paymentTypes[0].type ? "primaryButton" : "secondaryButton")
                                                }>
                                                VS
                                            </Button>
                                            <Button.Or text='OR' />
                                            <Button
                                                onClick={() => this.setState({ paymentType: this.state.paymentType === paymentTypes[1].type ? paymentTypes[0].type : paymentTypes[1].type })}
                                                id={this.state.paymentType === null ? (
                                                    orderToEdit.deliveryType.toLowerCase() === paymentTypes[0].type ? "secondaryButton" : "primaryButton")
                                                    : (
                                                        this.state.paymentType === paymentTypes[0].type ? "secondaryButton" : "primaryButton")
                                                }>
                                                Cash
                                            </Button>
                                        </Button.Group>
                                    </div>
                                    {
                                        this.state.paymentType === paymentTypes[1].type ? (
                                            null
                                        ) : (
                                                <>
                                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                                        <label><b>Delivery company</b></label>
                                                        <Button.Group fluid size='medium'>
                                                            <Button
                                                                onClick={() => this.setState({ deliveryCompany: this.state.deliveryCompany === deliveryCompanies[1].company ? deliveryCompanies[0].company : deliveryCompanies[1].company })}
                                                                id={
                                                                    this.state.deliveryCompany === null ? (
                                                                        orderToEdit.deliveryCompany.search(new RegExp(deliveryCompanies[0].company, "i")) >= 0 ? "primaryButton" : "secondaryButton")
                                                                        : (
                                                                            this.state.deliveryCompany.search(new RegExp(deliveryCompanies[0].company, "i")) >= 0 ? "primaryButton" : "secondaryButton")
                                                                }>
                                                                GLS
                                                            </Button>
                                                            <Button.Or text='OR' />
                                                            <Button
                                                                onClick={() => this.setState({ deliveryCompany: this.state.deliveryCompany === deliveryCompanies[1].company ? deliveryCompanies[0].company : deliveryCompanies[1].company })}
                                                                id={
                                                                    this.state.deliveryCompany === null ? (
                                                                        orderToEdit.deliveryCompany.search(new RegExp(deliveryCompanies[1].company, "i")) >= 0 ? "primaryButton" : "secondaryButton")
                                                                        : (
                                                                            this.state.deliveryCompany.search(new RegExp(deliveryCompanies[1].company, "i")) >= 0 ? "primaryButton" : "secondaryButton")
                                                                } >
                                                                Česká Pošta
                                                            </Button>
                                                        </Button.Group>
                                                    </div>
                                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                                        <label><b>Bank account payment</b></label>
                                                        <Button.Group fluid size='medium'>
                                                            <Button
                                                                onClick={() => this.setState({ bankAccountPayment: !this.state.bankAccountPayment })}
                                                                id={
                                                                    this.state.bankAccountPayment === null ? (
                                                                        orderToEdit.payment.bankAccountPayment ? "primaryButton" : "secondaryButton")
                                                                        : (
                                                                            this.state.bankAccountPayment ? "primaryButton" : "secondaryButton")
                                                                }
                                                            >
                                                                Yes
                                                            </Button>
                                                            <Button.Or text='OR' />
                                                            <Button
                                                                onClick={() => this.setState({ bankAccountPayment: !this.state.bankAccountPayment })}
                                                                id={
                                                                    this.state.bankAccountPayment === null ? (
                                                                        orderToEdit.payment.bankAccountPayment ? "secondaryButton" : "primaryButton")
                                                                        : (
                                                                            this.state.bankAccountPayment ? "secondaryButton" : "primaryButton")
                                                                }
                                                            >NO</Button>
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
                                    <Form.Input disabled value={this.getTotalPrice()} />
                                    <Form.Input label='Note' fluid value={this.state.note} name='note' onChange={this.handleChange} />
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
        ordersPageStore: state.OrdersReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAllProductsAction,
        openOrderDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);