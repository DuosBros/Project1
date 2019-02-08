import { Form, Divider, Dropdown } from "semantic-ui-react";
import React from 'react';
const ProductRow = (props) => {
    return (
        <>
            <Form.Field>
                <label>Product Name</label>
                <Dropdown
                    selection
                    options={Object.keys(props.allProducts).map(x =>
                        ({
                            value: x,
                            text: x
                        })
                    )}
                    onChange={(e, m) => props.handleProductDropdownOnChange(
                        e, m, props.i,
                        {
                            productName: m.value,
                            count: 1,
                            pricePerOne: props.allProducts[m.value].price,
                            product: props.allProducts[m.value]
                        })}
                    defaultValue={props.product.productName}
                    fluid
                    selectOnBlur={false}
                    selectOnNavigation={false}
                    placeholder='Type to search...'
                    search
                />
            </Form.Field>
            <Form.Field>
                <Form.Input
                    label='Product Price [CZK]'
                    fluid
                    value={props.product.pricePerOne}
                    onChange={(e, m) => props.handleProductDropdownOnChange(e, m, props.i, {
                        pricePerOne: m.value,
                        productName: props.product.productName,
                        count: props.product.count
                    })} />
            </Form.Field>
            <Form.Input
                label='Product Count [Pcs]'
                fluid
                value={props.product.count}
                onChange={(e, m) => props.handleProductDropdownOnChange(e, m, props.i, {
                    pricePerOne: props.product.pricePerOne,
                    productName: props.product.productName,
                    count: parseInt(m.value)
                })} />
            <Form.Field>
                <label>Total Product Price [CZK]</label>
                <input readOnly value={props.product.totalPricePerProduct}></input>
            </Form.Field>
            <Divider style={{ borderColor: '#f20056' }} />
        </>);
}

export default ProductRow;