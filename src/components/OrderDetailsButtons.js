import { Grid, Button, Dropdown } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import React from 'react';
import { handleOrder } from "../pages/Orders/OrdersHelpers";
const OrderDetailsButtons = (props) => {
    return (
        <Grid.Column width={props.isMobile ? 16 : 13} style={{ paddingTop: '1em', paddingBottom: '1em' }}>
            <Button onClick={() => handleOrder(props.order, props.mode, props.props)} fluid={props.isMobile} size='medium' compact content='Save' id="primaryButton" />
            <Button style={{ marginTop: '0.5em' }} fluid={props.isMobile} size='medium' compact content='Save Draft' id="tercialButton" />
            <Link to={{ pathname: '/orders', state: { isFromDetails: true } }}>
                <Button
                    style={{ marginTop: '0.5em' }} id="secondaryButton" fluid={props.isMobile} size='small'
                    compact content='Back'
                />
            </Link>
        </Grid.Column>
    );
}

export default OrderDetailsButtons;