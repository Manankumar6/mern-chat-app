import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useChatContext } from '../context/chatContext'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../components/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState('');
    const [search, setSearch] = useState('');  // Fixed here
    const [searchResult, setSearchResult] = useState([]);  // Fixed here
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const { selectedChat, setSelectedChat, user } = useChatContext();
    const toast = useToast();

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user.user._id && user1._id !== user.user._id) {
            toast({
                title: 'Only admin can add someone! ',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {

                    Authorization: `Bearer ${user.user.token}`
                }
            }
            const { data } = await axios.put('http://localhost:5000/api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: user1._id
            }, config);
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: 'Error Occured! ',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'bottom',
            });
        }

    }
    console.log(selectedChat,"SelectedChat data")
    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: 'User already in group! ',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user.user._id) {
            toast({
                title: 'Only admin can add someone! ',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {

                    Authorization: `Bearer ${user.user.token}`
                }
            }
            const { data } = await axios.put('http://localhost:5000/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: user1._id
            }, config);
            console.log(data)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: 'Error Occured! ',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'bottom',
            });
        }

    }
    const handleRename = async () => {
        if (!groupChatName) return
        try {
            setRenameLoading(true)
            const config = {
                headers: {

                    Authorization: `Bearer ${user.user.token}`
                }
            }
            const { data } = await axios.put('http://localhost:5000/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)

        } catch (error) {
            toast({
                title: 'Error Occured! ',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'bottom',
            });
            setRenameLoading(false)
        }
        setGroupChatName("")
    }
    const handleSearch = async (queary) => {
        setSearch(queary)
        if (!queary) {
            return;
        }
        try {

            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            }
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config)

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
            <IconButton
                display={{ base: 'flex' }}
                icon={<ViewIcon />}
                onClick={onOpen}>Open Modal</IconButton>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        display='flex'
                        justifyContent='center'
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            w='100%'
                            display='flex'
                            flexWrap='wrap'
                            pb={3}
                        >
                            {selectedChat.users.map((user) => {
                                return (
                                    <UserBadgeItem key={user._id} user={user} handleFunction={() => { handleRemove(user) }} />
                                )
                            })}
                            <FormControl
                                display='flex'
                            >
                                <Input placeholder='Chat Name' mb={3}
                                    value={groupChatName}
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                />
                                <Button
                                    variant='solid'
                                    colorScheme='teal'
                                    color='white'
                                    ml={1}
                                    isLoading={renameLoading}
                                    onClick={handleRename}
                                >
                                    Update
                                </Button>
                            </FormControl>
                            <FormControl>
                                <Input placeholder='Add user to group' mb={1}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </FormControl>
                            {loading ? <Spinner size='lg' /> : (
                                searchResult?.map((user) => {
                                    return (
                                        <UserListItem key={user._id} users={user} handleFunction={() => { handleAddUser(user) }} />
                                    )
                                })
                            )}
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal
