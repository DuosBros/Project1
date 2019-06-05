import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Scripts from '../pages/Scripts';

class ScriptsContainer extends React.Component {
    state = {}

    async componentDidMount() {
    }

    render() {
        let pathname = this.props.location.pathname;

        if (pathname === "/scripts") {
            return (
                <Scripts />
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        // gmailStore: state.GmailReducer,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScriptsContainer);