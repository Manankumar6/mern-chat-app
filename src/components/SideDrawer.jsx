import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useChatContext } from '../context/chatContext'
import ProfileModel from './ProfileModel'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserListItem from './UserListItem'
import { getSender } from '../config/ChatLogic'


const SideDrawer = () => {
    const { user,setSelectedChat ,chats,setChats,notification,setNotification} = useChatContext();
    
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [search, setSearch] = useState('')

    const [searchResult, setSearchResult] = useState([])

    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    const navigate = useNavigate()
    const toast = useToast();
    const URL = process.env.REACT_APP_BASE_CHAT_URL;
    const USER_URL = process.env.REACT_APP_BASE_USER_URL;
  
    const logOutHandler = () => {
        localStorage.removeItem('user')
        navigate('/')
    }
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.post(URL, { userId }, config);
         
    
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }
            setSelectedChat(data.chats);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            console.error('Error details:', error); // Log error details
    
            toast({
                title: 'Error Occurred!',
                description: `Failed to load the chats. Error: ${error.message || error}`,
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'bottom-left',
            });
            setLoadingChat(false);
        }
    };
    
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please Enter Something In Search',

                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: 'top-left',
            });
            return;


        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`${USER_URL}?search=${search}`, config)
           
            setLoading(false)
            setSearchResult(data.users)
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error Occured!',
                description: "Failed to load the search results",
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    }
    return (
        <>
            <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                bg='white'
                p='5px 10px '
                borderWidth='5px'
            >
                <Tooltip label="Search users to chat" hasArrow placement='bottom-end'>
                    <Button variant='ghost' onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text
                            display={{ base: "none", md: "flex" }}
                            px='4'
                        >Search User</Text>
                    </Button>
                </Tooltip>

                <Text fontSize='2xl'>Talk-A-Tive</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                           
                            <BellIcon fontSize='2xl' m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && 'No New Message'}
                            {notification.map(notif=>{
                                return <MenuItem key={notif._id} onClick={()=>{
                                    setSelectedChat(notif.chat)
                                    setNotification(notification.filter((n)=>n!==notif))
                                }}>
                                    {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName }`:`New Message form ${getSender(user,notif.chat.users)}`}
                                
                                </MenuItem>
                            })}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size='sm' cursor="pointer" name={user.name}
                                src={user.pic}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>

                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={logOutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer
                placement='left'
                onClose={onClose}
                isOpen={isOpen}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box
                            display='flex'
                            pb={2}
                        >
                            <Input placeholder='Search by name or email' mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button
                                onClick={handleSearch}
                            >Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult && searchResult.map((users, ind) => (
                                <UserListItem key={ind} users={users} handleFunction={() => accessChat(users._id)} />
                            ))
                        )}
                        {loadingChat&& <Spinner ml='auto' display='flex'/>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer
