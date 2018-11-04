import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Button, FormInput } from 'semantic-ui-react';

import { getCurrentYearOrders } from '../../utils/requests';
import { getOrdersAction } from '../../utils/actions';

class Orders extends React.Component {

    constructor(props) {
        super(props);

        getCurrentYearOrders()
            .then(res => {
                this.props.getOrdersAction(res.data)
            })
    }
    render() {
        console.log(this.props.ordersPageStore.orders)
        return (
            <Grid stackable>
                <Grid.Row columns={5}>
                    <Grid.Column width={2}>
                        <Header as='h1' content='Orders' />
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Button fluid  compact content='Add Order' primary />
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Button fluid compact content='Print Labels' />
                    </Grid.Column>
                    <Grid.Column>
                        Warning
                    </Grid.Column>
                    <Grid.Column floated='right'>
                        <FormInput fluid></FormInput>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
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
        getOrdersAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);