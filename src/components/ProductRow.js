import { Form, Divider, Dropdown } from "semantic-ui-react";
import React from 'react';
const ProductRow = (handleProductDropdownOnChange, { product, i, allProducts }) => {
    return (
        <>
            <Form.Field>
                <label>Product Name</label>
                <Dropdown
                    selection
                    options={Object.keys(allProducts).map(x =>
                        ({
                            value: x,
                            text: x
                        })
                    )}
                    onChange={(e, m) => handleProductDropdownOnChange(
                        e, m, i,
                        {
                            productName: m.value,
                            count: 1,
                            pricePerOne: allProducts[m.value].price,
                            product: allProducts[m.value]
                        })}
                    defaultValue={product.productName}
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
                    value={product.pricePerOne}
                    onChange={(e, m) => handleProductDropdownOnChange(e, m, i, {
                        pricePerOne: m.value,
                        productName: product.productName,
                        count: product.count
                    })} />
            </Form.Field>
            <Form.Input
                label='Product Count [Pcs]'
                fluid
                value={product.count}
                onChange={(e, m) => handleProductDropdownOnChange(e, m, i, {
                    pricePerOne: product.pricePerOne,
                    productName: product.productName,
                    count: parseInt(m.value)
                })} />
            <Form.Field>
                <label>Total Product Price [CZK]</label>
                <input readOnly value={product.totalPricePerProduct}></input>
            </Form.Field>
            <Divider style={{ borderColor: '#f20056' }} />
        </>);
}

export default ProductRow;