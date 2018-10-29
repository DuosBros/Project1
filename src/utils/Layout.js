import React from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';

import Header from './Header';
// import Footer from './Footer';
// import {loginFailedAction, loginSuccessAction} from '../pages/login/LoginAction';
// import {checkAuth} from '../pages/login/LoginAxios';
import { Container } from 'semantic-ui-react';

class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            minHeight: 400
        };

        // checkAuth().then((res) => {
        //     this.props.loginSuccessAction();
        //     browserHistory.push('/patients');
        // })
        // .catch(err => {
        //     if(!!err.response) {
        //         if(err.response.status === 401) {
        //             this.props.loginFailedAction();
        //             browserHistory.push('/logout');
        //         }
        //     }

        //     console.log(err);
        // })
    }
    
    componentWillMount(){
        if(this.state.minHeight < window.innerHeight) {
            var res = window.innerHeight-50
            this.setState({minHeight: res});
        }   
    }

    render() {
        return (
        <div>
            <Header/>
                {/* <div className="container" ></div> */}
                <Container fluid style={{minHeight:this.state.minHeight + 'px'}}>
                Test
                    {this.props.children}
                </Container>
            {/* <Footer className="footer"/> */}
        </div>
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
//         loginFailedAction : loginFailedAction,
//         loginSuccessAction : loginSuccessAction
//     }, dispatch);
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Layout);
export default Layout;