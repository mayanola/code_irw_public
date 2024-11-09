import { useEffect } from "react";

function NewProject({ userRef, userId }) {
    useEffect(() => {
        console.log('NewProject component mounted')
    }, [])

    function goToIntro(projectId) {
        window.location.href = `/intro/${userId}/${projectId}`
    }

    async function createProject(e) {
        e.preventDefault();
        console.log('Creating project...')

        // Grab the project name from the input field
        const name = document.querySelector("input").value;
        console.log(name)

        // Create a new blank project
        const projectDoc = await userRef.collection("projects").add({
            projectName: name
        })
        console.log('Project created!', projectDoc.id)
        goToIntro(projectDoc.id)
    }


    return (
        <div className="new-project">
            <h2>Create a New Project</h2>
            <form>
                <label>
                    Project Name:
                    <input type="text" />
                </label>
                <button
                    onClick={(e) => createProject(e)}>
                    Create Project
                </button>
            </form>
        </div>
    );
}

export default NewProject;