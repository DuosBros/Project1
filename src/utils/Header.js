import React from 'react';
import { Menu, Segment, Icon, Container } from 'semantic-ui-react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { authenticateAction, authenticateSucceededAction, authenticationInProgressAction } from './actions';
import { LOCALSTORAGE_NAME } from '../appConfig';

class Header extends React.Component {
    constructor(props) {
        super(props)

        var currentPath = props.location.pathname.replace("/", "");

        this.state = {
            activeItem: currentPath,
            isMobile: this.props.isMobile,
            showMobileMenu: false
        }
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
            this.setState({ activeItem: name })
            this.props.history.push('/' + name);
        }

        if (this.state.showMobileMenu) {
            this.toggleMobileMenu()
        }
    }

    logout() {
        this.props.authenticateAction({});
        this.props.authenticateSucceededAction(false);
        this.props.authenticationInProgressAction(false);
        this.props.history.push('/login');
    }

    toggleMobileMenu = () => {
        this.setState({
            showMobileMenu: !this.state.showMobileMenu
        })
    }

    render() {

        const { activeItem, isMobile, showMobileMenu } = this.state

        var menuItems;

        // in case that the authentication failed and its done already
        if (!this.props.loginPageStore.authenticationSucceeded && this.props.loginPageStore.authenticationDone) {
            menuItems = (
                <Menu stackable inverted className='borderlessMenu' pointing secondary size='tiny'>
                    <Menu.Item name='MedpharmaVN' onClick={() => this.handleItemClick} />
                </Menu>
            )

            return menuItems;
        }


        if (isMobile) {
            if (!showMobileMenu) {
                menuItems = (
                    <Menu stackable inverted className='borderlessMenu' pointing secondary size='tiny'>
                        <Menu.Item name='MedpharmaVN'>
                            Medpharma VN
                                <Icon name='content' style={{ position: 'absolute', right: '0px' }} onClick={this.toggleMobileMenu} />
                        </Menu.Item>
                    </Menu>
                )

                return menuItems;
            }
        }

        menuItems = (
            <Menu stackable inverted className='borderlessMenu' pointing secondary size='tiny'>
                <Menu.Item name='MedpharmaVN'>
                    Medpharma VN
                        {isMobile ? (<Icon name='content' style={{ position: 'absolute', right: '0px' }} onClick={this.toggleMobileMenu} />) : null}
                </Menu.Item>
                <Menu.Item
                    content='Orders'
                    name='orders'
                    active={activeItem === 'orders'}
                    onClick={this.handleItemClick} />
                <Menu.Item
                    content='Bank'
                    name='bank'
                    active={activeItem === 'bank'}
                    onClick={this.handleItemClick} />
                <Menu.Item
                    content='Costs'
                    name='costs'
                    active={activeItem === 'costs'}
                    onClick={this.handleItemClick} />
                <Menu.Item
                    content='Warehouse'
                    name='warehouse'
                    active={activeItem === 'warehouse'}
                    onClick={this.handleItemClick} />
                <Menu.Item
                    content='Summaries'
                    name='summaries'
                    active={activeItem === 'summaries'}
                    onClick={this.handleItemClick} />
                <Menu.Item
                    content='Archive'
                    name='archive'
                    active={activeItem === 'archive'}
                    onClick={this.handleItemClick} />
                <Menu.Item
                    content='Scripts'
                    name='scripts'
                    active={activeItem === 'scripts'}
                    onClick={this.handleItemClick} />
                <Menu.Menu position='right'>
                    {!isMobile ? (<Menu.Item>{localStorage.getItem(LOCALSTORAGE_NAME) ? JSON.parse(atob(localStorage.getItem(LOCALSTORAGE_NAME).split('.')[1])).username : ""}</Menu.Item>) : null}
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
        authenticateSucceededAction,
        authenticationInProgressAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
