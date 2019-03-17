import React from 'react'
import GenericTable from './GenericTable';
import { Button } from 'semantic-ui-react';
import moment from 'moment';

export default class BankTransactionsTable extends React.PureComponent {
    columns = [
        {
            name: "Date",
            prop: "date",
            width: 3,
        },
        {
            name: "Value [CZK]",
            prop: "value",
            width: 3,
        },
        {
            name: "VS",
            prop: "vs",
            width: 3,
        },
        {
            name: "Sender",
            prop: "accountNameSender",
            width: 3,
        },
        {
            name: "Note",
            prop: "note",
            width: 3,
        },
        {
            name: "Actions",
            prop: "actions",
            sortable: false,
            searchable: false,
            exportByDefault: false,
            width: 1
        },
        {
            name: "Account ID",
            prop: "accountIdSender",
            visibleByDefault: false
        },
        {
            name: "Bank ID",
            prop: "bankIdSender",
            visibleByDefault: false
        },
        {
            name: "CS",
            prop: "cs",
            visibleByDefault: false
        },
        {
            name: "Bank Name",
            prop: "bankNameSender",
            visibleByDefault: false
        },
        {
            name: "Currecny",
            prop: "currency",
            visibleByDefault: false
        },
        {
            name: "Reference",
            prop: "paymentReference",
            visibleByDefault: false
        },
        {
            name: "Transaction ID",
            prop: "transactionId",
            visibleByDefault: false
        },
        {
            name: "Order ID",
            prop: "orderId",
            visibleByDefault: false
        },
    ]

    transformDataRow(data) {
        data.actions = (
            <Button
                className='buttonIconPadding'
                size='large'
                icon='check' />
        );

        data.date = moment(data.date.substring(0, data.date.indexOf("+"))).local().format("DD.MM.YYYY")

        return data;
    }

    getDataKey(data) {
        return data.index;
    }


    render() {
        return (
            <GenericTable
                columns={this.columns}
                transformDataRow={this.transformDataRow}
                getDataKey={this.getDataKey}
                {...this.props}
            />
        );
    }
}
