import React from 'react';
import { Button, Modal, Grid, Segment, Header, Form, Popup, Icon, Divider, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllProducts } from '../utils/requests';
import { getAllProductsAction } from '../utils/actions';

class CreateZaslatModal extends React.PureComponent {

    state = {
        isMobile: this.props.isMobile
    }
    async componentDidMount() {
        var products = []
        if (!this.props.ordersPageStore.products.data) {
            try {
                products = await getAllProducts()
                this.props.getAllProductsAction({ success: true, data: products.data })
            }
            catch (err) {
                this.props.getAllProductsAction({ success: false, error: err })
            }
        }

        document.getElementById("width").value = 20
        document.getElementById("height").value = 20
        document.getElementById("length").value = 20
        document.getElementById("weight").value = this.props.totalWeight
    }

    close = () => {
        this.props.closeCreateZaslatModal()
    }

    render() {
        let { isMobile } = this.state
        var popupContentTable = null
        var popup = null

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

        var modalContent = null
        var packageSegment = null
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
        }
        else {
            packageSegment = (
                <Grid>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={4}>
                            <strong>
                                Width [cm]
                                        </strong>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Form.Input fluid id="width" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={4}>
                            <strong>
                                Height [cm]
                                        </strong>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Form.Input fluid id="height" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={4}>
                            <strong>
                                Length [cm]
                                        </strong>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Form.Input fluid id="length" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' className="paddingTopAndBottomSmall">
                        <Grid.Column width={4}>
                            <strong>
                                Weight [kg]
                                            {popup}
                            </strong>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Form.Input fluid id="weight" />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            )
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
            </Grid>

        )

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
                    {modalContent}
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

function mapStateToProps(state) {
    return {
        ordersPageStore: state.OrdersReducer,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAllProductsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateZaslatModal);