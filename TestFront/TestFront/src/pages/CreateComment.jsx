import React, { useEffect, useState } from 'react'
import FormComponent from '../components/form/FormComponent'
import { useParams } from 'react-router-dom';
import NavBarComponent from '../components/navbar/NavBarComponent';

const CreateComment = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/features/features/${id}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // If successful response, you can handle it here
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBarComponent />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <FormComponent id={id} onSubmit={handleSubmit} />
      )}
    </div>
  )
}

export default CreateComment