import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("user"));
       
        if(userInfo){
            navigate('/chats')
        }
    },[navigate])
    return (
        <Container maxW='xl' centerContent >
            <Box
                display='flex'
                justifyContent='center'
                p={3}
                bg={'white'}
                w='100%'
                m='40px 0 15px 0'
                borderRadius='lg'
                borderWidth='1px'

            >
                <Text fontSize='4xl' color='black'>Talk-A-Triv</Text>
            </Box>
            <Box bg={'white'}
                w='100%'
                borderRadius='lg'
                borderWidth='1px' p={4} >
                <Tabs variant='soft-rounded' >
                    <TabList mb='1em'>
                        <Tab width='50%'>Login</Tab>
                        <Tab width='50%'>Sign up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                           <Login/>
                        </TabPanel>
                        <TabPanel>
                           <Signup/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Home
