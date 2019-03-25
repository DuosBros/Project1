import React from 'react'
import { Button, Modal, Form } from 'semantic-ui-react';

const EditCostModal = (props) => {
    return (
        <Modal
            size='large'
            open={props.show}
            closeOnDimmerClick={true}
            closeOnEscape={true}
            closeIcon={true}
            onClose={() => props.handleToggleEditCostModal()}
        >
            <Modal.Header>Edit cost</Modal.Header>
            <Modal.Content>
                <Form>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    onClick={() => props.handleToggleEditCostModal()}
                    positive
                    labelPosition='right'
                    icon='checkmark'
                    content='OK'
                />
                <Button
                    onClick={() => props.handleToggleEditCostModal()}
                    labelPosition='right'
                    icon='checkmark'
                    content='Close'
                />
            </Modal.Actions>
        </Modal>
    )
}

export default EditCostModal;