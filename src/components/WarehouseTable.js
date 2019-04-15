import React from 'react'
import GenericTable from './GenericTable';
import { Button, Popup } from 'semantic-ui-react';

class CostsTable extends React.PureComponent {
    columns = [
        {
            name: "Product",
            prop: "productName",
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
            name: "Booked",
            prop: "booked",
            width: 1,
        },
        {
            name: "Available",
            prop: "available",
            width: 1
        },
        {
            name: "Actions",
            prop: "actions",
            width: 1
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
                        // onClick={() => this.handleToggleEditCostModal(data)}
                        className='buttonIconPadding'
                        size='large'
                        icon='edit' />
                } content="Edit product" />
                <Popup inverted trigger={
                    <Button
                        // onClick={() => this.handleDeleteCost(data)}
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