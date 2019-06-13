import React from 'react'
import GenericTable from './GenericTable';
import { Button } from 'semantic-ui-react';
import moment from 'moment';

class PurchasesTable extends React.PureComponent {
    columns = [
        {
            name: "Date",
            prop: "date",
            width: 2,
        },
        {
            name: "Supplier",
            prop: "to",
            searchable: "distinct",
            width: 2,
        },
        {
            name: "By",
            prop: "user",
            searchable: "distinct",
            width: 2,
        },
        {
            name: "Products",
            prop: "products",
            width: 9,
        },
        {
            name: "Actions",
            prop: "actions",
            sortable: false,
            searchable: false,
            exportByDefault: false,
            width: 1
        },
    ]

    transformDataRow(data) {
        data.date = moment(data.date).local().format("DD.MM.YYYY HH:mm:ss")

        data.actions = (
            <>
                <Button
                    onClick={() => this.handleToggleEditCostModal(data)}
                    className='buttonIconPadding'
                    size='large'
                    icon='edit' />
                <Button
                    onClick={() => this.handleDeleteCost(data)}
                    className='buttonIconPadding'
                    size='large'
                    icon='remove' />
            </>
        );

        return data;
    }

    // grouping = [
    //     "monthAndYear"
    // ]


    render() {

        return (
            <GenericTable
                // grouping={this.grouping}
                columns={this.columns}
                transformDataRow={this.transformDataRow}
                {...this.props}
            />
        );
    }
}


export default PurchasesTable;