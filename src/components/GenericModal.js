import React from 'react';
import { Button, Modal, Accordion, Icon } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { closeGenericModalAction } from '../utils/actions';

class GenericModal extends React.Component {

    state = { active: false }

    close = () => {
        this.props.closeGenericModalAction()
        if (this.props.redirectTo) {
            this.props.parentProps.history.push(this.props.redirectTo)
        }
    }

    toggleAccordion = () => {
        this.setState({ active: !this.state.active });
    }

    render() {
        var accordion = null;
        const { active } = this.state;

        if (this.props.err) {
            accordion = (
                <Accordion fluid styled>
                    <Accordion.Title active={active} onClick={() => this.toggleAccordion()}>
                        <Icon name='dropdown' />
                        Error details
                </Accordion.Title>
                    <Accordion.Content active={active}>
                        <p>
                            {JSON.stringify(this.props.err)}
                        </p>
                    </Accordion.Content>
                </Accordion>
            )
        }

        return (
            <Modal
                closeOnDimmerClick={false}
                dimmer={true}
                size='mini'
                open={this.props.show}
                closeOnEscape={true}
                closeIcon={true}
                onClose={() => this.close()}
            >
                <Modal.Header>{this.props.header || "Error"}</Modal.Header>
                <Modal.Content>
                    {this.props.content || "Something happened!"}
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        closeGenericModalAction
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(GenericModal);