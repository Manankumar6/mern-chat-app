import React from 'react'
import { useChatContext } from '../context/chatContext'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain,setFetchAgain}) => {

  const {selectedChat} = useChatContext();
  return (
    <Box
    display={{base:selectedChat?"flex":"none",md:"flex"}}
    flexDir='column'
    alignItems='center'
    p={3}
    bg='white'
    w={{base:"100%",md:'68%'}}
    borderRadius='lg'
    borderWidth='1px'
    >
    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox
