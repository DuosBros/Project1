import React from 'react'
import GenericTable from './GenericTable';
import { Button, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class CostsTable extends React.PureComponent {
    static defaultProps = {
        defaultShowInactiveProducts: false
    }

    static propTypes = {
        defaultShowInactiveProducts: PropTypes.bool
    }

    constructor(props) {
        super(props);
        this.state = {
            showInactiveProducts: props.defaultShowInactiveProducts
        };
    }

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
            skipRendering: true,
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
                        onClick={() => this.handleEditWarehouseProductcount(data)}
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
                        onClick={() => this.handleDeleteProduct(data)}
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

    customFilterCallback = (filteredData) => {
        const { showInactiveProducts } = this.state;
        if (showInactiveProducts) {
            filteredData = filteredData.filter(x => x.isActive === true)
        }
        return filteredData;
    }

    handleStateToggle = (e, { name }) => {
        this.setState({
            [name]: !this.state[name]
        });
    }

    getDataKey(data) {
        return data.name
    }

    renderCustomFilter = () => {
        const { showInactiveProducts } = this.state;
        return (
            <div>
                <Button
                    size="small"
                    name="showInactiveProducts"
                    onClick={this.handleStateToggle}
                    compact
                    content={showInactiveProducts ? 'Show inactive products' : 'Hide inactive products'}
                    style={{ padding: '0.3em', marginTop: '0.5em', textAlign: 'right' }}
                    id="secondaryButton"
                    icon={showInactiveProducts ? 'eye' : 'eye slash'}
                    labelPosition='right' />
            </div>
        );
    }

    render() {
        let distinctValuesObject = {
            category: this.props.categories
        }

        this.columns.map(x => {
            if (x.prop === "category") {
                x.skipRendering = this.props.isGroupingEnabled
                x.visibleByDefault = this.props.isGroupingEnabled
            }

            return x;
        })

        return (
            <GenericTable
                getDataKey={this.getDataKey}
                renderCustomFilter={this.renderCustomFilter}
                customFilterCallback={this.customFilterCallback}
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