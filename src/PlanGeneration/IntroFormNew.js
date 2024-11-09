import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { useParams } from "react-router-dom";
import { getFundamentalQuestion } from './FundamentalQuestionsLogic';
import { getPlanFollowUpQuestion } from './PlanFollowUpLogic';
import { getSkillIdentificationQuestion } from './SkillIdentificationLogic';
import { getConfirmationQuestion } from './ConfirmationLogic';
import { generatePlan } from './PlanGenerationLogic';

function IntroFormNew() {
    // Grab the user ID and project ID from the URL
    const { userId, projectId } = useParams();

    // The currentIndex represents the index of the current question in this phase
    const [currentIndex, setCurrentIndex] = useState(0);

    // Initialize the current phase to 0
    const [currentPhase, setCurrentPhase] = useState(0);

    // The current question that the user is answering
    const [currentQuestion, setCurrentQuestion] = useState("");

    // On component mount, get the first question
    useEffect(() => {
        getNextQuestion();
    }, []);

    // Store the question and response pair as fields of this project
    async function storeResponse(response) {
        // Save the response to the database as a field of the project
        const projectRef = firestore.collection("users").doc(userId).collection("projects").doc(projectId);
        await projectRef.set({
            [currentQuestion]: response
        }, { merge: true });
    }

    // Update the current question and phase
    async function getNextQuestion() {
        // The functions to generate a question at each phase
        const questionFunctions = [
            getFundamentalQuestion,
            getPlanFollowUpQuestion,
            getSkillIdentificationQuestion,
            getConfirmationQuestion
        ];

        // Store the current phase in a local variable
        let phase = currentPhase;

        // Get the current question for the current phase
        let question = await questionFunctions[phase](currentIndex, setCurrentIndex);

        // While the question is null and we have not reached the end of the phases,
        // move to the next phase
        while (question === null) {
            // Move to the next phase
            phase++;

            // Check if we have reached the end of the phases
            if (phase === questionFunctions.length) {
                break;
            }

            // Get the next question
            question = await questionFunctions[phase](currentIndex, setCurrentIndex);
        }

        if (question === null) {
            // We are done with questions! Generate the plan
            await generatePlan(userId, projectId);
        } else {
            // Update the current question and phase
            setCurrentQuestion(question);
            setCurrentPhase(phase);
        }
    }


    // Store the user's response to the current question and move to the next step
    async function handleNext(e) {
        // Prevent the form from submitting
        e.preventDefault();

        // Grab the response from the form
        const response = document.querySelector("textarea").value;
        if (!response) {
            alert("Please enter a response.");
            return;
        }

        // Clear the text area
        document.querySelector("textarea").value = "";

        // Save the data from the form
        await storeResponse(response);

        // Move to the next question
        await getNextQuestion();
    }

    return (
        <div className="intro-form">
            <h2>Project Introduction</h2>
            <form>
                <label>
                    {currentQuestion}
                    <textarea />
                </label>
                <button
                    onClick={(e) => handleNext(e)}>
                    Next
                </button>
            </form>
        </div>
    );
}

export default IntroFormNew;