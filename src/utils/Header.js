import React from 'react';
import { Sidebar, Menu, Segment, Icon, Input, Header as HeaderSemantic, Dropdown, Container } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom';

// import {browserHistory} from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import {loginFailedAction} from '../pages/login/LoginAction';

class Header extends React.Component {
    constructor(props) {
        super(props)

        // this.logout = this.logout.bind(this);

        var currentPath = props.location.pathname.replace("/", "");

        if (currentPath !== 'orders' && currentPath !== 'bank') {
            currentPath = 'orders'
        }
        this.state = {
            activeItem: currentPath
        }
    }

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

    // logout() {
    //     this.props.loginFailedAction();
    //     this.setState({ activeItem: "" })
    //     browserHistory.push('/logout');
    // }


    render() {
        const { activeItem } = this.state

        return (
            <Segment id="header" inverted>
                <Container>
                    <Menu inverted style={{ border: '0px' }} pointing secondary size='tiny'>
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

                        {/* <Menu.Menu position='right'>
                            <Menu.Item
                            style={{color:'black'}}
                                className='logout'
                                name='logout'
                                active={activeItem === 'logout'}
                                onClick={() => this.logout()}>
                                Odhlášení <Icon name='log out' style={{marginLeft:'0.5em'}}/>
                            </Menu.Item>
                        </Menu.Menu> */}
                    </Menu>
                </Container>
            </Segment>
        );
    }
}

// function mapStateToProps(state) {
//     return {
//         loginPageStore: state.LoginReducer
//     };
//   }

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({
//         loginFailedAction : loginFailedAction
//     }, dispatch);
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Header);
export default withRouter(Header);