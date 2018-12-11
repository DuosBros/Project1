import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, Table, Message, Image, Icon, Input, Tab, Transition, Segment, Form, Dropdown, Divider } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { paymentTypes, deliveryCompanies } from '../../appConfig';
import { getAllProductsAction, openOrderDetailsAction } from '../../utils/actions';
import { getAllProducts } from '../../utils/requests';

class OrderDetails extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            bankAccountPayment: false,
            paymentType: paymentTypes[0].type,
            deliveryCompany: deliveryCompanies[0].company,
            streetAndNumber: "",
            deliveryPrice: 0,
            city: "",
            zip: "",
            firstName: "",
            lastName: "",
            products: [],
            productCounter: 0,
            note: "",
            smartformStreetAndNumber: ""
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match && this.props.match.params) {
            const params = this.props.match.params;
            if (params.id && params.id !== prevProps.match.params.id) {
                if (_.isEmpty(this.props.ordersPageStore.orderToEdit)) {
                    getOrder(this.props.match.params.id)
                    .then(res => {
                        this.props.openOrderDetailsAction(res.data)
                    })
                }
            }
        }
    }


    componentDidMount() {
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

            this.setState(prev => ({
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

        this.state.products.forEach(product => {
            sum += product.count * product.price
        });

        return sum;
    }

    renderProducts = () => {
        var pica = []

        for (let i = 0; i < this.state.productCounter + 1; i++) {
            pica.push(
                <>
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
                        <input value={this.state.products[i] ? this.props.ordersPageStore.products[this.state.products[i].name].price : ""} disabled></input>
                    </Form.Field>
                    <Form.Input label='Product Count' fluid value={this.state.products[i] ? this.state.products[i].count : ""} name='vs' onChange={(e, m) => this.handleOnChange(e, m, { price: this.props.ordersPageStore.products[this.state.products[i].name].price, name: this.state.products[i].name, index: i, count: m.value })} />
                    <Form.Field>
                        <label>Total Product Price</label>
                        <input disabled value={this.state.products[i] ? (this.props.ordersPageStore.products[this.state.products[i].name].price * this.state.products[i].count).toString() : ""}></input>
                    </Form.Field>
                    <Divider />
                </>
            )
        }

        return pica;
    }

    render() {
        var grid;
        console.log(this.props.ordersPageStore.orderToEdit)
        console.log("products:")
        console.log(this.state.products)
        console.log("state")
        console.log(this.state)

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
                                        <label>Street and number</label>
                                        <input

                                            onSelect={() => { console.log(document.getElementById("smartform-street-and-number").value) }}
                                            // value={this.state.smartformStreetAndNumber}
                                            id="smartform-street-and-number"
                                            className="smartform-street-and-number">
                                        </input>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>City</label>
                                        <input disabled name="b" className="smartform-city"></input>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>ZIP</label>
                                        <input disabled name="c" className="smartform-zip"></input>
                                    </Form.Field>
                                    <Form.Input label='First Name' fluid value={this.state.firstName} name='firstName' onChange={this.handleChange} />
                                    <Form.Input label='Last Name' fluid value={this.state.lastName} name='lastName' onChange={this.handleChange} />
                                    <Form.Input label='Phone Number' fluid value={this.state.phoneNumber} name='phoneNumber' onChange={this.handleChange} />
                                    <Form.Input label='Company' fluid value={this.state.company} name='company' onChange={this.handleChange} />
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Delivery Info
                            </Header>
                            <Segment attached='bottom'>
                                <Form className='form' size='large'>
                                    <Form.Input label='Delivery Price [CZK]' fluid value={this.state.deliveryPrice} name='deliveryPrice' onChange={this.handleChange} />
                                    <Form.Input label='VS' fluid value={this.state.vs} name='vs' onChange={this.handleChange} />
                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                        <label><b>Payment type</b></label>
                                        <Button.Group fluid size='medium'>
                                            <Button onClick={() => this.setState({ paymentType: this.state.paymentType === paymentTypes[0].type ? paymentTypes[1].type : paymentTypes[0].type })} id={this.state.paymentType ? "primaryButton" : "secondaryButton"}>VS</Button>
                                            <Button.Or text='OR' />
                                            <Button onClick={() => this.setState({ paymentType: !this.state.paymentType })} id={this.state.paymentType ? "secondaryButton" : "primaryButton"} >Cash</Button>
                                        </Button.Group>
                                    </div>
                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                        <label><b>Delivery company</b></label>
                                        <Button.Group fluid size='medium'>
                                            <Button onClick={() => this.setState({ deliveryCompany: !this.state.deliveryCompany })} id={this.state.deliveryCompany ? "primaryButton" : "secondaryButton"}>GLS</Button>
                                            <Button.Or text='OR' />
                                            <Button onClick={() => this.setState({ deliveryCompany: !this.state.deliveryCompany })} id={this.state.deliveryCompany ? "secondaryButton" : "primaryButton"} >Česká Pošta</Button>
                                        </Button.Group>
                                    </div>
                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                        <label><b>Bank account payment</b></label>
                                        <Button.Group fluid size='medium'>
                                            <Button onClick={() => this.setState({ bankAccountPayment: !this.state.bankAccountPayment })} id={this.state.bankAccountPayment ? "primaryButton" : "secondaryButton"}>Yes</Button>
                                            <Button.Or text='OR' />
                                            <Button onClick={() => this.setState({ bankAccountPayment: !this.state.bankAccountPayment })} id={this.state.bankAccountPayment ? "secondaryButton" : "primaryButton"} >NO</Button>
                                        </Button.Group>
                                    </div>
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
                        <Grid.Column>
                            <Header as='h1'>
                                {isEdit ? 'Edit Order' : 'Add Order'}
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
                </Grid >
            )
        }
        else {
            grid = (
                <Grid>
                    <Grid.Row columns={5} style={{ marginBottom: '1em' }}>
                        <Grid.Column width={2}>
                            <Header as='h1' content={isEdit ? "Edit Order" : "Add Order"} />
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