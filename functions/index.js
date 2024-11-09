const functions = require('firebase-functions/v1');
const cors = require('cors')({ origin: true });
const axios = require('axios');

require('dotenv').config();

// Setup the OpenAI API
const API_KEY = process.env.CHATGPT_API_KEY; 

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: API_KEY });

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
const { projectID } = require('firebase-functions/params');
admin.initializeApp();

exports.generateSkills = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
      try {
        const {who, what, how_learn, timeline, goals, design, dataset, additional} = req.body.data.newFormData;

        skillsSystemMessage = {
            role: "system",
            content: `You are tasked with generating a plan specific to the user's individual needs to help them 
            learn how to build a project with a limited programming background. What skills does the user need to
            develop to comprehensively build their project? Return a json of the fewest number of questions you need to ask
            to achieve this in the following format:
            {
              "skills": [
                {
                  "skill": "React JS"
                },
                {
                  "skill": "Python""
                },
                {
                  "skill": "Firebase"
                },
                {
                  "skill": "HTML" 
                },
                {
                  "skill": "CSS"
                },
                {
                  "skill": "GitHub"
                }
              ]
            }`
          };

        const skillsUserMessage = {
            role: 'user',
            content: `This is the information you already have about the user. Only return a json in your response of what skills they require to build their project
            and no other words at all:`+
            `Who: ${who}, What: ${what}, How to Learn: ${how_learn}, Timeline: ${timeline}, Goals: ${goals}, Design: ${design}, Dataset: ${dataset}, Additional: ${additional}`
          };
        
        const skillsCompletions = await openai.chat.completions.create({
          messages: [
            skillsSystemMessage,
            skillsUserMessage
          ],
          model: "gpt-4",
        });
    
        const skillsResponse = skillsCompletions.choices[0].message.content;

        res.status(200).json({ result: skillsResponse});
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        res.status(500).json({ error: "Failed to call OpenAI API" });
      }
    });
});


exports.generateSummary = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const data = req.body.data.newFormData;
      const info = JSON.stringify(data);
      functions.logger.log(`the info is ${info}`);

      generateSummarySystemMessage = {
        role: "system",
        content: `You are tasked with generating a plan specific to the user's individual needs to help them 
        learn how to build a project with a limited programming background. Generate a summary of their project.`
      };

      const generateSummaryUserMesssage = {
          role: 'user',
          content: `This is the information you already have about the user. Your response should be 50 words long: ${info}`
        };
    
      const generateSummaryCompletions = await openai.chat.completions.create({
        messages: [
          generateSummarySystemMessage,
          generateSummaryUserMesssage
        ],
        model: "gpt-4",
      });
  
      const apiResponse = generateSummaryCompletions.choices[0].message.content;

      functions.logger.log(apiResponse);
      res.status(200).json({ result: apiResponse});
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      res.status(500).json({ error: "Failed to call OpenAI API" });
    }
  });
});

// Take the text parameter passed to this HTTP endpoint and insert it into Firestore under the path /messages/:documentId/original
exports.followUp = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
      try {
        // const {who, what, how_learn, timeline, skills, goals, design, dataset, additional} = req.body.data.newFormData;
        const data = req.body.data.newFormData;

        followuSystemMessage = {
            role: "system",
          // content: `You are tasked with generating a plan specific to the user's individual needs to help them 
          // learn how to build a project with a limited programming background. What further information do you need
          // from the user to accurately generate this plan? Return a json of the fewest number of questions you need to ask
          // to achieve this in the following format:
          // {
          //   "questions": [
          //     {
          //       "question": "What is the specific project you want to build?"
          //     },
          //     {
          //       "question": "What is your current level of programming knowledge?"
          //     },
          //     {
          //       "question": "What programming languages are you comfortable with?"
          //     },
          //     {
          //       "question": "Have you ever worked on a similar project before?" 
          //     },
          //     {
          //       "question": "What tools and software are you familiar with and comfortable using?"
          //     },
          //     {
          //       "question": "What resources are you currently using to learn programming?"
          //     }
          //   ]
          // }`
          content: `You are tasked with generating a plan specific to the user's individual needs to help them 
          // learn how to build a project with a limited programming background. What further information do you need
          // from the user to accurately generate this plan? Return a json of the fewest number of questions you need to ask
          // to achieve this in the following format:
          // {
          //   "questions": [
          //     {
          //       "question": "question1"
          //     },
          //     {
          //       "question": "question2"
          //     }
          //   ]
          // }`
        };

        const followupUserMesssage = {
            role: 'user',
            content: `This is the information you already have about the user. Only return a json in your response and no other words 
            at all: ${data}`
          };
          
        const followUpCompletions = await openai.chat.completions.create({
          messages: [
            followuSystemMessage,
            followupUserMesssage
          ],
          model: "gpt-4",
        });
    
        const followUpResponse = followUpCompletions.choices[0].message.content;

        res.status(200).json({ result: followUpResponse});
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        res.status(500).json({ error: "Failed to call OpenAI API" });
      }
    });
});

