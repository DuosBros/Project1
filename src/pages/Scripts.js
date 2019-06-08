import React from 'react';
import { Grid, Header, Form, Button, Input } from 'semantic-ui-react';
import Flatpickr from 'react-flatpickr';
import '../../node_modules/flatpickr/dist/themes/dark.css';

class Scripts extends React.PureComponent {
    state = {
        isExportCashOrdersRunning: false,
        isExportOrdersRunning: false,
        isExportByVsRunning: false,
        isExpireByVsRunning: false
    }

    handleFlatpickr = (event, m, c) => {
        this.setState({ [c.element.className.split(" ")[0]]: event[0] });
    }

    handleExportCashOrders = async () => {
        this.setState({ isExportCashOrdersRunning: true });
        let { firstName, lastName, streetName, streetNumber, city, zip, phone } = this.state

        let customerInfo = {
            firstName,
            lastName,
            streetName,
            streetNumber,
            city,
            zip,
            phone
        }

        let from = this.state.exportCashOrdersFrom.toISOString()
        let to = this.state.exportCashOrdersTo.toISOString()
        try {
            await this.props.handleExportCashOrders(from, to, customerInfo)
        } catch (error) {
            this.setState({ error });
        }
        finally {
            this.setState({ isExportCashOrdersRunning: false });
        }
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    handleExportOrders = async () => {
        this.setState({ isExportOrdersRunning: true });
        let from = this.state.exportOrdersFrom.toISOString()
        let to = this.state.exportOrdersTo.toISOString()
        try {
            await this.props.handleExportOrders(from, to)
        } catch (error) {
            this.setState({ error });
        }
        finally {
            this.setState({ isExportOrdersRunning: false });
        }
    }

    handleExportByVs = async () => {
        this.setState({ isExportByVsRunning: true });
        try {
            await this.props.handleExportByVs(this.state.exportByVs)
        } catch (error) {
            this.setState({ error });
        }
        finally {
            this.setState({ isExportByVsRunning: false });
        }
    }

    handleExpireByVs = async () => {
        this.setState({ isExpireByVsRunning: true });
        try {
            await this.props.handleExpireByVs(this.state.expireByVs)
        } catch (error) {
            this.setState({ error });
        }
        finally {
            this.setState({ isExpireByVsRunning: false });
        }
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
                <Grid.Row>
                    <Grid.Column width={5}>
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
                            <Input onChange={this.handleChange} name="firstName" placeholder="First Name" />
                            <Input onChange={this.handleChange} name="lastName" placeholder="Last Name" />
                            <Input onChange={this.handleChange} name="streetName" placeholder="Street Name" />
                            <Input onChange={this.handleChange} name="streetNumber" placeholder="Street Number" />
                            <Input onChange={this.handleChange} name="city" placeholder="City" />
                            <Input onChange={this.handleChange} name="zip" placeholder="ZIP" />
                            <Input onChange={this.handleChange} name="phone" placeholder="Phone" />
                            <Form.Field>
                                <Button
                                    onClick={this.handleExportCashOrders}
                                    loading={this.state.isExportCashOrdersRunning}
                                    primary
                                    content="Export" />
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={3}>
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
                            <Button onClick={this.handleExportOrders} loading={this.state.isExportOrdersRunning} primary content="Export" />
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Header as='h3' content="Export By VS" />
                        <Input onChange={this.handleChange} name="exportByVs" placeholder='VS' />
                        <Button loading={this.state.isExportByVsRunning} onClick={this.handleExportByVs} primary content="Export" />
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Header as='h3' content="Expire Order" />
                        <Input onChange={this.handleChange} name="expireByVs" placeholder='VS' />
                        <Button loading={this.state.isExpireByVsRunning} onClick={this.handleExpireByVs} primary content="Expire" />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Scripts;