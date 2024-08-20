import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        pic: null,
    });

   
    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const postDetails = async (pics) => {
        setLoading(true);
        if (!pics) {
            toast({
                title: 'Please Select An Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', 'chat-app');
            data.append('cloud_name', 'dc761iynx');

            try {
                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dc761iynx/image/upload',
                    data
                );
                if (response.data.url) {
                    setFormData((prevState) => ({
                        ...prevState,
                        pic: response.data.url,
                    }));
                    toast({
                        title: 'Image Uploaded Successfully',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        position: 'bottom',
                    });
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                toast({
                    title: 'Error Uploading Image',
                    description: 'Please try again later.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom',
                });
            }
        } else {
            toast({
                title: 'Please Select a Valid Image File',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        setLoading(true);

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
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

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: 'Passwords do not match',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }

        if (!formData.pic) {
            toast({
                title: 'Please upload a picture',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post('http://localhost:5000/api/user/signup', formData);
            toast({
                title: 'Signup Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            localStorage.setItem("user", JSON.stringify(data));
            navigate('/chats');
        } catch (error) {
            toast({
                title: 'Signup Failed',
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

    return (
        <VStack spacing="5px" color="black">
            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    name="name"
                    placeholder="Enter Your Name"
                    value={formData.name}
                    onChange={handleInput}
                />
            </FormControl>
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
            <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        name="confirmPassword"
                        type={show ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInput}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel>Upload your picture</FormLabel>
                <Input
                    name="picture"
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme="blue"
                style={{ marginTop: 15 }}
                width="100%"
                onClick={handleSubmit}
                isLoading={loading}
            >
                Sign up
            </Button>
        </VStack>
    );
};

export default Signup;
