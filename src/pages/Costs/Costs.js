import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Grid, Header, Message, Icon, Button } from 'semantic-ui-react';
import { getCostsAction } from '../../utils/actions';
import { getCosts } from '../../utils/requests';
import { APP_TITLE } from '../../appConfig';
import ErrorMessage from '../../components/ErrorMessage';
import CostsTable from '../../components/CostsTable';
import moment from 'moment';

class Costs extends React.Component {

    componentDidMount() {
        this.fetchCostsAndHandleResult()

        document.title = APP_TITLE + "Costs"
    }

    fetchCostsAndHandleResult = () => {
        getCosts()
            .then(res => {

                res.data.forEach(x => {
                    x.category = x.category ? x.category : ""
                    x.cost = x.cost ? x.cost : 0
                    x.monthAndYear = moment(x.date).format('MM.YYYY')
                })
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
                <Grid.Row style={{ marginBottom: '1em' }}>
                    <Grid.Column  width={2}>
                        <Header as='h1'>
                            Costs
                        </Header>
                    </Grid.Column>
                    <Grid.Column  width={2} textAlign='left'>
                        <Button fluid size='large' compact content='Add Cost' id="primaryButton" />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
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