exports.generatePlan = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const data = req.body.data.newFormData;
      const info = JSON.stringify(data);
      functions.logger.log(info);

      generatePlanSystemMessage = {
        role: "system",
        content: `You are tasked with generating a plan specific to the user's individual needs to help them 
        learn how to build a project with a limited programming background. Generate a plan only in this JSON format:
        {
          "Project Summary": "Biology Data Analysis",
          "Steps": [
            {
              "Step 1": "Step heading 1",
              "Substeps": [
                "Go to website xyz.com",
                "Download xyz"
              ]
            },
            {
              "Step 2": "Step heading 2",
              "Substeps": [
                "Do this step"
              ]
            },
            {
              "Step 3": "Step heading 3",
              "Substeps": [
                "do this step"
              ]
            }
          ],
          "User": "Description of User"
        }`
      };

      const generatePlanUserMesssage = {
          role: 'user',
          content: `This is the information you already have about the user. Only return a json in your response and no 
          other words at all: ${info}`
        };
    
      const generatePlanCompletions = await openai.chat.completions.create({
        messages: [
          generatePlanSystemMessage,
          generatePlanUserMesssage
        ],
        model: "gpt-4",
      });
  
      const apiResponse = generatePlanCompletions.choices[0].message.content;
      functions.logger.log(apiResponse);

      try {
        // generate new user doc under users collection with random id
        const userRef = admin.firestore().collection("users").doc();
        functions.logger.log(userRef);
        const userID = userRef.id;

        // if the 'projects' collection does not exist, will create this collection, otherwise will add doc to existing collection
        // generates new doc w random ID for new project created under 'projects'
        const projectRef = userRef.collection('projects').doc();
        const projectID = projectRef.id;

        const writeResult = await admin
        .firestore()
        .collection('users')
        .doc(userID)
        .collection('projects')
        .doc(projectID)
        .set({
            ...data,
            apiResponse,
            timestamp: Date.now()
        });

          functions.logger.log(`Info written - User ID: ${userID} Project ID: ${projectID}`);
          res.status(200).json({ result: {userID, projectID, apiResponse}});
      } catch (error) {
        functions.logger.log("Error writing document: ", error);
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      res.status(500).json({ error: "Failed to call OpenAI API" });
    }
  });
});

exports.addProjectTaskToPortfolio = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    // JSON object to insert
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
        // Additional steps omitted for brevity...
      ],
      "Name": "Ishita"
    };

    try {
      // Reference to the specific document
      const userId = 'ishita'; // Document ID for Ishita
      const projectId = 'PersonalDesignPortfolio'; // Document ID for the Personal Design Portfolio

      // Reference to the 'PersonalDesignPortfolio' document in the 'Projects' collection
      const projectRef = admin.firestore().collection('users').doc(userId).collection('Projects').doc(projectId);

      // Convert the JSON object to a string
      const temp_json_tasks_string = JSON.stringify(temp_json_tasks);

      // Insert the JSON string into Firestore
      await projectRef.set({ jsonString: temp_json_tasks_string });

      res.status(200).json({ result: `Project tasks added to 'PersonalDesignPortfolio' for user '${userId}' as a JSON string.` });
    } catch (error) {
      console.error("Error adding document to Firestore:", error);
      res.status(500).json({ error: "Failed to add project tasks to Firestore" });
    }
  });
});


