import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, Table, Message, Image, Icon, Input, Tab, Transition, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';


class OrderDetails extends React.Component {
    state = {}
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
                            <Button
                                style={{ marginTop: '0.5em' }} id="secondaryButton" fluid size='small'
                                compact content='Back'
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Contact Info
                                {/* <Button content='Save' /> */}
                            </Header>
                            <Segment attached='bottom'>
                                Test
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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