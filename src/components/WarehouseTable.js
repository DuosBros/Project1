import React from 'react'
import GenericTable from './GenericTable';
import { Button } from 'semantic-ui-react';

class CostsTable extends React.PureComponent {
    columns = [
        {
            name: "Product",
            prop: "productName",
            width: 4,
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
            width: 2,
        },
        {
            name: "Booked",
            prop: "booked",
            width: 2,
        },
        {
            name: "Available",
            prop: "available",
            sortable: false,
            searchable: false,
            exportByDefault: false,
            width: 1
        }
    ]

    // transformDataRow(data) {
    //     data.actions = (
    //         <>
    //             <Button
    //                 onClick={() => this.handleToggleEditCostModal(data)}
    //                 className='buttonIconPadding'
    //                 size='large'
    //                 icon='edit' />
    //             <Button
    //                 onClick={() => this.handleDeleteCost(data)}
    //                 className='buttonIconPadding'
    //                 size='large'
    //                 icon='remove' />
    //         </>
    //     );

    //     return data;
    // }

    grouping = [
        "category"
    ]



    render() {
        let distinctValuesObject = {
            category: this.props.categories
        }

        return (
            <GenericTable
                distinctValues={distinctValuesObject}
                grouping={this.grouping}
                columns={this.columns}
                {...this.props}
            />
        );
    }
}

export default CostsTable;