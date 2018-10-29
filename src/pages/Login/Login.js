import React from 'react';
import { Button, Form, Grid, Image, Message, Segment } from 'semantic-ui-react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import logo from '../../assets/logo.png';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        }
    }

    render() {
        return (
            <Grid columns={3} stackable>
                <Grid.Column width='4'></Grid.Column>
                <Grid.Column width='8'>
                    <Image centered size='large' src={logo} />
                    <Form loading={!(this.props.loginPageStore.loginDone || this.props.loginPageStore.loginInitialDataDone)} size='large'>
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
                <Grid.Column width='4'></Grid.Column>
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
        // loginStartedAction: loginStartedAction,
        // loginEndedAction : loginEndedAction,
        // loginFailedAction : loginFailedAction,
        // loginSuccessAction : loginSuccessAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);