exports.generateInstructions2 = functions.https.onRequest(async (req, res) => {
  console.log("Function started");
  console.log("Complete Request Body:", req.body);  // Log the full request body

  cors(req, res, async () => {
      // Access the plan, step, and substep from req.body.data
      const { plan, step, substep } = req.body.data;
      console.log("Request body:", { plan, step, substep });

      const planString = typeof plan === 'string' ? plan : JSON.stringify(plan);
      console.log("Plan string:", planString);

      try {
          console.log("Calling OpenAI API...");
          const completions = await openai.chat.completions.create({
              messages: [
                  //systemMessage,
                  {
                      role: 'user',
                      content: `You are an educational tool guiding students through each step of the way through a project plan. Your job is to generate instructions for a given step. Here is the project plan: ${planString}. Generate detailed instructions for the following substep in the context of the provided plan: Step: ${step}, Substep: ${substep}. Can you also include a video link/ tutorial? `,
                  },
              ],
              model: "gpt-4",
          });

          const apiResponse = completions.choices[0].message.content;
          console.log("API Response:", apiResponse);

          // Wrapping the response in a data field
          const responseData = { data: { instructions: apiResponse } };
          console.log("Response data:", responseData);

          res.status(200).json(responseData);
      } catch (error) {
          console.error("Error calling OpenAI API:", error);
          res.status(500).json({ data: { error: error.message } });
      }

      console.log("Function finished");
  });
});

exports.getYoutubeKeywords = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
      console.log("Get Youtube Keywords started");
      console.log("Complete Request Body:", req.body);

      const { plan, step, substep } = req.body.data;
      console.log("Parsed Request body:", { plan, step, substep });

      const planString = typeof plan === 'string' ? plan : JSON.stringify(plan);
      console.log("Plan string:", planString);

      try {
          console.log("Calling OpenAI API to get keywords...");
          const completions = await openai.chat.completions.create({
              messages: [
                  {
                      role: 'user',
                      content: `You are helping a student execute each part of this coding plan. Your task is to generate keywords for a YouTube search that we can feed into the YouTube API to get related videos for this task. Generate one search query in the context of this plan: 
                      ${planString}. For the following Substep: ${substep} that is part of this Step: ${step}.`,
                  },
              ],
              model: "gpt-4",
          });

          const apiResponse = completions.choices[0].message?.content?.trim(); // Ensure the content exists and is trimmed
          if (apiResponse) {
              console.log("API Keyword Response:", apiResponse);

              // Wrapping the response in a data field
              const responseData = { data: { keywords: apiResponse } }; // Changed `instructions` to `keywords`
              console.log("Response data:", responseData);

              res.status(200).json(responseData);
          } else {
              throw new Error("No keywords generated by the API.");
          }
      } catch (error) {
          console.error("Error calling OpenAI API:", error);
          res.status(500).json({ data: { error: error.message } });
      }

      console.log("Function finished");
  });
});


exports.getYouTubeVideo = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
      console.log("Function started");
      console.log("Complete Request Body:", req.body);  // Log the full request body

      // Access the keywords from req.body.data
      const { keywords } = req.body.data;
      console.log("Received Keywords:", keywords);

      try {
          console.log("Calling YouTube API...");
          const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
              params: {
                  part: 'snippet',
                  q: keywords,
                  type: 'video',
                  maxResults: 1,
                  key: YOUTUBE_API_KEY, // Ensure your YouTube API key is set correctly
              },
          });

          if (youtubeResponse.data.items.length > 0) {
              const videoId = youtubeResponse.data.items[0].id.videoId;
              const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
              console.log("YouTube Video URL:", videoUrl);

              // Wrapping the response in a data field
              const responseData = { data: { videoUrl: videoUrl } };
              console.log("Response data:", responseData);

              res.status(200).json(responseData);
          } else {
              console.log("No video found for the provided keywords.");
              res.status(404).json({ data: { error: "No video found for the provided keywords." } });
          }
      } catch (error) {
          console.error("Error in function:", error);
          res.status(500).json({ data: { error: error.message } });
      }

      console.log("Function finished");
  });
});
