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
            name: "Category",
            prop: "category",
            searchable: "distinct",
            width: 2,
        },
        {
            name: "Date",
            prop: "date",
            width: 2,
        },
        {
            name: "Cost [CZK]",
            prop: "cost",
            width: 2,
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
        },
        {
            prop: "monthAndYear",
            skipRendering: true
        }
    ]

    transformDataRow(data) {
        data.actions = (
            <>
                <Button
                    className='buttonIconPadding'
                    size='large'
                    icon='edit' />
                <Button
                    className='buttonIconPadding'
                    size='large'
                    icon='remove' />
            </>
        );

        data.date = moment(data.date).local().format("DD.MM")

        return data;
    }

    grouping = [
        "monthAndYear"
    ]


    render() {
        return (
            <GenericTable
                distinctValues={{}}
                grouping={this.grouping}
                columns={this.columns}
                transformDataRow={this.transformDataRow}
                {...this.props}
            />
        );
    }
}
