import React from 'react'
import styles from './FormComponent.module.scss'
import { useState } from 'react';

const FormComponent = ({ id, onSubmit }) => {
  const [formData, setFormData] = useState({
    feature_id: id,
    body: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <h1>Crear comentario</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="body"
          placeholder="Ingrese comentario"
          value={formData.body}
          onChange={handleChange}
        />
        <input type="hidden" name="id" value={id} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormComponent;
