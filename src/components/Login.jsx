import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);

        // Validate form fields
        if (!formData.email || !formData.password) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }

        try {
            // Simulate an API request (adjust the endpoint as needed)
            const { data } = await axios.post('http://localhost:5000/api/user/login', formData);

            toast({
                title: 'Login Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });

            // Save user data to local storage or context
            localStorage.setItem('user', JSON.stringify(data));
            setLoading(false)
            // Redirect to a different page after login
            navigate('/chats');
        } catch (error) {
            toast({
                title: 'Login Failed',
                description: error.response?.data?.message || 'Something went wrong',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = () => {
        // Set guest user credentials
        setFormData({
            email: 'guest@example.com',
            password: 'password123',
        });
    };

    return (
        <VStack spacing="5px" color="black">
            <FormControl isRequired>
                <FormLabel>E-mail</FormLabel>
                <Input
                    name="email"
                    placeholder="Enter Your E-mail"
                    value={formData.email}
                    onChange={handleInput}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        name="password"
                        type={show ? 'text' : 'password'}
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleInput}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme="blue"
                style={{ marginTop: 15 }}
                width="100%"
                onClick={handleSubmit}
                isLoading={loading}
            >
                Log in
            </Button>
            <Button
                colorScheme="red"
                style={{ marginTop: 5 }}
                width="100%"
                onClick={handleGuestLogin}
            >
                Use Guest User Credentials
            </Button>
        </VStack>
    );
};

export default Login;
