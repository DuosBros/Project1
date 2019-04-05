import React from 'react'
import { Button, Modal, Form, Grid, Dropdown, TextArea } from 'semantic-ui-react';

const AddEditCostModal = (props) => {
    let cost = props.cost && props.cost;
    let content;

    content = (
        <Grid>
            <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                <Grid.Column width={5}>
                    <strong>
                        Description
                    </strong>
                </Grid.Column>
                <Grid.Column width={11}>
                    <Form>
                        <Form.Field>
                            <TextArea value={cost && cost.description} autoHeight rows={1} id="description" />
                        </Form.Field>
                    </Form>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                <Grid.Column width={5}>
                    <strong>
                        Note
                    </strong>
                </Grid.Column>
                <Grid.Column width={11}>
                    <Form>
                        <Form.Field>
                            <TextArea value={cost && cost.note} autoHeight rows={1} id="note" />
                        </Form.Field>
                    </Form>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                <Grid.Column width={5}>
                    <strong>
                        Value [CZK]
                    </strong>
                </Grid.Column>
                <Grid.Column width={11}>
                    <Form.Input fluid id="cost" value={cost && cost.cost} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                <Grid.Column width={5}>
                    <strong>
                        Category
                    </strong>
                </Grid.Column>
                <Grid.Column width={11}>
                    <Dropdown
                        fluid
                        selection
                        onChange={props.handleSenderDropdownChange}
                        options={props.categories}
                        text={cost ? cost.category && cost.category : ""}
                        selectOnBlur={false}
                        selectOnNavigation={false} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )

    return (
        <Modal
            size='small'
            open={props.show}
            closeOnDimmerClick={true}
            closeOnEscape={true}
            closeIcon={true}
            onClose={() => props.handleToggleEditCostModal()}
        >
            <Modal.Header>{cost ? 'Edit cost' : 'Add cost'}</Modal.Header>
            <Modal.Content>
                {content}
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

export default AddEditCostModal;