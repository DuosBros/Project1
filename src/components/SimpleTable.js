import React from 'react';
import { Table } from 'semantic-ui-react';

const SimpleTable = (props) => (
    <Table compact basic='very' size='small'>
        <Table.Header>
            <Table.Row>
            {
                props.columnProperties.map(property => {
                    return (
                        <Table.HeaderCell key={property.name} width={property.width} content={property.name} />
                    )
                })
            }
            </Table.Row>
        </Table.Header>
        <Table.Body>
            { props.body }   
        </Table.Body>
    </Table>

)

export default SimpleTable;
