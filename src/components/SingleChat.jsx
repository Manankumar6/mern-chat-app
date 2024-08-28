import React, { useEffect, useState } from 'react'
import { useChatContext } from '../context/chatContext'
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSenderFull, getSender } from '../config/ChatLogic';
import ProfileModel from './ProfileModel';
import UpdateGroupChatModal from '../miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

const ENDPOINT = process.env.REACT_APP_HOST_URL 
var socket, selectedChatCampare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = useChatContext();

    const [message, setMessage] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [messages, setMessages] = useState([])
    const [socketConnected,setSocketConnected] = useState(false)
    const [typing,setTyping] = useState(false)
    const [isTyping,setIsTyping] = useState(false)
    const toast = useToast();
    const MSG_URL = process.env.REACT_APP_BASE_MESSAGE_URL;

  // Socket io connntection 

  useEffect(() => {
    socket = io(ENDPOINT, { transports: ['websocket'] });
    socket.emit("setup",user);
    socket.on("connected",()=>{
        setSocketConnected(true)
    })
    socket.on('typing',()=>{
        setIsTyping(true)
    })
    socket.on('stop typing',()=>{
        setIsTyping(false)
    })

}, [])


    const fetchMessage = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true)
            const { data } = await axios.get(`${MSG_URL}/${selectedChat._id}`, config)

            setMessage(data)
            setLoading(false)
            socket.emit("join chat",selectedChat._id)

        } catch (error) {
            toast({
                title: 'Error Occured',
                description: "Failed to load the message",
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
    }
    useEffect(() => {
        fetchMessage()
        selectedChatCampare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat])

    const sendMessage = async (e) => {
        if ((e.key === 'Enter' || e.type === 'click') && newMessage) {
            socket.emit("stop typing", selectedChat._id);
    
            // Optimistically add the new message to the UI and emit the socket event
            const tempMessage = {
                _id: Date.now(),  // temporary ID until the server response
                sender: user,  // assuming user is the current sender
                content: newMessage,
                chat: selectedChat,
                createdAt: new Date(),
            };
    
            setMessage([...message, tempMessage]);
            socket.emit("new message", tempMessage);
    
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.post(MSG_URL, {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);
    
                // Update the temporary message with the actual data from the server
                setMessage(prevMessages => 
                    prevMessages.map(msg => 
                        msg._id === tempMessage._id ? data : msg
                    )
                );
            } catch (error) {
                // If the API call fails, remove the optimistically added message
                setMessage(prevMessages => prevMessages.filter(msg => msg._id !== tempMessage._id));
                
                toast({
                    title: 'Failed to send message',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                    position: 'bottom',
                });
            } finally {
                setNewMessage('');
            }
        }
    };
    

  

    useEffect(()=>{
        socket.on("message received",(newMessageReceived)=>{
            if(!selectedChatCampare || selectedChatCampare._id !== newMessageReceived.chat._id){
                // give notification 

            }else{
                setMessage([...message,newMessageReceived])
            }
        })
    })


    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        // Typing indicator logic 
        if(!socketConnected)return;
        if(!typing){
            setTyping(true)
            socket.emit('typing',selectedChat._id);

        }
        let lastTypingTime =new Date().getTime();
        var timerlength =3000;
        setTimeout(()=>{
            var timenow =new Date().getTime();
            var timeDiff = timenow - lastTypingTime
            if(timeDiff>= timerlength&& typing){
                socket.emit("stop typing ",selectedChat._id)
                setTyping(false)
            }
        },timerlength)
    }


    return (
        <>
            {selectedChat ? (<>
                <Text
                    fontSize={{ base: '28px', md: '30px' }}
                    pb={3}
                    px={2}
                    w='100%'
                    display='flex'
                    justifyContent={{ base: "space-between" }}
                    alignItems='center'

                >
                    <IconButton
                        display={{ base: "flex", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                    />
                    {!selectedChat.isGroupChat ? (<>
                        {getSender(user, selectedChat.users)}
                        <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                    </>) : (
                        <>
                            <Box>

                                {selectedChat.chatName.toUpperCase()}
                                <Text fontSize='12px'>
                                    {selectedChat.users.slice(0, 3).map(user => user.name).join(', ')}...
                                </Text>
                            </Box>
                            {<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessage={fetchMessage} />}
                        </>
                    )}
                </Text>
                <Box
                    display='flex'
                    flexDir='column'
                    justifyContent='flex-end'
                    p={3}
                    bg='#E8E8E8'
                    w='100%'
                    h='100%'
                    borderRadius='lg'
                    overflowY='hidden'
                >

                    {loading ? (

                        <Spinner
                            size='xl'
                            w={20}
                            h={20}
                            alignSelf='center'
                            margin='auto'
                        />

                    ) : (<div className='messages'>
                        {/* messages  */}
                        <ScrollableChat message={message} />
                    </div>)}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {isTyping?<div>Loading...</div>:<></>}
                        <Box
                        display='flex'
                        alignItems='center'
                        >

                        <Input
                            variant='filled'
                            bg='#E0E0E0'
                            placeholder='Enter a message'
                            onChange={typingHandler}
                            value={newMessage}
                            mr="15px"

                        />
                        <Button
                         colorScheme="blue"  // You can change the color scheme
                         borderRadius="50%"
                         p={2}
                         size="sm"
                         display="flex"
                         justifyContent="center"
                         alignItems="center"
                         onClick={sendMessage}
                         ><i class="fa-solid fa-arrow-right"></i></Button>

                         </Box>
                    </FormControl>
                </Box>
            </>) : (
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    h='100%'

                >
                    <Text fontSize='3xl' pb={3}>Click on a user to start chat</Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat
