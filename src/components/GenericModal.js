import React from 'react';
import { Button, Modal, List } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { closeGenericModalAction } from '../utils/actions';

class GenericModal extends React.Component {

    close = () => {
        this.props.closeGenericModalAction()
        this.props.parentProps.history.push(this.props.redirectTo)
    }
    render() {
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