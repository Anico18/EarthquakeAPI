import React from 'react'
import { useState, useEffect } from 'react';
import NavBarComponent from '../components/navbar/NavBarComponent';
import Table from 'react-bootstrap/esm/Table';

const CommentIndex = () => {

    const [data, setData] = useState(null);

    useEffect(() => {
      fetch("http://localhost:3000/api/features/comments/")
        .then((response) => response.json())
        .then((responseData) => {
          
          if (Array.isArray(responseData.data)) {
            setData(responseData.data);
          } else {
            console.error("Invalid data format:", responseData);
          }
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }, []);
  
    return (
      <>
        <NavBarComponent />
        <h1>Comments list</h1>
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Feature ID</th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {data ? (
              data.map(comment => (
                <tr key={comment.id}>
                  <td>{comment.id}</td>
                  <td>{comment.feature_id}</td>
                  <td>{comment.body}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Loading...</td>
              </tr>
            )}
          </tbody>
        </Table>
      </>
    );
}

export default CommentIndex