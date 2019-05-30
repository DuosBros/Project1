import React from 'react'
import GenericTable from './GenericTable';
import moment from 'moment';

export default class ProductHistoryTable extends React.PureComponent {
    columns = [
        {
            name: "Date",
            prop: "timestamp",
        },
        {
            name: "Difference",
            prop: "difference",
        },
        {
            name: "Changed by",
            prop: "user",
        },
    ]


    transformDataRow(data) {
        data.timestamp = moment(data.timestamp).format("DD.MM.YYYY hh:mm:ss")

        return data;
    }

    render() {
        return (
            <GenericTable
                transformDataRow={this.transformDataRow}
                columns={this.columns}
                {...this.props}
            />
        );
    }
}