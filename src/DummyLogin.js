import React, { useState } from "react";
import { firestore } from "./firebase";
// import "./Login.css"
// import CustomAlert from "../Misc/CustomAlert";

const DummyLogin = () => {
    const [alertMessage, setAlertMessage] = useState("")

    function signIn() {
        try {
            // Grab the values from the username and password boxes
            const username = document.getElementById("username-input-box");
            const password = document.getElementById("password-input-box");

            if (username.value.length === 0) {
                // User did not input a username
                setAlertMessage("Input a username")
            } else if (password.value.length === 0) {
                // User did not input a password
                setAlertMessage("Input a password")
            } else {
                // Check if the user exists in the database
                const collectionRef = firestore.collection("users");
                collectionRef.where("username", "==", username.value)
                    .get()
                    .then((querySnapshot) => {
                        if (querySnapshot.size > 0) {
                            // User exists, check password value
                            if (querySnapshot.size > 1) {
                                // This should never happen
                                console.log("Error: More than one user with username.")
                                alert("Apologies! The system has an error. Try creating a new account.")
                            } else {
                                const doc = querySnapshot.docs[0]
                                const checkPassword = doc.data().password;
                                if (checkPassword === password.value) {
                                    // Open the user's home page
                                    window.location.href = `/home/${doc.id}`;
                                    console.log('woohoo!')
                                } else {
                                    console.log("Incorrect password")
                                    alert("Incorrect password")
                                }
                            }
                        } else {
                            console.log("Username does not exist")
                            alert("Username does not exist")
                        }
                    });
            }
        } catch (error) {
            alert("Error")
        }
    };

    function createUser() {
        try {
            // Grab the values from the username and password boxes
            const username = document.getElementById("username-input-box");
            const password = document.getElementById("password-input-box");

            if (username.value.length === 0) {
                // User did not input a username
                setAlertMessage("Input a username")
            } else if (password.value.length === 0) {
                // User did not input a password
                setAlertMessage("Input a password")
            } else {
                // const collectionRef = firestore.collection("users");
                // collectionRef.where("username", "==", username.value)
                //     .get()
                //     .then((querySnapshot) => {
                //         if (querySnapshot.size > 0) {
                //             setAlertMessage("Username is already taken!")
                //         } else {
                //             // User does not exist, create the user
                //             collectionRef.add({
                //                 username: username.value,
                //                 password: password.value,
                //             }).then((doc) => {
                //                 // Open that project in the editor
                //                 window.location.href = `/home/${doc.id}`;
                //             }).catch((error) => {
                //                 console.error("Error creating project: ", error);
                //             });
                //         }
                //     });
                console.log('username', username.value)
            }
        } catch (error) {
            setAlertMessage("Error")
        }
    }

    return (
        <div className="login-div">
            <div className="math-ide-title">Welcome!</div>
            <div className="login-form">
                <div className="login-form-label">
                    <span>Username:</span>
                    <input className="login-form-label-input" id="username-input-box" type="text" />
                </div>
                <div className="login-form-label">
                    <span>Password:</span>
                    <input className="login-form-label-input" id="password-input-box" type="password" />
                </div>
            </div>
            <div className="sign-in-button-div">
                <button
                    className="sign-in-button"
                    type="submit"
                    onClick={signIn}>
                    Sign In
                </button>
                <button
                    className="sign-in-button"
                    type="submit"
                    onClick={createUser}>
                    Create New User
                </button>
            </div>
            {/* {alertMessage && (
                <CustomAlert
                    message={alertMessage}
                    buttonText="OK"
                    onClose={() => setAlertMessage("")}
                />
            )} */}
        </div>
    );
};

export default DummyLogin;
