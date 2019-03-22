import React from 'react'
import GenericTable from './GenericTable';
import { Button } from 'semantic-ui-react';
import moment from 'moment';

export default class CostsTable extends React.PureComponent {
    columns = [
        {
            name: "Description",
            prop: "description",
            width: 4,
        },
        {
            name: "Date",
            prop: "date",
            width: 4,
        },
        {
            name: "Cost [CZK]",
            prop: "cost",
            width: 4,
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
            name: "Note",
            prop: "note",
            width: 3
        }
    ]

    transformDataRow(data) {
        data.actions = (
            <Button
                className='buttonIconPadding'
                size='large'
                icon='check' />
        );

        data.date = moment(data.date).local().format("DD.MM")

        return data;
    }

    render() {
        return (
            <GenericTable
                columns={this.columns}
                transformDataRow={this.transformDataRow}
                {...this.props}
            />
        );
    }
}
