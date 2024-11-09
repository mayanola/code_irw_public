import './ProjectPage.css'; 
import Chatbot from './Chatbot.js';import React, { useEffect, useState } from 'react';
import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { Link, Outlet } from 'react-router-dom';

//const generateInstructions = httpsCallable(functions, 'generateInstructions');
const generateInstructions = httpsCallable(functions, 'generateInstructions2');

// Video functions
const getYoutubeKeywords = httpsCallable(functions, 'getYoutubeKeywords');
const getYouTubeVideo = httpsCallable(functions, 'getYouTubeVideo');

const temp_json_tasks = {
    "Project Summary": "Design Portfolio Website",
    "Steps": [
      {
        "Step 1": "Set Up Development Environment",
        "Substeps": [
          "Download and install Visual Studio Code (VSCODE)",
          "Install Node.js and npm (Node Package Manager)",
          "Verify installation by running `node -v` and `npm -v` in the terminal"
        ]
      },
      {
        "Step 2": "Learn the Basics of HTML, CSS, and JavaScript",
        "Substeps": [
          "Complete an online course or tutorial on HTML, CSS, and JavaScript",
          "Practice by building simple static web pages",
          "Familiarize yourself with browser developer tools (F12 in most browsers)"
        ]
      },
      {
        "Step 3": "Learn the Basics of React",
        "Substeps": [
          "Understand the concept of components, props, and state",
          "Follow the official React tutorial on creating a simple React app",
          "Experiment by building a small project, like a to-do list or a simple calculator"
        ]
      },
      {
        "Step 4": "Set Up Firebase for Hosting and Database",
        "Substeps": [
          "Create a Firebase project at https://firebase.google.com",
          "Set up Firebase Hosting by following the official Firebase documentation",
          "Install Firebase tools by running `npm install -g firebase-tools`",
          "Initialize Firebase in your project by running `firebase init` and selecting Hosting and Firestore (if needed)",
          "Deploy a simple static website to Firebase to test the hosting setup"
        ]
      },
      {
        "Step 5": "Design the Layout and Structure of Your Portfolio",
        "Substeps": [
          "Sketch or wireframe the design of your portfolio website",
          "Decide on the sections you want to include (e.g., About, Projects, Contact)",
          "Use Figma, Sketch, or another design tool to create a visual design"
        ]
      },
      {
        "Step 6": "Develop the Portfolio Website Using React",
        "Substeps": [
          "Set up a new React project using `npx create-react-app portfolio`",
          "Create components for each section of your portfolio (e.g., Header, ProjectList, Footer)",
          "Use CSS or a CSS framework (e.g., Bootstrap, Tailwind) to style your components",
          "Integrate Firebase to store and retrieve project data dynamically"
        ]
      },
      {
        "Step 7": "Add Interactivity and Animations",
        "Substeps": [
          "Use React Router to enable navigation between different sections/pages",
          "Add animations using CSS transitions or libraries like Framer Motion",
          "Test interactivity and responsiveness on different devices"
        ]
      },
      {
        "Step 8": "Test and Debug Your Website",
        "Substeps": [
          "Test your website on multiple browsers and devices",
          "Fix any bugs or issues that arise during testing",
          "Ensure that the website is fully responsive and works well on mobile"
        ]
      },
      {
        "Step 9": "Deploy Your Portfolio Website",
        "Substeps": [
          "Deploy the final version of your website using Firebase Hosting",
          "Set up a custom domain if desired (Firebase offers free SSL for custom domains)",
          "Verify that your website is live and accessible from the web"
        ]
      },
      {
        "Step 10": "Maintain and Update Your Portfolio",
        "Substeps": [
          "Regularly update your portfolio with new projects and content",
          "Monitor website performance and optimize as needed",
          "Keep learning and experimenting with new web development tools and techniques"
        ]
      }
    ],
    "Name": "Ishita"
  }
  
