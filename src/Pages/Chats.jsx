import React, { useState } from 'react'

import { useChatContext } from '../context/chatContext';
import SideDrawer from '../components/SideDrawer';
import { Box } from '@chakra-ui/react';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
const Chats = () => {
  const { user } = useChatContext();
  const [fetchAgain,setFetchAgain] = useState()

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display='flex'
        justifyContent='space-between'
        w='100%'
        h='91.5vh'
        p='10px'
      >
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>

    </div>
  )
}

export default Chats
