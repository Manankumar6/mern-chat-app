import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      {children ? <span onClick={onOpen}>{children}</span> : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size='lg' isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h='410px'>
          <ModalHeader
            fontSize='40px'
            display='flex'
            justifyContent='center'
          >{user ? "PROFILE" : 'Loading...'}

          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            alignItems='center'
          >
            <Image
              objectFit='cover'
              borderRadius='full'
              border="5px solid"  // Set the border width and style
              borderColor="gray.200"
              boxSize='150px'
              src={user.pic}
              alt={user.name}
            />
            {user ?
              <p
                style={{ fontSize: "2rem" }}
              >{user.name}</p> : 'Loading...'}
            <Text>Email : {user.email}</Text>
          </ModalBody>

          <ModalFooter>
            

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModel
