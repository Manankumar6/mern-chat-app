
import {createContext, useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
const ChatContext = createContext();

const ChatProvider = ({children})=>{
    const [user,setUser] = useState()
    const [selectedChat,setSelectedChat] = useState();
    const [chats,setChats] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("user"));
        setUser(userInfo)
        if(!userInfo){
            navigate('/')
        }
    },[navigate])
    return(
        <ChatContext.Provider value={{user,setUser,setSelectedChat,selectedChat,chats,setChats}}>

        {children}
        </ChatContext.Provider>
    )
}

const useChatContext = ()=>{
    return useContext(ChatContext)
}
export {ChatProvider,useChatContext}