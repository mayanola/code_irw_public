import React, { useState, useEffect, useRef } from 'react';
import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';
import './Chatbot.css';

const askApi = httpsCallable(functions, 'askApi');


const Chatbot = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const chatBodyRef = useRef(null);
    const loadingMessage = { sender: "bot", text: "", isLoading: true };

    const sendMessage = async () => {
        if (input.trim() === "") return;

        // Add user message to chat
        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages([...newMessages, loadingMessage]);
        setInput("");

        try {
            const instructions = localStorage.getItem('instructions');
            const question = newMessages[newMessages.length -1].text;

            const message = instructions + question;
            console.log(message);
            console.log(instructions);


            const response = await askApi(message);

            // console.log(response.data);

            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.isLoading ? { sender: "bot", text: response.data} : msg
                )
            );
            // setMessages([...newMessages, { sender: "bot", text: "response here"}]);
            // response.data
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);


    const handleInputChange = (e) => setInput(e.target.value);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    return (
        <div className={`chatbot-container ${isExpanded ? 'expanded' : ''}`}>
            <div className="chatbot-header">
                <button className="expand-toggle" onClick={toggleExpand}>
                    {isExpanded ? '−' : '+'}
                </button>
                <h4>Ask anything...</h4>
                <button onClick={onClose}>X</button>
            </div>
            <div className="chatbot-body" ref={chatBodyRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`chatbot-message ${message.sender} ${message.isLoading ? 'loading' : ''}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="chatbot-footer">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;