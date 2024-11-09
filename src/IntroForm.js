import React, { useEffect, useState } from 'react';
import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { useForm } from 'react-hook-form';
import styles from './IntroForm.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const CustomCheckbox = styled(Checkbox)({
  color: '#fff',
  '&.Mui-checked': {
    color: '#fff',
  },
});

// Call your Cloud Function
const generateSkills = httpsCallable(functions, 'generateSkills');
const generateSummary = httpsCallable(functions, 'generateSummary');
const followUp = httpsCallable(functions, 'followUp');
const generatePlan = httpsCallable(functions, 'generatePlan');


const stepVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

let result={questions:[]};

function IntroForm() {
  // useState is a hook (like a digital sticky note) which creates two state variables that we can update
  // we use this instead of a typical 'let' variable bc when useState updates the state it informs React to re-render which updates the UI (normal variable don't)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { register, handleSubmit, reset, setValue } = useForm();
  const [followUpQs, setFollowUpQs] = useState();
  const [nextQ, setNextQ] = useState();
  const [followupLength, setfollowupLength] = useState();
  const [plan, setPlan] = useState();
  const [skills, setSkills] = useState();
  const [selectedSkills, setSelectedSkills] = useState({});
  const [summary, setSummary] = useState();
  const navigate = useNavigate();
  const qString = "";


  const handleNext = async (data) => {
    const questionKey = `question${currentStep}`;
    if (currentStep < 7) {  
      const qString = "hello";
    } else {
      const qString = nextQ;
    }
    // console.log(questionKey);
    // console.log(nextQ);



    const newFormData = { ...formData, ...data, [questionKey]: qString };
    setFormData(newFormData);

    if (currentStep === 7) {
      setIsSubmitting(true);
        try {
            while (currentStep === 7) {
              try {
                console.log(newFormData);
                const skillsData = await generateSkills({newFormData});
                const skillsJSON = JSON.parse(skillsData.data);
                console.log(skillsJSON.skills[0].skill)
                console.log(JSON.parse(skillsData.data));
                setSkills(skillsJSON);
                break;
              } catch (error) {
                console.log('API call responded in wrong format, resending call', error);
              }
            }
          } catch (error) {
        console.error('Error submitting form:', error);
       } finally {
        // will update in the next render cycle (ie. when next is clicked)
        setCurrentStep(currentStep + 1);
        setIsSubmitting(false);
       }
    } else if (currentStep === 8) {
        setIsSubmitting(true);
        try {
            while (currentStep === 8) {
              // accesses the keys of the jsons in the skills array (ie. skill names) that are checked and adds them to the form data
              const selectedSkillNames = Object.keys(selectedSkills).filter(skill => selectedSkills[skill]);
              newFormData.selectedSkills = selectedSkillNames;

              // Update formData state with the new information
              setFormData(newFormData);
              console.log(newFormData);
              try {
                // get summary from API
                const summary = await generateSummary({newFormData});
                console.log(summary.data);
                setSummary(summary.data);

                break;
              } catch (error) {
                console.log('API call responded in wrong format, resending call', error);
              }
            }
          } catch (error) {
        console.error('Error submitting form:', error);
       } finally {
        // will update in the next render cycle (ie. when next is clicked)
        setCurrentStep(currentStep + 1);
        setIsSubmitting(false);
       }
      // submit form
    }  else if (currentStep === 9) {
      // here we send the answers to the API and generate follow up questions
        setIsSubmitting(true);
        try {
            while (currentStep === 9) {
              //want to generate plan summary here
              console.log(newFormData);
              try {
                const qData = await followUp({newFormData});
                const result = JSON.parse(qData.data);
                
                setFollowUpQs(result.questions);
                setfollowupLength(result.questions.length);
                setNextQ(result.questions[0].question);
                reset();
                break;
              } catch (error) {
                console.log('API call responded in wrong format, resending call', error);
              }
            }
            } catch (error) {
          console.error('Error submitting form:', error);
        } finally {
          // will update in the next render cycle (ie. when next is clicked)
          setCurrentStep(currentStep + 1);
          setIsSubmitting(false);
        }
        // submit form
    } else if (currentStep === 9+(followupLength)){
      //follow up questions
        setIsSubmitting(true);
        try {
          console.log(newFormData);
          const plan = await generatePlan({newFormData});
          console.log(plan.data.userID);

          localStorage.setItem('userID', plan.data.userID);
          localStorage.setItem('projectID', plan.data.projectID);
          localStorage.setItem('plan', plan.data.apiResponse);

          //setPlan(plan.data);
          //setCurrentStep(currentStep + 1);
        } catch (error) {
          console.error('Error retrieving plan: ', error);
        } finally {
          //reset();
          //setCurrentStep(1);
          //setIsSubmitting(false);
          navigate('/project');
        }
    } 
      else {
        if (currentStep > 9 && currentStep < 10+followupLength) {
          setNextQ(followUpQs[currentStep-10].question);
        }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    //currentStep may be outdated so must calculate prev step first
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    console.log(prevStep);
    setValue(`answer${prevStep}`, formData[`answer${prevStep}`] || '');
  };

  // need to use this because hooks update asynchronously so previous q was not showing up properly
  useEffect(() => {
    if (currentStep >= 11 && currentStep < 11 + followupLength) {
      const question = followUpQs[currentStep - 11]?.question || '';
      setNextQ(question);
    }
  }, [currentStep, followUpQs, followupLength]);

  // Handle change in checkbox state
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedSkills((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  
  return (
    <div className={styles.container}>
    <header className="App-header">
      <form onSubmit={handleSubmit(handleNext)} noValidate>
        <AnimatePresence wait>
            {currentStep === 1 && (
                <motion.div
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className={styles.step}
                style={{ position: 'absolute'}}>
                  <p>Who are you?</p>
                  {/*'register' is provided by react hook form to pass input into form handling system*/}              
                  <input placeholder="I am a..." {...register('answer1', { required: true })} />
                  <br></br>
                  <button type="submit">Next</button>
                </motion.div>
            )}
            {currentStep === 2 && (
                <motion.div
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className={styles.step}
                style={{ position: 'absolute'}}>
                  <p>What do you want to build?</p>
                  <input placeholder="I want to..." {...register('answer2', { required: true })} />
                  <br></br>
                  <button type="button" onClick={handleBack}>Back</button>
                  <button type="submit">Next</button>
                </motion.div>
            )}
            {/* {currentStep === 3 && (
              <motion.div
              key="step3"
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.step}
              style={{ position: 'absolute'}}>
                <p>Do you learn better via text or video?</p>
                <input placeholder="I learn by..." {...register('answer3', { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )} */}
            {currentStep === 3 && (
              <motion.div
              key="step4"
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.step}
              style={{ position: 'absolute'}}>
                <p>How many weeks do you want to build your project in?</p>
                <input {...register('answer3', { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )}
            {currentStep === 4 && (
              <motion.div
              key="step5"
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.step}
              style={{ position: 'absolute'}}>
                <p>What are your project goals?</p>
                <input {...register('answer4', { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )}
            {currentStep === 5 && (
              <motion.div
              key="step6"
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.step}
              style={{ position: 'absolute'}}>
                <p>If scoped out, what is your experimental design?</p>
                <input {...register('answer5', { required: false })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )}
            {currentStep === 6 && (
              <motion.div
              key="step7"
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.step}
              style={{ position: 'absolute'}}>
                <p>What are the features of your dataset?</p>
                <input {...register('answer6', { required: false })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )}
            {currentStep === 7 && (
            <motion.div
            key="step8"
            variants={stepVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className={styles.step}
            style={{ position: 'absolute'}}>
                <p>Do you have any additional information that you would like to submit?</p>
                <input {...register('answer7', { required: false })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Next'}
                </button>
              </motion.div>
            )}
          
          {currentStep === 8 && (
              <motion.div
              key="step8"
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.step}
              style={{ position: 'absolute'}}>
                <FormGroup className={styles.formGroup}>
                  <p className={styles.selectSkillsText}>Select the skills you already have</p>
                  {skills?.skills?.length > 0 ? (
                    skills.skills.map((skill, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <CustomCheckbox
                            checked={!!selectedSkills[skill.skill]}
                            onChange={handleCheckboxChange}
                            name={skill.skill}
                            className={styles.checkbox}
                          />
                        }
                        label={<span className={styles.checkboxLabel}>{skill.skill}</span>}
                        className={styles.formControlLabel}
                      />
                    ))
                  ) : (
                    <p>No skills available</p>
                  )}
                </FormGroup>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Next'}
                </button>
              </motion.div>
            )}{currentStep === 9 && (
              <motion.div
                key="step10"
                variants={stepVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className={styles.step}
                style={{ position: 'absolute'}}>
                <p style={{ fontSize: '20px', display: 'flex', flexDirection: 'column', paddingTop: '80%', marginBottom: '30px'}}>Is this an accurate summary? Clarify what is wrong if not. <br/><br/>{summary}</p>
                <input {...register('answer9', { required: false })} />
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Next'}
                </button>
              </motion.div>
            )}
            {currentStep >= 10 && currentStep < 10+followupLength && (
            <motion.div
            key={`step${currentStep}`}
            variants={stepVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className={styles.step}
            style={{ position: 'absolute'}}>
                <p>{nextQ}</p>
                <input {...register(`answer${currentStep}`, { required: false })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Next'}
                </button>
              </motion.div>
            )}
          </AnimatePresence> 
      </form>

    <div>
      <div className={`${styles.drop} ${styles['drop-1']}`}></div>
      <div className={`${styles.drop} ${styles['drop-2']}`}></div>
      <div className={`${styles.drop} ${styles['drop-3']}`}></div>
      <div className={`${styles.drop} ${styles['drop-4']}`}></div>
      <div className={`${styles.drop} ${styles['drop-5']}`}></div>
    </div>

    </header>
  </div>
  );
}

export default IntroForm;