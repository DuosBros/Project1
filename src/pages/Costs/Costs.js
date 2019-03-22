import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Grid, Header, Message, Icon } from 'semantic-ui-react';
import { getCostsAction } from '../../utils/actions';
import { getCosts } from '../../utils/requests';
import { APP_TITLE } from '../../appConfig';
import ErrorMessage from '../../components/ErrorMessage';
import CostsTable from '../../components/CostsTable';

class Costs extends React.Component {

    componentDidMount() {
        this.fetchCostsAndHandleResult()

        document.title = APP_TITLE + "Virtual Machines"
    }

    fetchCostsAndHandleResult = () => {
        getCosts()
            .then(res => {
                this.props.getCostsAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getCostsAction({ success: false, error: err })
            })
    }

    render() {

        // in case of error
        if (!this.props.costsStore.costs.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Orders
                            </Header>
                            <ErrorMessage handleRefresh={this.fetchCostsAndHandleResult} error={this.props.costsStore.costs.error} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (!this.props.costsStore.costs.data) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching costs</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header as='h1'>
                            Costs
                        </Header>
                        <CostsTable compact="very" rowsPerPage={50} data={this.props.costsStore.costs.data} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )

    }
}

function mapStateToProps(state) {
    return {
        costsStore: state.CostsReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getCostsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Costs);
