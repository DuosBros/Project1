import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, Icon, Segment, Form, Dropdown, Divider, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { deliveryTypes, deliveryCompanies, LOCALSTORAGE_NAME } from '../../appConfig';
import { getAllProductsAction, openOrderDetailsAction } from '../../utils/actions';
import { getAllProducts } from '../../utils/requests';
import SimpleTable from '../../components/SimpleTable';
import { handleOrder, handleProductDropdownOnChangeHelper, getTotalPriceHelper, handleToggleDeliveryButtonsHelper, handleToggleBankAccountPaymentButtonsHelper, removeProductFromOrder } from './OrdersHelpers';
import ProductRow from '../../components/ProductRow';

const DeliveryCompanyButtonGroup = (props) => {
    return (
        <Button.Group fluid size='medium'>
            <Button
                onClick={() => props.handleToggleDeliveryAndPaymentTypeButtons("deliveryCompany", deliveryCompanies[0].company)}
                id={props.deliveryCompany === deliveryCompanies[0].company ? "primaryButton" : "secondaryButton"}>
                GLS
            </Button>
            <Button.Or text='OR' />
            <Button
                onClick={() => props.handleToggleDeliveryAndPaymentTypeButtons("deliveryCompany", deliveryCompanies[1].company)}
                id={props.deliveryCompany === deliveryCompanies[1].company ? "primaryButton" : "secondaryButton"}>
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
                id={props.deliveryType === deliveryTypes[0].type ? "primaryButton" : "secondaryButton"}>
                VS
        </Button>
            <Button.Or text='OR' />
            <Button
                onClick={() => props.handleToggleDeliveryAndPaymentTypeButtons("deliveryType", deliveryTypes[1].type)}
                id={props.deliveryType === deliveryTypes[0].type ? "secondaryButton" : "primaryButton"}>
                Cash
        </Button>
        </Button.Group>
    )
}

const TotalPriceForm = (props) => {
    return (
        <Form className='form' size='large'>
            <Form.Input onChange={() => props.getTotalPrice(false)} label='Delivery Price [CZK]' fluid name='price' id='deliveryPrice' />
            <label><strong>Total price [CZK]</strong></label>
            <input style={{ marginBottom: '0.5em' }} readOnly value={props.totalPrice} ></input>
            <Form.Input id='note' label='Note' fluid name='note' />
        </Form>
    )
}

class AddOrder extends React.Component {
    constructor(props) {
        super(props);

        var hasId = this.props.match.params.id ? true : false
        var isInStore = this.props.ordersPageStore.orderToEdit.data ? true : false
        var isEdit = hasId || isInStore
        console.log("isEdit: ", isEdit)

        this.state = {
            isMobile: this.props.isMobile,
            user: localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : "",
            order: {
                address: {},
                state: "active",
                products: [],
                deliveryType: 'VS',
                deliveryCompany: 'GLS',
                totalPrice: 0,
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
        getAllProducts()
            .then(res => {
                this.props.getAllProductsAction({ data: res.data, success: true })
            })
            .catch(err => {
                this.props.getAllProductsAction({ error: err, success: false })
            })

        this.smartformInterval = setInterval(() => {
            if (window.smartform && !window.smartformReloaded) {
                window.smartformReloaded = true
                window.smartform.rebindAllForms(true);
            }
        }, 5000);
    }

    handleProductDropdownOnChange = (e, m, i, product) => {
        product.product = this.props.ordersPageStore.products.data[product.productName]
        var temp = handleProductDropdownOnChangeHelper(
            product, this.state.order, i)

        temp.totalPrice = getTotalPriceHelper(false, this.state.order);

        if (!this.isCancelled) {
            this.setState(() => ({
                order: temp
            }))
        }
    }

    getTotalPrice = (raw) => {
        var o = Object.assign({}, this.state.order)
        o.totalPrice = getTotalPriceHelper(raw, this.state.order);
        this.setState({ order: o });
    }

    renderProductsForMobile = () => {

        var result = []

        // map existing products
        result = this.state.order.products.map((product, i) => {
            return (
                <React.Fragment key={i}>
                    <ProductRow
                        allProducts={this.props.ordersPageStore.products.data}
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
        var temp = handleToggleDeliveryButtonsHelper(prop, type, this.state.order);

        this.setState({ order: temp });
    }

    handleToggleBankAccountPaymentButtons = (type) => {
        var temp = handleToggleBankAccountPaymentButtonsHelper(type, this.state.order);

        this.setState({ order: temp });
    }

    removeProductFromOrder = (index) => {
        var temp = removeProductFromOrder(index, this.state.order);

        this.setState({ order: temp });
    }

    // needed to make smartform working
    scrollToTop = () => {
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(this.scrollToTop);
            window.scrollTo(0, currentScroll - (currentScroll / 5));
        }
    }

    render() {
        var grid;
        const { order, isMobile } = this.state;

        var headerButtons = (
            <Grid.Column width={isMobile ? null : 13} style={isMobile ? { paddingTop: '1em', paddingBottom: '1em' } : null}>
                <Button onClick={() => handleOrder(order, "create", this.props)} fluid={isMobile} size='medium' compact content='Save' id="primaryButton" />
                <Button style={{ marginTop: '0.5em' }} fluid={isMobile} size='medium' compact content='Save Draft' id="tercialButton" />
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
                                Add Order
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
                                        <input name="nope" id="streetAndNumber" className="smartform-street-and-number"></input>
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
                                    <Form.Input id='firstName' label='First Name' fluid name='nope' name='nope' />
                                    <Form.Input id='lastName' label='Last Name' fluid name='lastName' name='nope' />
                                    <Form.Input id='phone' label='Phone Number' fluid name='phone' name='nope' />
                                    <Form.Input id='company' label='Company' fluid name='company' name='nope' />
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Delivery Info
                            </Header>
                            <Segment attached='bottom'>
                                <Form className='form' size='large'>
                                    <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
                                        <label><strong>Payment type</strong></label>
                                        <PaymentTypeButtonGroup deliveryType={order.deliveryType} handleToggleDeliveryAndPaymentTypeButtons={this.handleToggleDeliveryAndPaymentTypeButtons} />
                                    </div>
                                    {
                                        order.deliveryType === deliveryTypes[1].type ? (
                                            null
                                        ) : (
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
                                    {this.renderProductsForMobile()}
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Summary
                            </Header>
                            <Segment attached='bottom'>
                                <TotalPriceForm getTotalPrice={this.getTotalPrice} totalPrice={order.totalPrice} />
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
                                Add Order
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
                                        order.deliveryType === deliveryTypes[1].type ? (
                                            null
                                        ) : (
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
                                <TotalPriceForm getTotalPrice={this.getTotalPrice} totalPrice={order.totalPrice} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AddOrder);