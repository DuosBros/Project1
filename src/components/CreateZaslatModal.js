import React from 'react';
import { Button, Modal, Grid, Segment, Header, Form, Popup, Icon, Divider, TextArea, Dropdown, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllProducts, getSenders } from '../utils/requests';
import { getAllProductsAction, getSendersAction, showGenericModalAction } from '../utils/actions';

const SenderDropdown = (props) => {
    return (
        <Dropdown
            fluid
            selection
            onChange={props.handleSenderDropdownChange}
            options={props.senders ? props.senders : []}
            text={props.currentSender ? props.currentSender.label : null}
            selectOnBlur={false}
            selectOnNavigation={false} />
    )
}
class CreateZaslatModal extends React.PureComponent {

    state = {
        isMobile: this.props.isMobile,
        sender: null
    }
    async componentDidMount() {
        getSenders()
            .then(res => {
                this.props.getSendersAction({ success: true, data: res.data.map(e => ({ text: e.label, value: e.id, obj: e })) })
                this.setState({ sender: res.data[2] });
            })
            .catch(err => {
                this.props.getSendersAction({ success: true, error: err })
            })

        var products = []
        var temp = this.props.order
        if (!this.props.ordersPageStore.products.data) {
            try {
                products = await getAllProducts()
                this.props.getAllProductsAction({ success: true, data: products.data })
            }
            catch (err) {
                this.props.getAllProductsAction({ success: false, error: err })
                this.props.showGenericModalAction({
                    redirectTo: '/orders',
                    parentProps: this.props,
                    err: err
                })
            }
        }

        // setting default values and order specific values
        document.getElementById("width").value = 20
        document.getElementById("height").value = 20
        document.getElementById("length").value = 20
        document.getElementById("weight").value = this.props.totalWeight

        document.getElementById("bankAccountPayment").value = temp.payment.cashOnDelivery ? "No" : "Yes"
        document.getElementById("totalPrice").value = temp.totalPrice
        document.getElementById("note").value = "POZOR: Prosím před příjezdem zavolejte příjemci na tel. " + temp.address.phone + ". V případě problému, volejte odesílateli."

        document.getElementById("streetCustomer").value = temp.address.street
        document.getElementById("streetNumberCustomer").value = temp.address.streetNumber
        document.getElementById("cityCustomer").value = temp.address.city ? temp.address.city : ""
        document.getElementById("zipCustomer").value = temp.address.psc ? temp.address.psc : ""
        document.getElementById("firstNameCustomer").value = temp.address.firstName ? temp.address.firstName : ""
        document.getElementById("lastNameCustomer").value = temp.address.lastName ? temp.address.lastName : ""
        document.getElementById("phoneCustomer").value = temp.address.phone ? temp.address.phone : ""
        document.getElementById("companyCustomer").value = temp.address.company ? temp.address.company : ""
    }
    handleSenderDropdownChange = (e, { value }) => {
        var senders = this.props.zaslatStore.senders
        this.setState({ sender: senders.data.find(x => x.value === value).obj });
    }
    close = () => {
        this.props.closeCreateZaslatModal()
    }

