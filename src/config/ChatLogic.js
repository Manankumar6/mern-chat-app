export const getSender = (loggedUser, users) => {
   

    // Check if loggedUser and users are defined and have the expected structure
    if (!loggedUser || !users || users.length < 2 || !users[0] || !users[1]) {
        // Return a fallback or handle the case where users is not as expected
        return "Unknown Sender";
    }

    return users[0]._id !== loggedUser._id ? users[1].name : users[0].name;
};


export const getSenderFull = (loggedUser, users) => {
    // Check if loggedUser and users are defined and have the expected structure
    if (!loggedUser || !users || users.length < 2 || !users[0] || !users[1]) {
        // Return a fallback or handle the case where users is not as expected
        return null;
    }

    return users[0]._id !== loggedUser._id ? users[1] : users[0];
};
