import React from 'react';
import { useParams } from 'react-router-dom';

// A temporary JSON object to represent an example set of tasks
// In the future, this will be passed in to the component or 
// loaded from the database.
const temp_json_tasks = {
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
}

const SubstepPage = () => {
    const { stepIndex, substepIndex } = useParams();

    return (
        <div style={{ marginLeft: '270px', padding: '20px', overflow: `auto`, height: `100%`}}>
        </div>
    );
}

export default SubstepPage;