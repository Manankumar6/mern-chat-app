import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useChatContext } from '../context/chatContext'
import axios from 'axios'
import UserListItem from '../components/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

const GroupChatModel = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const { user, chats, setChats } = useChatContext();
    const URL = process.env.REACT_APP_BASE_USER_URL;
    const CHAT_URL = process.env.REACT_APP_BASE_CHAT_URL;
   
    const handleSearch = async (queary) => {
        setSearch(queary)
        if (!queary) {
            return;
        }
        try {

            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`${URL}?search=${search}`, config)
       
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
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Please fill all the feilds',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'top',
            });
            return;
        }
        try {
            const config = {
                headers: {

                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(`${CHAT_URL}/group`,{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((u)=>u._id))
            }, config);
        
            setChats([data,...chats])
            onClose()
            toast({
                title: 'New Group Chat Created!',
                status: 'success',
                duration: 4000,
                isClosable: true,
                position: 'bottom',
            });
        } catch (error) {
            toast({
                title: 'Failed to create the Chat ',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'bottom',
            });
        }
    }
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User already added',

                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'top',
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((user) => user._id !== delUser._id));
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        display='flex'
                        justifyContent='center'
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                    >
                        <FormControl>
                            <Input placeholder='Chat Name' mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add users eg: Manan, Naman, Yaman' mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {/* selected users  */}
                        <Box
                            w="100%"
                            display='flex'
                            flexWrap='wrap'
                        >

                            {selectedUsers.map((u,ind) => {
                                return (<UserBadgeItem key={ind} user={u} handleFunction={() => { handleDelete(u) }} />)
                            })}
                        </Box>
                        {/* Render search users  */}

                        {loading ? <div>Loading</div> : (
                            searchResult?.slice(0, 4).map(user => {
                                return (
                                    <UserListItem key={user._id} users={user} handleFunction={() => { handleGroup(user) }} />
                                )
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>

                            Create Chat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModel
