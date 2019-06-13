import React from 'react';
import ErrorMessage from '../components/ErrorMessage';
import { Grid, Header, Message, Icon, Button } from 'semantic-ui-react';
import PurchasesTable from '../components/PurchasesTable';

class Purchases extends React.PureComponent {
    state = {}
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

        if (this.props.isMobile) {

        }
        else {
            return (
                <Grid stackable>
                    <Grid.Row style={{ marginBottom: '1em' }}>
                        <Grid.Column width={2}>
                            <Header as='h1'>
                                Purchases
                            </Header>
                        </Grid.Column>
                        <Grid.Column width={2} textAlign='left'>
                            <Button fluid size='large' compact content='Add Purchase' className="primaryButton" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <PurchasesTable compact="very" rowsPerPage={50} data={this.props.purchases.data} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }

        return (<></>);
    }
}

export default Purchases;