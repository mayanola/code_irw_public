// Define the questions that will always be asked in the form
const fundamentalQuestions = [
    "Describe your project in as much detail as possible.",
    "Describe any relevant background that you have in as much detail as possible."
]

// Return the current question based on the index
// Update the index to the next question
export const getFundamentalQuestion = async (currentIndex, setCurrentIndex) => {
    // If the current index is out of bounds, return null
    if (currentIndex >= fundamentalQuestions.length) {
        return null;
    }

    // Grab the current question
    const currentQuestion = fundamentalQuestions[currentIndex];

    // Increment the index
    setCurrentIndex(currentIndex + 1);

    // Otherwise, return the current question
    return currentQuestion;
}