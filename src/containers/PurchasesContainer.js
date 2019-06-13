import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPurchasesAction } from '../utils/actions';
import { getPurchases } from '../utils/requests';
import Purchases from '../pages/Purchases';

class PurchasesContainer extends React.Component {

    componentDidMount() {
        this.fetchPurchases()
    }

    fetchPurchases = async () => {
        try {
            let res = await getPurchases()
            this.props.getPurchasesAction({ success: true, data: res.data })
        } catch (err) {
            this.props.getPurchasesAction({ success: false, error: err })
        }
    }

    render() {
        let pathname = this.props.location.pathname;

        if (pathname === "/purchases") {
            return (
                <Purchases
                    purchases={this.props.purchasesStore.purchases}
                />
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        purchasesStore: state.PurchasesReducer,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPurchasesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchasesContainer);