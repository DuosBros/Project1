import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, Table, Message, Image, Icon, Input, Tab, Transition, Segment, Form } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';


class OrderDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bankAccountPayment: false,
            streetAndNumber: "",
            city: "",
            zip: "",
            firstName: "",
            lastName: ""
        }
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    scrollToTop = () => {
        console.log(".")
        // window.scroll(0, 0)
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(this.scrollToTop);
            window.scrollTo(0, currentScroll - (currentScroll / 5));
        }
    }

    render() {
        var grid, isEdit;
        isEdit = this.props.ordersPageStore.orderToEdit ? true : false;
        console.log(this.props.ordersPageStore.orderToEdit)

        if (this.props.isMobile) {
            grid = (
                <Grid stackable>
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
                                        <input className="smartform-street-and-number"></input>
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
                                    <Form.Input label='Delivery Price [CZK]' fluid value={this.state.streetAndNumber} name='streetAndNumber' onChange={this.handleChange} />
                                    <Form.Input label='VS' fluid value={this.state.vs} name='vs' onChange={this.handleChange} />
                                    <Form.Input label='Zip Code' fluid value={this.state.zip} name='zip' onChange={this.handleChange} />
                                    <label><b>Bank account payment</b></label>
                                    <Button.Group style={{ marginTop: '0.5em', marginBottom: '0.5em' }} fluid size='medium'>
                                        <Button onClick={() => this.setState({ bankAccountPayment: !this.state.bankAccountPayment })} id={this.state.bankAccountPayment ? "primaryButton" : "secondaryButton"}>Yes</Button>
                                        <Button.Or text='OR' />
                                        <Button onClick={() => this.setState({ bankAccountPayment: !this.state.bankAccountPayment })} id={this.state.bankAccountPayment ? "secondaryButton" : "primaryButton"} >NO</Button>
                                    </Button.Group>
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns="equal" >
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Products
                                {/* <Button content='Save' /> */}
                            </Header>
                            <Segment attached='bottom'>
                                Test
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Summary
                                {/* <Button content='Save' /> */}
                            </Header>
                            <Segment attached='bottom'>
                                Test
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
                            {/* <Transition animation='drop' duration={500} visible={this.state.showMultiSearchFilter}>
                            <Input
                                style={{ minWidth: '100px' }}
                                ref={this.handleRef}
                                fluid
                                name="multiSearchInput"
                                icon={
                                    <Icon
                                        name={this.state.multiSearchInputValue === "" ? 'search' : 'delete'}
                                        style={{ backgroundColor: '#f20056', color: 'white' }}
                                        circular
                                        link
                                        onClick={this.state.multiSearchInputValue === "" ? () => { } : () => this.handleChange({}, {})} />
                                }
                                placeholder='Search...'
                                onChange={this.handleChange}
                                value={this.state.multiSearchInputValue} />
                        </Transition>
                        {
                            this.state.showMultiSearchFilter ? (
                                null
                            ) : (
                                    <div style={{ textAlign: 'right' }}>
                                        <Icon
                                            name='search'
                                            style={{ backgroundColor: '#f20056', color: 'white' }}
                                            circular
                                            link
                                            onClick={this.showFilter} />
                                    </div>

                                )
                        } */}


                            {/* <Button
                            fluid
                            size="small"
                            onClick={() => this.handleToggleShowPaidOrders()}
                            compact
                            content={showPaidOrders ? 'Hide Paid Orders' : 'Show Paid Orders'}
                            style={{ padding: '0.3em', marginTop: '0.5em' }}
                            id="secondaryButton"
                            icon={showPaidOrders ? 'eye slash' : 'eye'}
                            labelPosition='left' /> */}
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

    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);