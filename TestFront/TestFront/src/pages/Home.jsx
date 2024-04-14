import { useState, useEffect } from 'react';
import TableComponent from '../components/table/TableComponent'
import NavBarComponent from '../components/navbar/NavBarComponent';
import React from 'react'

const PER_PAGE = 1000;

const Home = () => {
    const [earthquakes, setEarthquakes] = useState(null);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadEarthquakes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/features/test/?limit=${PER_PAGE}&offset=${offset}`);
        if(!response.ok) {
          throw new Error('Failed loading earthquakes');
        }
        const data = await response.json();
        setEarthquakes(data.data);
        setTotal(data.total);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching earthquakes', error);
        setLoading(false);
      }
    };

    const handlePageClickPrev = () => {
      const newOffset = offset - PER_PAGE;
      if (newOffset >= 0) {
        setOffset(newOffset);
      }
    };
    
    const handlePageClickNext = () => {
      const newOffset = offset + PER_PAGE;
      if (newOffset <= total) {
        setOffset(newOffset);
      }
    };
  
    useEffect(() => {
      loadEarthquakes();
    }, [offset]);

    return (
      <>
        <NavBarComponent/>
        
        <h1>Earthquakes list</h1>
        <button onClick={handlePageClickPrev} disabled={offset === 0}>Prev</button>
        <button onClick={handlePageClickNext} disabled={offset + PER_PAGE >= total}>Next</button>

         {loading ? (
          <p>Loading earthquakes...</p>
         ) : (
          earthquakes ? <TableComponent earthquakes={earthquakes}  /> : <p>Loading</p>
         )}
        
      </>
    );
}

export default Home