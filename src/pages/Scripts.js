import React from 'react';
import { Grid, Header, Form, Button, Input } from 'semantic-ui-react';
import Flatpickr from 'react-flatpickr';
import '../../node_modules/flatpickr/dist/themes/dark.css';

class Scripts extends React.PureComponent {
    state = {}

    handleFlatpickr = (event, m, c) => {
        this.setState({ [c.element.className.split(" ")[0]]: event[0] });
    }

    render() {
        return (
            <Grid stackable>
                <Grid.Row style={{ marginBottom: '1em' }}>
                    <Grid.Column width={2}>
                        <Header as='h1'>
                            Scripts
                    </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns="equal">
                    <Grid.Column>
                        <Header as='h3' content="Export By VS" />
                        <Input placeholder='VS' />
                        <Button content="Export" />
                    </Grid.Column>
                    <Grid.Column>
                        <Header as='h3' content="Expire Order" />
                        <Input placeholder='VS' />
                        <Button content="Expire" />
                    </Grid.Column>

                </Grid.Row>
                <Grid.Row columns="equal">
                    <Grid.Column>
                        <Header as='h3' content="Export And Replace Cash Orders" />
                        <Form>
                            <Form.Field>
                                From:
                            <Flatpickr
                                    className="exportCashOrdersFrom"
                                    onChange={this.handleFlatpickr}
                                    options={{ dateFormat: 'd.m.Y', disableMobile: true }} />
                            </Form.Field>
                            <Form.Field>
                                To:
                            <Flatpickr
                                    className="exportCashOrdersFrom"
                                    onChange={this.handleFlatpickr}
                                    options={{ dateFormat: 'd.m.Y', disableMobile: true }} />
                            </Form.Field>
                            <Input  placeholder="First Name" />
                            <Input placeholder="Last Name" />
                            <Input placeholder="Street Name" />
                            <Input placeholder="Street Number" />
                            <Input placeholder="City" />
                            <Input placeholder="ZIP" />
                            <Input placeholder="Phone" />
                            <Form.Field>
                                <Button content="Export" />
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as='h3' content="Export Orders" />
                        <Form>
                            <Form.Field>
                                From:
                            <Flatpickr
                                    className="exportOrdersFrom"
                                    onChange={this.handleFlatpickr}
                                    options={{ dateFormat: 'd.m.Y', disableMobile: true }} />
                            </Form.Field>
                            <Form.Field>
                                To:
                            <Flatpickr
                                    className="exportOrdersTo"
                                    onChange={this.handleFlatpickr}
                                    options={{ dateFormat: 'd.m.Y', disableMobile: true }} />
                            </Form.Field>
                            <Button content="Export" />
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns="equal">
                    <Grid.Column>
                        <Header as='h3' content="Add Sender" />
                    </Grid.Column>
                    <Grid.Column>
                        <Header as='h3' content="Add User" />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Scripts;