// Generate session ID and return it
import { useState, useEffect } from 'react';
function generateSessionId() {
        const [userName, setUserName] = useState('');
        const email = localStorage.getItem("email");
        if (email) {
            let name = email.split('@')[0];
            setUserName(name + Math.floor(Math.random() * 1000));
        }
        return userName;
}

// console.log("Session ID generated: " + generateSessionId());