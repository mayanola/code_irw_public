import React, { useEffect, useState } from 'react';
import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { useForm } from 'react-hook-form';
import './App.css'; // Import the CSS file
import { Container, Box, Typography, TextField, Button } from '@mui/material';

// Call your Cloud Function
const addMessage = httpsCallable(functions, 'addMessage');

function App() {
  // useState is a hook (like a digital sticky note) which creates two state variables that we can update
  // we use this instead of a typical 'let' variable bc when useState updates the state it informs React to re-render which updates the UI (normal variable don't)
  // const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { register, handleSubmit, reset } = useForm();
  const [who, setWho] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async (data) => {

    const newFormData = { ...formData, ...data };
    setFormData(newFormData);
    data.preventDefault();
    const newErrors = {};

    if (!who.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      // submitting form
      if (currentStep === 9) {
        // triyng to submit form
        try {
          // trying to send info to firebase
          try {
              const result = await addMessage({newFormData});
              console.log('Response from Cloud Function:', result.data);
              console.log(newFormData);        
            } catch (error) {
              console.error('Error sending data to Cloud Function:', error);
            }
          // send info to Firebase
          alert('Form submitted successfully');
          reset();
          setCurrentStep(1);
          setFormData({});
        } catch (error) {
          console.error('Error submitting form:', error);
        }
        // submit form
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      alert('Enter required fields');
    }

    setIsSubmitting(false);
    setErrors({});
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // // updates the inputValue state whenever the input value changes
  // const handleInputChange = (event) => {
  //   setInputValue(event.target.value);
  // };

  // // logs the current state of input value
  // const handleSubmit = async (event) => {
  //   try {
  //     event.preventDefault(); // Prevent the default form submission behavior of a reload (we don't want to reload the page just update logs/database)
  //     console.log("value before: ", inputValue);
  
  //     const result = await addMessage({ text: inputValue });
  
  //     console.log('Response from Cloud Function:', result.data);
  //     //setInputValue(''); // Clear input field

  //     const displayText = result.data.uppercase;
  //     setInputValue(displayText);


  //   } catch (error) {
  //     console.error('Error sending data to Cloud Function:', error);
  //   }

  // };

  // db.collection('messages').doc(messageId).onSnapshot((doc) => {
  //   if (doc.exists) {
  //     const data = doc.data();
  //     console.log('Document data:', data);
  //     // Handle the updated data
  //   } else {
  //     console.log('No such document!');
  //   }
  // }, (error) => {
  //   console.error('Error fetching document:', error);
  // });

  
  return (
    <div className="App">
    <header className="App-header">
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
            Registration Form
          </Typography>
      <form onSubmit={handleSubmit(handleNext)} noValidate>
          {currentStep === 1 && (
            <div>
              <h2>Step 1</h2>
              <label>Who are you?</label>
              <input {...register('who', { required: true })} />
              <button type="submit">Next</button>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <h2>Step 2</h2>
              <label>What do you want to do?</label>
              <input {...register('what', { required: true })} />
              <button type="button" onClick={handleBack}>Back</button>
              <button type="submit">Next</button>
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <h2>Step 3</h2>
              <label>How do you learn best?</label>
              <textarea {...register('how_learn', { required: true })}></textarea>
              <button type="button" onClick={handleBack}>Back</button>
              <button type="submit">Next</button>
            </div>
          )}
          {currentStep === 4 && (
            <div>
              <h2>Step 4</h2>
              <label>What is your timeline?</label>
              <textarea {...register('timeline', { required: true })}></textarea>
              <button type="button" onClick={handleBack}>Back</button>
              <button type="submit">Next</button>
            </div>
          )}
          {currentStep === 5 && (
            <div>
              <h2>Step 5</h2>
              <label>What relevant skills do you have?</label>
              <textarea {...register('skills', { required: true })}></textarea>
              <button type="button" onClick={handleBack}>Back</button>
              <button type="submit">Next</button>
            </div>
          )}
          {currentStep === 6 && (
            <div>
              <h2>Step 6</h2>
              <label>What are your project goals?</label>
              <textarea {...register('goals', { required: true })}></textarea>
              <button type="button" onClick={handleBack}>Back</button>
              <button type="submit">Next</button>
            </div>
          )}
          {currentStep === 7 && (
            <div>
              <h2>Step 7</h2>
              <label>If scoped out, what is your experimental design?</label>
              <textarea {...register('design', { required: true })}></textarea>
              <button type="button" onClick={handleBack}>Back</button>
              <button type="submit">Next</button>
            </div>
          )}
          {currentStep === 8 && (
            <div>
              <h2>Step 8</h2>
              <label>What are the features of your dataset?</label>
              <textarea {...register('dataset', { required: true })}></textarea>
              <button type="button" onClick={handleBack}>Back</button>
              <button type="submit">Next</button>
            </div>
          )}
          {currentStep === 9 && (
            <div>
              <h2>Step 9</h2>
              <label>Do you have any additional information that you would like to submit?</label>
              <textarea {...register('additional', { required: true })}></textarea>
              <button type="button" onClick={handleBack}>Back</button>
              <button type="submit">Next</button>
            </div>
          )}
      </form>
    </Box>
    </Container>
    </header>
  </div>
  );
}

export default App;
