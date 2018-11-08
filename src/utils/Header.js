import React from 'react';
import { Menu, Segment, Icon, Container, Button } from 'semantic-ui-react'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { authenticateAction, authenticationStartedAction, authenticateEndedAction, authenticateOKAction, authenticationFailedAction } from './actions';
import { validateToken } from './requests'
import { LOCALSTORAGE_NAME } from '../appConfig';

class Header extends React.Component {
    constructor(props) {
        super(props)

        var currentPath = props.location.pathname.replace("/", "");

        this.state = {
            activeItem: currentPath,
            authExceptionMessage: "",
            authExceptionResponse: "",
            isMobile: this.props.isMobile
        }

        props.authenticationStartedAction();

        validateToken()
            .then(() => {
                    this.props.authenticateEndedAction();
                    this.props.authenticateOKAction();
                })
            .catch((err) => {
                if (err.response.status >= 400 && err.response.status < 500) {
                    this.props.history.push('/login');
                }
                this.setState({ authExceptionMessage: err.message ? err.message : '', authExceptionResponse: err.response ? err.response : '' })

                this.props.authenticationFailedAction();
                this.props.authenticateEndedAction();
            })
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('isMobileprops: ' + this.props.isMobile)

        if (prevProps.isMobile !== this.props.isMobile) {
            this.setState({ isMobile: this.props.isMobile });
        }
    }

    handleItemClick = (e, { name }) => {

        if (name === 'MedpharmaVN') {
            window.location.reload()
        }
        else {
            this.props.history.push('/' + name);
        }
    }

    logout() {
        this.props.authenticateAction({});
        this.props.authenticationFailedAction();
        this.props.authenticateEndedAction();
        this.props.history.push('/login');
    }

    toggleMobileMenu = () => {
        this.setState({
            showMobileMenu: !this.state.showMobileMenu
        })
    }

    render() {

        const { activeItem } = this.state

        var menuItems;

        if (this.props.loginPageStore.authenticationFailed && this.props.loginPageStore.authenticationDone) {
            menuItems = (
                <Menu stackable inverted style={{ border: '0px' }} pointing secondary size='tiny'>
                    <Menu.Item name='MedpharmaVN' onClick={this.handleItemClick} />
                </Menu>
            )
        }
        else {
            if (this.state.isMobile) {
                if (this.state.showMobileMenu) {
                    menuItems = (
                        <Menu stackable inverted style={{ border: '0px' }} pointing secondary size='tiny'>
                            <Menu.Item name='MedpharmaVN'>
                                Medpharma VN
                                <Button style={{ position: 'absolute', right: '0px', top: '0.5em' }} icon='content' compact onClick={this.toggleMobileMenu} />
                            </Menu.Item>
                            <Menu.Item
                                style={{ borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                                name='bank'
                                onClick={this.handleItemClick}
                            >Bank</Menu.Item>
                            <Menu.Item
                                style={{ borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                                name='costs'
                                onClick={this.handleItemClick}
                            >Costs</Menu.Item>
                            <Menu.Item
                                style={{ borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                                name='warehouse'
                                onClick={this.handleItemClick}
                            >Warehouse</Menu.Item>
                            <Menu.Item
                                style={{ borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                                name='summaries'
                                onClick={this.handleItemClick}
                            >Summaries</Menu.Item>
                            <Menu.Item
                                style={{ borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                                name='bank'
                                onClick={this.handleItemClick}
                            >Archive</Menu.Item>
                            <Menu.Item
                                style={{ borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                                name='bank'
                                onClick={this.handleItemClick}
                            >Scripts</Menu.Item>

                            <Menu.Menu position='right'>
                                <Menu.Item
                                    style={{ color: 'black' }}
                                    className='logout'
                                    name='logout'
                                    onClick={() => this.logout()}>
                                    Logout <Icon name='log out' style={{ marginLeft: '0.5em' }} />
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu>
                    )
                }
                else {
                    menuItems = (
                        <Menu stackable inverted style={{ border: '0px' }} pointing secondary size='tiny'>
                            <Menu.Item name='MedpharmaVN'>
                                Medpharma VN
                                <Button style={{ position: 'absolute', right: '0px', top: '0.5em' }} icon='content' compact onClick={this.toggleMobileMenu} />
                            </Menu.Item>
                        </Menu>
                    )
                }
            }
            else {
                menuItems = (
                    <Menu stackable inverted style={{ border: '0px' }} pointing secondary size='tiny'>
                        <Menu.Item name='MedpharmaVN' onClick={this.handleItemClick} />
                        <Menu.Item style={{ borderColor: activeItem === 'orders' ? 'white' : 'transparent' }} name='orders' active={activeItem === 'orders'} onClick={this.handleItemClick}>Orders</Menu.Item>
                        <Menu.Item
                            style={{ borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                            name='bank'
                            active={activeItem === 'bank'}
                            onClick={this.handleItemClick}
                        >Bank</Menu.Item>
                        <Menu.Item
                            style={{ borderColor: activeItem === 'costs' ? 'white' : 'transparent' }}
                            name='costs'
                            active={activeItem === 'costs'}
                            onClick={this.handleItemClick}
                        >Costs</Menu.Item>
                        <Menu.Item
                            style={{ borderColor: activeItem === 'warehouse' ? 'white' : 'transparent' }}
                            name='warehouse'
                            active={activeItem === 'warehouse'}
                            onClick={this.handleItemClick}
                        >Warehouse</Menu.Item>
                        <Menu.Item
                            style={{ borderColor: activeItem === 'summaries' ? 'white' : 'transparent' }}
                            name='summaries'
                            active={activeItem === 'summaries'}
                            onClick={this.handleItemClick}
                        >Summaries</Menu.Item>
                        <Menu.Item
                            style={{ borderColor: activeItem === 'archive' ? 'white' : 'transparent' }}
                            name='archive'
                            active={activeItem === 'archive'}
                            onClick={this.handleItemClick}
                        >Archive</Menu.Item>
                        <Menu.Item
                            style={{ borderColor: activeItem === 'scripts' ? 'white' : 'transparent' }}
                            name='scripts'
                            active={activeItem === 'scripts'}
                            onClick={this.handleItemClick}
                        >Scripts</Menu.Item>

                        <Menu.Menu position='right'>
                            <Menu.Item>{localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : ""}</Menu.Item>
                            <Menu.Item
                                className='logout'
                                name='login'
                                onClick={() => this.logout()}>
                                Logout <Icon name='log out' style={{ marginLeft: '0.5em' }} />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                )
            }

        }

        return (
            <Segment id="header" inverted>
                <Container>
                    {menuItems}
                </Container>
            </Segment>
        );
    }
}

function mapStateToProps(state) {
    return {
        loginPageStore: state.LoginReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        authenticateAction,
        authenticationFailedAction,
        authenticateEndedAction,
        authenticationStartedAction,
        authenticateOKAction

    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
