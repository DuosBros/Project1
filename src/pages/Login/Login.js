import React from 'react';
import { Button, Form, Grid, Image, Message, Segment } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import logo from '../../assets/logo.png';
import { authenticateAction, authenticationStartedAction, authenticateEndedAction, authenticateOKAction, authenticationFailedAction } from '../../utils/actions'
import { sendAuthenticationData } from '../../utils/requests'

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            authExceptionMessage: "",
            authExceptionResponse: ""
        }
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    auth = () => {
        this.props.authenticationStartedAction();

        var payload = {
            username: this.state.username,
            password: this.state.password
        }

        sendAuthenticationData(payload)
            .then(res => {
                
                this.props.authenticateAction(res.data)
                this.props.authenticateEndedAction();
                this.props.authenticateOKAction();

                this.props.history.push('/orders')
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    this.setState({ authExceptionMessage: 'Wrong username or password' })
                } else {
                    this.setState({ authExceptionMessage: err.message ? err.message : '', authExceptionResponse: err.response ? err.response : '' })
                }

                this.props.authenticationFailedAction();
                this.props.authenticateEndedAction();
            })
    }

    render() {

        var errorMessage

        if (_.isEmpty(this.state.authExceptionMessage) && _.isEmpty(this.state.authExceptionResponse)) {
            errorMessage = (<div></div>)
        }
        else {
            errorMessage = (<Message error floating>
                Failed to log in:
                                <br />
                {this.state.authExceptionMessage}
                {this.state.authExceptionResponse}
            </Message>)
        }
        return (
            // TODO if is mobile then 1 columns otherwise 2
            <Grid stackable centered columns={1}>
                <Grid.Column>
                    {errorMessage}
                    <Image centered size='large' src={logo} fluid/>
                    <Form loading={!(this.props.loginPageStore.authenticationDone)} size='large'>
                        <Segment raised stacked>
                            <Form.Input
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='Username'
                                name='username'
                                onChange={this.handleChange} />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                name='password'
                                onChange={this.handleChange} />
                            <Button
                                onClick={() => this.auth()}
                                style={{ backgroundColor: '#336699' }}
                                primary
                                fluid
                                size='large'
                                content='Login' />
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        loginPageStore: state.LoginReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        authenticateAction: authenticateAction,
        authenticationStartedAction: authenticationStartedAction,
        authenticateEndedAction: authenticateEndedAction,
        authenticateOKAction: authenticateOKAction,
        authenticationFailedAction: authenticationFailedAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);