    render() {
        let { isMobile } = this.state
        var popupContentTable, popup, modalContent, packageSegment, deliverySegment,
            customerSegment, senderSegment = null

        if (this.props.ordersPageStore.products.data) {
            popupContentTable = this.props.order.products.map(
                (product, i) => {
                    return (
                        <Grid.Row key={i} className="noPaddingTopAndBottom">
                            <Grid.Column width={9} style={{ fontSize: '0.8em' }}>
                                {product.productName}
                            </Grid.Column>
                            <Grid.Column width={1} style={{ fontSize: '0.8em', paddingLeft: '0px', paddingRight: '0px', maxWidth: '85px' }}>
                                {product.count}
                            </Grid.Column>
                            <Grid.Column width={3} style={{ fontSize: '0.8em' }}>
                                {this.props.ordersPageStore.products.data[product.productName].weight}
                            </Grid.Column>
                            <Grid.Column width={3} style={{ fontSize: '0.8em' }}>
                                <strong>{this.props.ordersPageStore.products.data[product.productName].weight * product.count}</strong>
                            </Grid.Column>
                        </Grid.Row>
                    );
                })

            popupContentTable.push(
                <React.Fragment key={this.props.order.products.length + 1}>
                    <Grid.Row className="noPaddingTopAndBottom">
                        <Grid.Column width={9} style={{ fontSize: '0.8em' }}>
                            Packaging
                            </Grid.Column>
                        <Grid.Column width={1} style={{ fontSize: '0.8em', paddingLeft: '0px', paddingRight: '0px', maxWidth: '85px' }}>
                        </Grid.Column>
                        <Grid.Column width={3} style={{ fontSize: '0.8em' }}>
                        </Grid.Column>
                        <Grid.Column width={3} style={{ fontSize: '0.8em' }}>
                            <strong>500</strong>
                        </Grid.Column>
                    </Grid.Row>
                    <Divider className="marginTopAndBottomSmall" />
                    <Grid.Row>
                        <Grid.Column width={9}>
                            <strong>Total</strong>
                        </Grid.Column>
                        <Grid.Column width={1} style={{ paddingLeft: '0px', paddingRight: '0px', maxWidth: '85px' }}>
                        </Grid.Column>
                        <Grid.Column width={3}>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <strong>{this.props.totalWeight * 1000}</strong>
                        </Grid.Column>
                    </Grid.Row>
                </React.Fragment>
            )

            popup = (
                <Popup
                    hoverable={isMobile ? false : true}
                    size={isMobile ? 'tiny' : 'large'}
                    wide={isMobile ? false : true}
                    position={isMobile ? 'top right' : 'bottom left'}
                    trigger={<Icon name="question" />}
                    inverted
                    on={isMobile ? 'click' : 'hover'}  >
                    <Popup.Content>
                        Weight of package - Automatically calculated based on products.
                                                    <Divider />
                        <br />
                        <Grid>
                            <Grid.Row style={{ fontWeight: 'bold', fontSize: '0.8em', paddingTop: '0px', paddingBottom: '0px' }}>
                                <Grid.Column width={9} >
                                    Product
                                                            </Grid.Column>
                                <Grid.Column width={1} style={{ paddingLeft: '0px', paddingRight: '0px', maxWidth: '85px' }}>
                                    #
                                                            </Grid.Column>
                                <Grid.Column width={3} style={{ fontSize: '0.8em' }}>
                                    {isMobile ? 'WpU [gr]' : 'Weight/Unit [gr]'}
                                </Grid.Column>
                                <Grid.Column width={3} style={{ bottom: '0.25em' }}>
                                    Sum [gr]
                                                            </Grid.Column>
                            </Grid.Row>
                            {popupContentTable}
                        </Grid>
                    </Popup.Content>
                </Popup>
            )
        }

        if (isMobile) {
            packageSegment = (
                <Form>
                    <Form.Field>
                        <label>Width [cm]</label>
                        <input id="width" ></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Height [cm]</label>
                        <input id="height" ></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Length [cm]</label>
                        <input id="length" ></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Weight [kg] {popup}</label>
                        <input id="weight" ></input>
                    </Form.Field>
                </Form>
            )

            deliverySegment = (
                <Form>
                    <Form.Field>
                        <label>Note to Zaslat</label>
                        <TextArea autoHeight rows={2} id="note" />
                    </Form.Field>
                    <Form.Field>
                        <label>Bank account payment</label>
                        <input readOnly id="bankAccountPayment" ></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Total price [CZK]</label>
                        <input readOnly id="totalPrice" ></input>
                    </Form.Field>
                </Form>
            )

            customerSegment = (
                <Form className='form' size='large'>
                    <Form.Field>
                        <label>
                            Street
                                        </label>
                        <input readOnly id="streetCustomer" />
                    </Form.Field>

                    <Form.Field>
                        <label>Street number</label>
                        <input readOnly id="streetNumberCustomer"></input>
                    </Form.Field>
                    <Form.Field>
                        <label>City</label>
                        <input readOnly id="cityCustomer"></input>
                    </Form.Field>
                    <Form.Field>
                        <label>ZIP</label>
                        <input readOnly id="zipCustomer"></input>
                    </Form.Field>
                    <Form.Field>
                        <label>First Name</label>
                        <input readOnly id="firstNameCustomer"></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Last Name</label>
                        <input readOnly id="lastNameCustomer"></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Phone</label>
                        <input readOnly id="phoneCustomer"></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Company</label>
                        <input readOnly id="companyCustomer"></input>
                    </Form.Field>
                </Form>
            )

            if (this.state.sender) {
                senderSegment = (
                    <Form>
                        <SenderDropdown
                            handleSenderDropdownChange={this.handleSenderDropdownChange}
                            senders={this.props.zaslatStore.senders.data}
                            currentSender={this.state.sender} />
                        <Form.Field>
                            <label>
                                Street
                            </label>
                            <input value={this.state.sender.street} readOnly id="streetSender" />
                        </Form.Field>
                        <Form.Field>
                            <label>Street number</label>
                            <input value={this.state.sender.street_number} readOnly id="streetNumberSender"></input>
                        </Form.Field>
                        <Form.Field>
                            <label>City</label>
                            <input value={this.state.sender.city} readOnly id="citySender"></input>
                        </Form.Field>
                        <Form.Field>
                            <label>ZIP</label>
                            <input value={this.state.sender.zip} readOnly id="zipSender"></input>
                        </Form.Field>
                        <Form.Field>
                            <label>First Name</label>
                            <input value={this.state.sender.firstname} readOnly id="firstNameSender"></input>
                        </Form.Field>
                        <Form.Field>
                            <label>Last Name</label>
                            <input value={this.state.sender.lastname} readOnly id="lastNameSender"></input>
                        </Form.Field>
                        <Form.Field>
                            <label>Phone</label>
                            <input value={this.state.sender.phone_number} readOnly id="phoneSender"></input>
                        </Form.Field>
                        <Form.Field>
                            <label>Company</label>
                            <input value={this.state.sender.company} readOnly id="companySender"></input>
                        </Form.Field>
                    </Form>
                )
            }

        }
        else {
            packageSegment = (
                <Grid>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={2}>
                            <strong>
                                Width [cm]
                                        </strong>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Form.Input fluid id="width" />
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <strong>
                                Total price [CZK]
                                        </strong>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Input disabled fluid id="totalPrice" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={2}>
                            <strong>
                                Height [cm]
                                        </strong>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Form.Input fluid id="height" />
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <strong>
                                Bank account payment
                                        </strong>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Input disabled fluid id="bankAccountPayment" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={2}>
                            <strong>
                                Length [cm]
                                        </strong>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Form.Input fluid id="length" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={2}>
                            <strong>
                                Weight [kg]
                                            {popup}
                            </strong>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Form.Input fluid id="weight" />
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <strong>
                                Note to Zaslat
                                        </strong>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form>
                                <TextArea autoHeight rows={2} id="note" />
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )

            customerSegment = (
                <Grid>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={5}>
                            <strong>
                                Street
                                                </strong>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Form.Input disabled fluid id="streetCustomer" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={5}>
                            <strong>
                                Street number
                                                </strong>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Form.Input disabled fluid id="streetNumberCustomer" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={5}>
                            <strong>
                                City
                                                </strong>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Form.Input disabled fluid id="cityCustomer" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={5}>
                            <strong>
                                ZIP
                                                </strong>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Form.Input disabled fluid id="zipCustomer" />
                        </Grid.Column>
                    </Grid.Row>
                    <Divider />
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={5}>
                            <strong>
                                First Name
                                                </strong>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Form.Input disabled fluid id="firstNameCustomer" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={5}>
                            <strong>
                                Last Name
                                                </strong>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Form.Input id='lastNameCustomer' disabled fluid />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={5}>
                            <strong>
                                Phone Number
                                                </strong>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Form.Input id='phoneCustomer' disabled fluid />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.25em', paddingBottom: '1em' }}>
                        <Grid.Column width={5}>
                            <strong>
                                Company
                                                </strong>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Form.Input id='companyCustomer' disabled fluid />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )

            if (this.state.sender) {
                senderSegment = (
                    <Grid>
                        <Grid.Row className="paddingTopAndBottomSmall">
                            <Grid.Column width={16}>
                                <SenderDropdown
                                    handleSenderDropdownChange={this.handleSenderDropdownChange}
                                    senders={this.props.zaslatStore.senders.data}
                                    currentSender={this.state.sender} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                            <Grid.Column width={5}>
                                <strong>Street</strong>
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <Form.Input value={this.state.sender.street} disabled fluid id="streetSender" />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                            <Grid.Column width={5}>
                                <strong>Street number</strong>
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <Form.Input value={this.state.sender.street_number} disabled fluid id="streetNumberSender" />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                            <Grid.Column width={5}>
                                <strong>City</strong>
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <Form.Input value={this.state.sender.city} disabled fluid id="citySender" />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                            <Grid.Column width={5}>
                                <strong>ZIP</strong>
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <Form.Input value={this.state.sender.zip} disabled fluid id="zipSender" />
                            </Grid.Column>
                        </Grid.Row>
                        <Divider />
                        <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                            <Grid.Column width={5}>
                                <strong>First Name</strong>
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <Form.Input value={this.state.sender.firstname} disabled fluid id="firstNameSender" />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                            <Grid.Column width={5}>
                                <strong>Last Name</strong>
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <Form.Input value={this.state.sender.lastname} id='lastNameSender' disabled fluid />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                            <Grid.Column width={5}>
                                <strong>Phone Number</strong>
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <Form.Input value={this.state.sender.phone_number} id='phoneSender' disabled fluid />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row verticalAlign='middle' style={{ paddingTop: '0.25em', paddingBottom: '1em' }}>
                            <Grid.Column width={5}>
                                <strong>Company</strong>
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <Form.Input value={this.state.sender.company} id='companySender' disabled fluid />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
            }
            else {
                senderSegment = (
                    <Message positive icon >
                        <Icon name='circle notched' loading />
                        <Message.Content content={
                            <Message.Header>Fetching senders</Message.Header>
                        }>
                        </Message.Content>
                    </Message>
                )
            }
        }

        modalContent = (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Package info
                        </Header>
                        <Segment attached='bottom' >
                            {packageSegment}
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                {isMobile ? (
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Delivery info
                        </Header>
                            <Segment attached='bottom' >
                                {deliverySegment}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                ) : null}
                <Grid.Row columns='equal'>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Customer info
                        </Header>
                        <Segment attached='bottom' >
                            {customerSegment}
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Sender info
                        </Header>
                        <Segment attached='bottom' >
                            {senderSegment}
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        )

        return (
            <Modal
                closeOnDimmerClick={false}
                dimmer={true}
                size='large'
                open={this.props.show}
                closeOnEscape={true}
                onClose={() => this.close()}
            >
                {isMobile ? (
                    <Modal.Actions>
                        <Button
                            fluid
                            onClick={() => this.orderDelivery()}
                            labelPosition='right'
                            positive
                            icon='checkmark'
                            content='Export'
                        />
                        <Button
                            fluid
                            onClick={() => this.close()}
                            labelPosition='right'
                            icon='close'
                            content='Close'
                        />
                    </Modal.Actions>
                ) : null}
                <Modal.Header>
                    Send to Zaslat
                </Modal.Header>
                <Modal.Content>
                    {modalContent}
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        fluid={isMobile ? true : false}
                        onClick={() => this.orderDelivery()}
                        labelPosition='right'
                        positive
                        icon='checkmark'
                        content='Export'
                    />
                    <Button
                        fluid={isMobile ? true : false}
                        onClick={() => this.close()}
                        labelPosition='right'
                        icon='close'
                        content='Close'
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        ordersPageStore: state.OrdersReducer,
        zaslatStore: state.ZaslatReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAllProductsAction,
        getSendersAction,
        showGenericModalAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateZaslatModal);