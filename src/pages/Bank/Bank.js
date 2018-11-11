import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Button, Input, Icon } from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';

import { getBankTransactionsAction } from '../../utils/actions'
import { getBankTransactions } from '../../utils/requests'

class Bank extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            direction: null,
            column: null,
            data: this.props.bankStore.transactions,
            mappedTransactions: []
        }

        getBankTransactions()
            .then(res => {
                var reversed = res.data.accountStatement.transactionList.transaction.reverse().slice(0, 100);

                var mappedTransactions = reversed.map(transaction => {
                    if (!_.isEmpty(transaction.column5)) {
                        var regexMatch = transaction.column5.value.match(/[1-9]/gi)
                        if (_.isEmpty(regexMatch)) {
                            return transaction
                        }
                        var index = regexMatch[0]
                        transaction.column5.value = transaction.column5.value.substring(transaction.column5.value.indexOf(index))

                        // pridat order do transaction
                        var a = this.props.ordersStore.orders
                        transaction.order = a.find((element) => {
                            return element.payment.vs === parseInt(transaction.column5.value, 10);
                        });
                    }

                    return transaction
                })

                this.props.getBankTransactionsAction(mappedTransactions)

                // var temp = res.data.accountStatement.transactionList.transaction.map(transaction => {
                //     this.props.ordersStore.filter(order => {
                //         if(order.payment.vs)
                //     })
                // })

                this.setState({ data: mappedTransactions });
            })



    }

    handleSort = clickedColumn => () => {
        const { column, data, direction } = this.state

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                data: _.sortBy(data, [clickedColumn]),
                direction: 'ascending',
            })

            return
        }

        this.setState({
            data: data.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    render() {

        const { column, direction, data } = this.state;

        var counter = 0
        var transactionButton;
        var mappedTransactions = data.map(transaction => {

            if (transaction.column1.value >= 1) {
                if (transaction.order) {
                    if (!transaction.order.payment.paid) {
                        transactionButton = (
                            <Button id="buttonIconPadding">
                                <Icon.Group>
                                    <Icon name='usd' />
                                    <Icon corner name='add' color="green" />
                                </Icon.Group>
                            </Button>
                        )
                    }
                    else {
                        transactionButton = (
                            <span></span>
                        )
                    }
                }
                else {
                    transactionButton = (
                        <span></span>
                    )
                }
            }
            else {
                transactionButton = (
                    <Button id="buttonIconPadding">
                        <Icon.Group>
                            <Icon name='usd' />
                            <Icon corner name='minus' color="red" />
                        </Icon.Group>
                    </Button>
                )
            }

            counter++;
            var date = transaction.column0.value.substring(0, transaction.column0.value.indexOf("+"));
            return (
                <Table.Row negative={transaction.column1.value < 1} positive={transaction.column1.value >= 1} key={transaction.column22.value}>
                    <Table.Cell >{counter}</Table.Cell>
                    <Table.Cell >{moment(date).format("DD.MM.YYYY").toString()}</Table.Cell>
                    <Table.Cell>{transaction.column1.value}</Table.Cell>
                    <Table.Cell >{transaction.column5 ? transaction.column5.value : ""}</Table.Cell>
                    <Table.Cell >{transaction.column25 ? transaction.column25.value : ""}</Table.Cell>
                    <Table.Cell >
                        {transactionButton}
                    </Table.Cell>
                </Table.Row >
            )
        })
        console.log(data)

        return (
            <Table compact basic='very' sortable celled textAlign="center">
                <Table.Header>
                    <Table.Row>
                        {/* <Table.HeaderCell colSpan={2} textAlign="left">
                            <Input placeholder="Type to search..." name="multiSearchInput" onChange={this.handleChange} ></Input>
                        </Table.HeaderCell> */}
                        <Table.HeaderCell colSpan={6} textAlign="right">
                            <Input placeholder="Type to search..." name="multiSearchInput" onChange={this.handleChange} ></Input>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell
                            width={1}
                            sorted={column === 'counter' ? direction : null}
                            onClick={this.handleSort('counter')}
                        />
                        <Table.HeaderCell
                            width={3}
                            sorted={column === 'date' ? direction : null}
                            onClick={this.handleSort('date')}
                            content='Date'
                        />
                        <Table.HeaderCell
                            width={2}
                            sorted={column === 'price' ? direction : null}
                            onClick={this.handleSort('price')}
                            content='Price [CZK]'
                        />
                        <Table.HeaderCell
                            width={2}
                            sorted={column === 'vs' ? direction : null}
                            onClick={this.handleSort('vs')}
                            content='VS'
                        />
                        <Table.HeaderCell
                            width={5}
                            sorted={column === 'note' ? direction : null}
                            onClick={this.handleSort('note')}
                            content='Note'
                        />
                        <Table.HeaderCell
                            width={2}
                            content='Actions'
                        />
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {mappedTransactions}
                </Table.Body>
            </Table >
        );
    }
}


function mapStateToProps(state) {
    return {
        bankStore: state.BankReducer,
        ordersStore: state.OrdersReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getBankTransactionsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Bank);