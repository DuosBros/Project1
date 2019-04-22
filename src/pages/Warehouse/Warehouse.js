import React from 'react';

import { Grid, Header, Button, Message, Icon } from 'semantic-ui-react';
import ErrorMessage from '../../components/ErrorMessage';
import { APP_TITLE, LOCALSTORAGE_NAME } from '../../appConfig';
import WarehouseTable from '../../components/WarehouseTable';
import { optionsDropdownMapper } from '../../utils/helpers';
import AddEditProductModal from '../../components/AddEditProductModal';

export default class Warehouse extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            isMobile: this.props.isMobile,
            multiSearchInput: "",
            showFunctionsMobile: false,
            isGroupingEnabled: true,
            showProductModal: false,
            productToEdit: null,
        }

    }
    componentDidMount() {
        document.title = APP_TITLE + "Warehouse"
    }

    handleToggleGrouping = () => {
        this.setState({ isGroupingEnabled: !this.state.isGroupingEnabled });
    }

    handleToggleProductModal = (product) => {
        this.setState({ showProductModal: !this.state.showProductModal, productToEdit: product });
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

        const { isMobile, multiSearchInput, showFunctionsMobile,
            isGroupingEnabled, productToEdit, showProductModal } = this.state
        let modal = null
        if (showProductModal) {
            modal = (
                <AddEditProductModal
                    handleToggleProductModal={this.handleToggleProductModal}
                    show={true}
                    product={productToEdit}
                    categories={this.props.productCategories.map(optionsDropdownMapper)} />
            )
        }

        // render page
        if (isMobile) {

        }
        else {
            return (
                <Grid stackable>
                    {modal}
                    <Grid.Row style={{ marginBottom: '1em' }}>
                        <Grid.Column width={2}>
                            <Header as='h1'>
                                Warehouse
                                </Header>
                        </Grid.Column>
                        <Grid.Column width={2} textAlign='left'>
                            <Button onClick={() => this.handleToggleProductModal()} fluid size='large' compact content='Add Product' id="primaryButton" />
                        </Grid.Column>
                        <Grid.Column width={2} textAlign='left'>
                            <Button onClick={this.handleToggleGrouping} fluid size='large' compact content={isGroupingEnabled ? 'Remove grouping' : 'Add grouping'} id="secondaryButton" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <WarehouseTable
                                handleToggleProductModal={this.handleToggleProductModal}
                                compact="very" isGroupingEnabled={isGroupingEnabled}
                                categories={this.props.productCategories}
                                rowsPerPage={0}
                                data={this.props.products.data}
                                handleDeleteProduct={this.props.handleDeleteProduct} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }
    }
}
