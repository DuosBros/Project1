import React from 'react'
import GenericTable from './GenericTable';
import { Button, Popup } from 'semantic-ui-react';

class CostsTable extends React.PureComponent {
    columns = [
        {
            name: "Product",
            prop: "name",
            width: 3,
        },
        {
            name: "Category",
            prop: "category",
            searchable: "distinct",
            width: 2,
        },
        {
            name: "Price [CZK]",
            prop: "price",
            width: 1,
        },
        {
            name: "Beginning",
            prop: "beginning",
            width: 1,
        },
        {
            name: "Input",
            prop: "input",
            width: 1,
        },
        {
            name: "Output",
            prop: "output",
            width: 1
        },
        {
            name: "Currently Available",
            prop: "available",
            width: 1
        },
        {
            name: "Actions",
            prop: "actions",
            width: 1,
            sortable: false,
            exportable: false,
            // searchable: false
        },
        {
            name: "Weight [gr]",
            prop: "weight",
            width: 1,
            visibleByDefault: false
        },
        {
            name: "Tax [%]",
            prop: "tax",
            width: 1,
            visibleByDefault: false
        }
    ]

    transformDataRow(data) {
        data.actions = (
            <>
                <Popup inverted trigger={
                    <Button
                        // onClick={() => this.handleDeleteCost(data)}
                        className='buttonIconPadding'
                        size='large'
                        icon='warehouse' />
                } content="Edit product count" />
                <Popup inverted trigger={
                    <Button
                        onClick={() => this.handleToggleProductModal(data)}
                        className='buttonIconPadding'
                        size='large'
                        icon='edit' />
                } content="Edit product" />
                <Popup inverted trigger={
                    <Button
                        onClick={() => this.handleDeleteProduct(data.id)}
                        className='buttonIconPadding'
                        size='large'
                        icon='remove' />
                } content="Remove product count" />
            </>
        );

        return data;
    }

    grouping = [
        "category"
    ]

    render() {
        let distinctValuesObject = {
            category: this.props.categories
        }

        return (
            <GenericTable
                disableGrouping={!this.props.isGroupingEnabled}
                transformDataRow={this.transformDataRow}
                distinctValues={distinctValuesObject}
                grouping={this.grouping}
                columns={this.columns}
                {...this.props}
            />
        );
    }
}

export default CostsTable;