import React, { useState } from 'react'
import { Message, Icon, Image, Accordion } from 'semantic-ui-react'
import pikachu from '../assets/pikachu.jpg'

const ErrorMessage = (props) => {

    const [isRefreshButtonLoading, toggleRefreshButton] = useState(false);
    const [isActive, toggleActiveAccordion] = useState(true);

    let handleRefresh = () => {
        toggleRefreshButton(true)
        props.handleRefresh();
        toggleRefreshButton(false)
    }

    return (
        <Message icon>

            <Message.Content>
                <Message.Header>
                    {(props.title || "Ooops, error! ")}
                    {
                        props.handleRefresh ?
                            (
                                <>
                                    Try again
                                    <Icon
                                        className="pointerCursor"
                                        onClick={() => handleRefresh()}
                                        name="refresh"
                                        loading={isRefreshButtonLoading} />
                                </>
                            ) : (
                                null
                            )
                    }

                </Message.Header>
                {props.message === "" ? null : <>{props.message} <br /></>}

                <Accordion>
                    <Accordion.Title active={isActive} index={0} onClick={() => toggleActiveAccordion(!isActive)}>
                        <Icon name='dropdown' />
                        Details
                            </Accordion.Title>
                    <Accordion.Content active={isActive}>
                        {props.error && props.error.toString()}
                        <br />
                        {props.error.stack}
                        <Image src={pikachu} size='tiny' />
                    </Accordion.Content>
                </Accordion>
            </Message.Content>
        </Message>
    )
}


export default ErrorMessage;