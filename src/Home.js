import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "./firebase";
import ProjectDisplay from "./ProjectDisplay";
import NewProject from "./NewProject";

function Home() {

    // Grab the user ID from the URL
    const { userId } = useParams();

    // Reference to the user's data in the database
    const [userRef, setUserRef] = useState(null);

    useEffect(() => {
        console.log('im here')
        const ref = firestore.collection("users").doc(userId);
        setUserRef(ref);
    }, [userId]);

    return (
        <div className="home-page">
            <ProjectDisplay
                userRef={userRef}
                userId={userId}
            />
            <NewProject
                userRef={userRef}
                userId={userId}
            />
        </div>
    );
}

export default Home;
