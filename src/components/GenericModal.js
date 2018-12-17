import React from 'react';
import { Button, Modal, Accordion, Icon } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { closeGenericModalAction } from '../utils/actions';

class GenericModal extends React.Component {

    state = { active: false }

    close = () => {
        this.props.closeGenericModalAction()
        if (!_.isEmpty(this.props.redirectTo)) {
            this.props.parentProps.history.push(this.props.redirectTo)
        }
    }

    render() {
        var accordion;

        if (!_.isEmpty(this.props.err)) {
            accordion = (
                <Accordion fluid styled>
                    <Accordion.Title active={this.state.active} onClick={this.setState({ active: this.state.active })}>
                        <Icon name='dropdown' />
                        Error details
                </Accordion.Title>
                    <Accordion.Content active={this.state.active}>
                        <p>
                            {JSON.stringify(this.props.err)}
                        </p>
                    </Accordion.Content>
                </Accordion>
            )
        }
        else {
            accordion = null
        }

        return (
            <Modal
                dimmer={true}
                size='mini'
                open={this.props.show}
                closeOnEscape={true}
                closeIcon={true}
                onClose={() => this.close()}
            >
                <Modal.Header>{this.props.header}</Modal.Header>
                <Modal.Content>
                    {this.props.content}
                    {accordion}
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={() => this.close()}
                        positive
                        labelPosition='right'
                        icon='checkmark'
                        content='Close'
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        headerStore: state.HeaderReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        closeGenericModalAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GenericModal);