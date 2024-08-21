import React, { useEffect, useState } from 'react'
import { useChatContext } from '../context/chatContext';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogic';
import GroupChatModel from '../miscellaneous/GroupChatModel';

const MyChats = ({fetchAgain}) => {
    const { user, setSelectedChat, selectedChat, chats, setChats } = useChatContext();
  
    const [loggedUser, setLoggedUser] = useState();
    const toast = useToast()
    const URL = process.env.REACT_APP_BASE_CHAT_URL;
    const fetchChat = async () => {
        try {
            const config = {
                headers: {

                    Authorization: `Bearer ${user.token}`
                }
            }
           
            const { data } = await axios.get(URL, config);
         
            setChats(data)
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error Occured!',
                description: "Failed to load Chat from myChat",
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    }
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('user')))
        fetchChat()
        // eslint-disable-next-line 
    }, [fetchAgain])
    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir='column'
            alignItems='center'
            p={3}
            bg='white'
            w={{ base: '100%', md: '31%' }}
            borderRadius='lg'
            borderWidth='1px'

        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: '28px', md: "30px" }}
                fontFamily='Work sans'
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                 width="100%"
            >
                <Text>My Chats  </Text>
                <GroupChatModel>

                <Button
                    display='flex'
                    fontSize={{ base: '17px', md: "10px", lg: "17px" }}
                    rightIcon={<AddIcon />}
                    >New Group Chat</Button>
                    </GroupChatModel>
            </Box>
            <Box
                display='flex'
                flexDir='column'
                p={3}
                bg='#F8F8F8'
                w='100%'
                h='100%'
                borderRadius='lg'
                overflowY='hidden'

            >
                {chats ? (
                    <Stack overflowY='scroll'

                    >
                        {chats.map((chat,ind) => {
                            return (
                                <Box
                                    onClick={() => setSelectedChat(chat)}
                                    cursor='pointer'
                                    _hover={{ background: "#38B2AC", color: 'white' }}
                                    bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                                    color={selectedChat === chat ? 'white' : 'black'}
                                    px={3}
                                    py={2}
                                    borderRadius='lg'
                                    key={ind}
                                >
                                    <Text>
                                        {!chat.isGroupChat ? (
                                            getSender(loggedUser, chat.users)
                                        ) : (chat.chatName)}
                                    </Text>

                                </Box>
                            )
                        })}

                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    )
}

export default MyChats
