import React from 'react';
import { Button, Modal } from 'semantic-ui-react';

class CreateZaslatModal extends React.PureComponent {

    close = () => {
        this.props.closeCreateZaslatModal()
    }

    render() {
        return (
            <Modal
                closeOnDimmerClick={false}
                dimmer={true}
                size='large'
                open={this.props.show}
                closeOnEscape={true}
                closeIcon={true}
                onClose={() => this.close()}
            >
                <Modal.Header>Send to Zaslat</Modal.Header>
                <Modal.Content>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={() => this.close()}
                        labelPosition='right'
                        icon='checkmark'
                        content='Close'
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

export default CreateZaslatModal;