const temp_json_tasks1 = {
    "Project Summary": "Biology Data Analysis",
    "Steps": [
        {
            "Step 1": "Download VSCODE",
            "Substeps": [
                "Go to VSCODE.com",
                "Download it"
            ]
        },
        {
            "Step 2": "Learn R",
            "Substeps": [
                "Download R",
                "Learn R very well"
            ]
        },
        {
            "Step 3": "Learn Python",
            "Substeps": [
                "Download Python",
                "Learn Python very well"
            ]
        }
    ],
    "Name": "Carolyn"
};

const getVideo = () => {
    //This version does not work for some reason, you need an embeddable link
    // const videoUrl = "https://youtu.be/fa8k8IQ1_X0?si=zSOct9b56eNUGikJ";

    // const videoUrl = "https://www.youtube.com/embed/fa8k8IQ1_X0";
    const videoUrl = "https://www.youtube.com/embed/CPmQwlycfGI";
    return (
        <div className="video-container">
            <h3>Related Video</h3>
            <iframe
                width="560"
                height="315"
                src={videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

const fetchVideoForStep = async (plan, stepIndex, substepIndex, setLoading, setVideoComponent) => {
    // Get the step and substep just like in fetchInstructions
    const step = plan.Steps[stepIndex];
    const substep = step.Substeps[substepIndex];
    
    setLoading(true); // Set loading state to true while fetching

    try {
        // Step 1: Get the keywords using getYoutubeKeywords
        const keywordResponse = await getYoutubeKeywords({
            plan: plan, // Pass the whole plan
            step: `Step ${stepIndex + 1}`,
            substep: substep
        });

        const keywords = keywordResponse.data.keywords;

        // Step 2: Use the keywords to get the YouTube video
        const videoResponse = await getYouTubeVideo({ keywords });
        const videoUrl = videoResponse.data.videoUrl;

        // Step 3: Update the video component with the fetched video URL
        setVideoComponent(
            <div className="video-container">
                <h3>Related Video</h3>
                <iframe
                    width="560"
                    height="315"
                    src={videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        );
    } catch (error) {
        console.error("Failed to fetch video:", error);
        setVideoComponent(
            <div className="video-container">
                <h3>Failed to load video</h3>
            </div>
        );
    } finally {
        setLoading(false); // Set loading state to false once fetching is complete
    }
};



const ProjectPage = () => {
    const userID = localStorage.getItem('userID');
    const projectID = localStorage.getItem('projectID');
    const plan = JSON.parse(localStorage.getItem('plan'));
    const [showChatbot, setShowChatbot] = useState(false);
    const [instructions, setInstructions] = useState(null);
    const [currentTitle, setCurrentTitle] = useState(""); // State to hold the current title
    const [loading, setLoading] = useState(false); // State to handle loading

    // const app = initializeApp(firebaseConfig);
    // const db = getFirestore(app);
    // const userID = localStorage.getItem('userID');
    // const projectID = localStorage.getItem('projectID');

    const userId = 'ishita'; // Document ID for Ishita
    const projectId = 'PersonalDesignPortfolio'; // Document ID for the Personal Design Portfolio

    //write a backend function that takes in a userID and a projectID and returns the project plan 
    // // State to hold the fetched JSON data
    // const [temp_json_tasks, setTempJsonTasks] = useState(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const docRef = doc(db, 'users', userId, 'Projects', projectId);
    //             const docSnap = await getDoc(docRef);

    //             if (docSnap.exists()) {
    //                 const data = docSnap.data();
    //                 const parsedData = JSON.parse(data.jsonString); // Parse the JSON string
    //                 setTempJsonTasks(parsedData); // Store the parsed data in state
    //             } else {
    //                 console.log("No such document!");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching document:", error);
    //         }
    //     };

    //     fetchData();
    // }, [userId, projectId]);
    // const plan = localStorage.getItem('plan');

    const toggleChatbot = () => {
        setShowChatbot(!showChatbot);
    };
    // console.log(userID, projectID);
    // console.log(plan);

    // State to keep track of the checked status of each substep
    const [checked, setChecked] = useState(
        plan.Steps.map(step =>
            step.Substeps.map(() => false)
        )
    );
    const Spinner = () => (
        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    );

    const handleCheckboxChange = (stepIndex, substepIndex) => {
        const newChecked = checked.map((step, i) =>
            step.map((substep, j) => (i === stepIndex && j === substepIndex ? !substep : substep))
        );
        setChecked(newChecked);
    };

    const fetchInstructions = async (stepIndex, substepIndex) => {
        // Set the current title
        const step = plan.Steps[stepIndex];
        const substep = step.Substeps[substepIndex];
        setCurrentTitle(`Step ${stepIndex + 1}: ${substep}`);

        setLoading(true);

        // Clear the current instructions to prevent old instructions from being visible
    
        try {
            const response = await generateInstructions({
                plan: plan,
                step: `Step ${stepIndex + 1}`,
                substep: substep
            });
            console.log(response.data);
    
            setInstructions(response.data.instructions.split('\n'));
            localStorage.setItem('instructions', response.data.instructions);
        } catch (error) {
            console.error("Failed to fetch instructions:", error);
            setInstructions("Failed to fetch instructions.");
        } finally {
            setLoading(false);
        }
    };

    
    const totalCheckboxes = checked.reduce((acc, step) => acc + step.length, 0);
    const checkedCheckboxes = checked.reduce((acc, step) => acc + step.filter(substep => substep).length, 0);
    const progress = (checkedCheckboxes / totalCheckboxes) * 100;

    return (
        <div className="container">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"></link>
            <div className="side-pane">
                <h1>{plan["Project Summary"]}</h1>
                <i class="fas fa-arrow-right arrow-icon"></i>

                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>

                {/* Display each of the steps */}
                <div>
                    {plan.Steps.map((step, stepIndex) => (
                        <div key={stepIndex}>
                            <h2>{Object.keys(step)[0]}: {Object.values(step)[0]}</h2>
                            <ul>
                                {step.Substeps.map((substep, substepIndex) => (
                                    <li key={substepIndex}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={checked[stepIndex][substepIndex]}
                                                onChange={() => handleCheckboxChange(stepIndex, substepIndex)}
                                            />
                                            <Link
                                                to={`/project/step/${stepIndex}/substep/${substepIndex}`}
                                                onClick={() => fetchInstructions(stepIndex, substepIndex)}
                                            >
                                                {substep}
                                            </Link>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                {/* <footer>
                    <p>Name: {plan.Name}</p>
                </footer> */}
            </div>
            <div className="content-pane">
                <div style={{ marginLeft: '50px', padding: '20px' }}>
                    {currentTitle && <h2>{currentTitle}</h2>}
                    {loading ? (
                        <Spinner />
                    ) : (
                        Array.isArray(instructions) && instructions.length > 0 ? (
                            instructions.map((line, index) => {
                                const trimmedLine = line.trim();
                                
                                // Check if the line starts with "1." or "2."
                                if (/^\d+\.\s/.test(trimmedLine)) {
                                    return (
                                        <div key={index}>
                                            <h4>{trimmedLine}</h4>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={index}>
                                            <p>{trimmedLine}</p>
                                        </div>
                                    );
                                }
                            })
                        ) : (
                            <h2 className="animated-text" style={{textAlign:`center`, marginTop:`25%`}}>Start working on your plan to the left!</h2>
                        )
                    )}
                </div>
                <Outlet />
                {/* Call the getVideo function to display the YouTube video at the bottom */}
            {getVideo()}

                    <button className="chatbot-toggle" onClick={toggleChatbot}>
                        Stuck?
                    </button>
                    {showChatbot && <Chatbot onClose={toggleChatbot} />}
            </div>

        </div>
    );
};

export default ProjectPage;