export const getSender = (loggedUser, users) => {
 

    // Check if loggedUser and users are defined and have the expected structure
    if (!loggedUser || !users || users.length < 2 || !users[0] || !users[1]) {
        // Return a fallback or handle the case where users is not as expected
        return "Unknown Sender";
    }

    return users[1]._id !== loggedUser._id ? users[1].name : users[0].name;
};


export const getSenderFull = (loggedUser, users) => {
    // Check if loggedUser and users are defined and have the expected structure
    if (!loggedUser || !users || users.length < 2 || !users[0] || !users[1]) {
        // Return a fallback or handle the case where users is not as expected
        return null;
    }

    return users[0]._id !== loggedUser._id ? users[1] : users[0];
};


export const isSameSender = (message,msg,ind,userId)=>{
    return(
        ind< message.length -1 && (
            message[ind+1].sender._id !== msg.sender._id || message[ind+1].sender._id === undefined
        ) && message[ind].sender._id !== userId
    )
}
export const isLastMessage = (message,ind,userId)=>{
    return(
        ind===message.length-1 && 
        message[message.length-1].sender._id !== userId && 
        message[message.length-1].sender._id 
    )
}

export const isSameSenderMargin = (message,msg,i,userId)=>{
    if(i< message.length-1 && message[i+1].sender._id === msg.sender._id && message[i].sender._id !== userId){

        return 33;
    }else if((i< message.length-1 && message[i+1].sender._id !== msg.sender._id && message[i].sender._id !== userId)|| (i === message.length-1 && message[i].sender._id !== userId)){
        return 0;
    }
    else return "auto";
}

export const isSameUser = (message,msg,i)=>{
    return i>0 && message[i-1].sender._id === msg.sender._id;
}