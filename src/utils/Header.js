import React from 'react';
import { Sidebar, Menu, Segment, Icon, Input, Header as HeaderSemantic, Dropdown, Container, Button } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';

// import {browserHistory} from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { authenticateAction, authenticationStartedAction, authenticateEndedAction, authenticateOKAction, authenticationFailedAction } from './actions';
import { validateToken } from './requests'
import { localStorageName } from '../appConfig';

class Header extends React.Component {
    constructor(props) {
        super(props)

        // this.logout = this.logout.bind(this);

        var currentPath = props.location.pathname.replace("/", "");

        if (currentPath !== 'orders' && currentPath !== 'bank') {
            currentPath = 'orders'
        }

        this.state = {
            activeItem: currentPath,
            authExceptionMessage: "",
            authExceptionResponse: "",
            width: window.innerWidth,
            showMobileMenu: false
        }

        window.addEventListener('resize', this.handleWindowSizeChange);

        props.authenticationStartedAction();

        validateToken()
            .then(res => {
                this.props.authenticateAction(res.data)
                this.props.authenticateEndedAction();
                this.props.authenticateOKAction();
                this.props.history.push('/orders');
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    this.props.history.push('/login');
                }
                this.setState({ authExceptionMessage: err.message ? err.message : '', authExceptionResponse: err.response ? err.response : '' })

                this.props.authenticationFailedAction();
                this.props.authenticateEndedAction();
            })
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };

    // componentDidMount() {
    //     var currentPath = browserHistory.getCurrentLocation().pathname.replace("/","");

    //     if(currentPath !== 'patients' && currentPath !== 'graphs') {
    //         currentPath = 'patients'
    //     }

    //     this.setState({ activeItem: currentPath })
    // }

    handleItemClick = (e, { name }) => {
        if (name !== 'FNO - Urgent') {
            this.setState({ activeItem: name })
        }

        if (name === 'FNO - Urgent') {
            // browserHistory.push('/patients');
            window.location.reload()
        }

        if (name === 'patients') {
            // browserHistory.push('/patients');
        }

        if (name === 'graphs') {
            // browserHistory.push('/graphs');
            // window.location.reload()
        }

    }

    logout() {
        this.props.authenticateAction();
        this.props.authenticationFailedAction();
        this.props.authenticateEndedAction();
        this.props.history.push('/login');
        localStorage.setItem(localStorageName, "")
    }

    toggleMobileMenu = () => {
        this.setState({
            showMobileMenu: !this.state.showMobileMenu
        })
    }

    render() {
        const { width } = this.state;
        const isMobile = width <= 766;

        const { activeItem } = this.state

        var menuItems;

        if (this.props.loginPageStore.authenticationFailed && this.props.loginPageStore.authenticationDone) {
            menuItems = (
                <Menu stackable inverted style={{ border: '0px' }} pointing secondary size='tiny'>
                    <Menu.Item name='Medpharma VN' onClick={this.handleItemClick} />
                </Menu>
            )
        }
        else {
            if (isMobile) {
                if (this.state.showMobileMenu) {
                    menuItems = (
                        <Menu stackable inverted style={{ border: '0px' }} pointing secondary size='tiny'>
                            <Menu.Item name='Medpharma VN' onClick={this.handleItemClick}>
                                Medpharma VN
                                <Button style={{ position: 'absolute', right: '0px', top: '0.5em' }} icon='content' compact onClick={this.toggleMobileMenu} />
                            </Menu.Item>
                            <Menu.Item
                                style={{ color: 'black', borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                                name='bank'
                                active={activeItem === 'bank'}
                                onClick={this.handleItemClick}
                            >Bank</Menu.Item>
                            <Menu.Item
                                style={{ color: 'black', borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                                name='bank'
                                active={activeItem === 'bank'}
                                onClick={this.handleItemClick}
                            >Costs</Menu.Item>
                            <Menu.Item
                                style={{ color: 'black', borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                                name='bank'
                                active={activeItem === 'bank'}
                                onClick={this.handleItemClick}
                            >Warehouse</Menu.Item>
                            <Menu.Item
                                style={{ color: 'black', borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                                name='bank'
                                active={activeItem === 'bank'}
                                onClick={this.handleItemClick}
                            >Summaries</Menu.Item>
                            <Menu.Item
                                style={{ color: 'black', borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                                name='bank'
                                active={activeItem === 'bank'}
                                onClick={this.handleItemClick}
                            >Archive</Menu.Item>
                            <Menu.Item
                                style={{ color: 'black', borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                                name='bank'
                                active={activeItem === 'bank'}
                                onClick={this.handleItemClick}
                            >Scripts</Menu.Item>

                            <Menu.Menu position='right'>
                                <Menu.Item>{this.props.loginPageStore.currentUser.username}</Menu.Item>
                                <Menu.Item
                                    style={{ color: 'black' }}
                                    className='logout'
                                    name='logout'
                                    active={activeItem === 'logout'}
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
                            <Menu.Item name='Medpharma VN' onClick={this.handleItemClick}>
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
                        <Menu.Item name='Medpharma VN' onClick={this.handleItemClick} />
                        <Menu.Item style={{ borderColor: activeItem === 'orders' ? 'white' : 'transparent' }} name='orders' active={activeItem === 'orders'} onClick={this.handleItemClick}>Orders</Menu.Item>
                        <Menu.Item
                            style={{ color: 'black', borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                            name='bank'
                            active={activeItem === 'bank'}
                            onClick={this.handleItemClick}
                        >Bank</Menu.Item>
                        <Menu.Item
                            style={{ color: 'black', borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                            name='bank'
                            active={activeItem === 'bank'}
                            onClick={this.handleItemClick}
                        >Costs</Menu.Item>
                        <Menu.Item
                            style={{ color: 'black', borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                            name='bank'
                            active={activeItem === 'bank'}
                            onClick={this.handleItemClick}
                        >Warehouse</Menu.Item>
                        <Menu.Item
                            style={{ color: 'black', borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                            name='bank'
                            active={activeItem === 'bank'}
                            onClick={this.handleItemClick}
                        >Summaries</Menu.Item>
                        <Menu.Item
                            style={{ color: 'black', borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                            name='bank'
                            active={activeItem === 'bank'}
                            onClick={this.handleItemClick}
                        >Archive</Menu.Item>
                        <Menu.Item
                            style={{ color: 'black', borderColor: activeItem === 'bank' ? 'white' : 'transparent' }}
                            name='bank'
                            active={activeItem === 'bank'}
                            onClick={this.handleItemClick}
                        >Scripts</Menu.Item>

                        <Menu.Menu position='right'>
                            <Menu.Item>{this.props.loginPageStore.currentUser.username}</Menu.Item>
                            <Menu.Item
                                style={{ color: 'black' }}
                                className='logout'
                                name='logout'
                                active={activeItem === 'logout'}
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
