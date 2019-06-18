import React from 'react';
import ErrorMessage from '../components/ErrorMessage';
import { Grid, Header, Message, Icon, Button } from 'semantic-ui-react';
import PurchasesTable from '../components/PurchasesTable';
import AddEditPurchaseModal from '../components/AddEditPurchaseModal';
import { deletePurchase } from '../utils/requests';


class Purchases extends React.PureComponent {
    state = {
        isPurchaseModalShowing: false
    }

    handleTogglePurchaseModal = (purchaseToEdit) => {
        if (purchaseToEdit) {
            purchaseToEdit.products = JSON.parse(purchaseToEdit.products)
        }

        this.setState({ isPurchaseModalShowing: !this.state.isPurchaseModalShowing, purchaseToEdit });
    }

    render() {

        // in case of error
        if (!this.props.purchases.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Costs
                            </Header>
                            <ErrorMessage error={this.props.purchases.error} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (!this.props.purchases.data) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching purchases</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        let purchaseModal;
        let { isPurchaseModalShowing, purchaseToEdit } = this.state;

        if (isPurchaseModalShowing) {
            purchaseModal = (
                <AddEditPurchaseModal purchase={purchaseToEdit} products={this.props.products} show={isPurchaseModalShowing} handleTogglePurchaseModal={this.handleTogglePurchaseModal} />
            )
        }

        if (this.props.isMobile) {

        }
        else {
            return (
                <Grid stackable>
                    {purchaseModal}
                    <Grid.Row style={{ marginBottom: '1em' }}>
                        <Grid.Column width={2}>
                            <Header as='h1'>
                                Purchases
                            </Header>
                        </Grid.Column>
                        <Grid.Column width={2} textAlign='left'>
                            <Button onClick={() => this.handleTogglePurchaseModal()} fluid size='large' compact content='Add Purchase' className="primaryButton" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <PurchasesTable handleDeletePurchase={this.props.handleDeletePurchase} handleTogglePurchaseModal={this.handleTogglePurchaseModal} compact="very" rowsPerPage={50} data={this.props.purchases.data} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }

        return (<></>);
    }
}

export default Purchases;