import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogic';
import { useChatContext } from '../context/chatContext';
import { Avatar, Tooltip } from '@chakra-ui/react';
const ScrollableChat = ({ message }) => {
    const { user } = useChatContext();
    return (
        <ScrollableFeed>
            {message && message.map((msg, ind) => {
                return <div style={{ display: 'flex' }} key={ind}>
                    {
                        (isSameSender(message, msg, ind, user._id) || isLastMessage(message, ind, user._id)) && (
                            <Tooltip
                                placement='bottom-start'
                                hasArrow
                                label={msg.sender.name}

                            >

                                <Avatar
                                    mt='7px'
                                    mr={1}
                                    size='sm'
                                    cursor='pointer'
                                    name={msg.sender.name}
                                    src={msg.sender.pic}

                                />
                            </Tooltip>
                        )}
                    <span style={{ 
                        background: `${msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                         borderRadius:"20px",
                         padding:"5px 15px", 
                         maxWidth:"75%" ,
                         marginLeft:isSameSenderMargin(message,msg,ind,user._id),
                         marginTop:isSameUser(message,msg,ind,user._id)?3:10

                         
                         }}>{msg.content}</span>

                </div>
            })}
        </ScrollableFeed>
    )
}

export default ScrollableChat
