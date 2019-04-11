import React from 'react';

import { Grid, Header, Button, Message, Icon } from 'semantic-ui-react';
import ErrorMessage from '../../components/ErrorMessage';
import { APP_TITLE, LOCALSTORAGE_NAME } from '../../appConfig';

export default class Warehouse extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            isMobile: this.props.isMobile,
            multiSearchInput: "",
            showFunctionsMobile: false,
            user: localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : ""
        }

    }
    componentDidMount() {
        document.title = APP_TITLE + "Warehouse"
    }

    render() {

        // in case of error
        if (!this.props.products.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Warehouse
                            </Header>
                            <ErrorMessage handleRefresh={this.fetchAndHandleProducts} error={this.props.products.error} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (!this.props.products.data) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching warehouse details</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        const { isMobile, multiSearchInput, showFunctionsMobile } = this.state

        // render page
        if (isMobile) {

        }
        else {
            return (
                <Grid stackable>
                    <Grid.Row style={{ marginBottom: '1em' }}>
                        <Grid.Column width={2}>
                            <Header as='h1'>
                                Warehouse
                                </Header>
                        </Grid.Column>
                        <Grid.Column width={2} textAlign='left'>
                            <Button fluid size='large' compact content='Add Product' id="primaryButton" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {/* <CostsTable handleToggleEditCostModal={this.handleToggleEditCostModal} handleDeleteCost={this.handleDeleteCost} compact="very" rowsPerPage={50} data={filteredByMultiSearch} /> */}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }
    }
}
