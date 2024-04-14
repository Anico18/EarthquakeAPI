import React from 'react'
import Table from 'react-bootstrap/Table'
import { useNavigate } from 'react-router-dom'

const TableComponent = (props) => {
    
    const earthquakes = props.earthquakes
    // console.log(earthquakes[0].attributes.title)
    const navigate = useNavigate();

    const handleButtonClick = (id) => {
        navigate(`/Comments/Create/${id}`);
    };

    return (
        <Table striped bordered responsive>
        <thead>
            <tr>
            <th>#</th>
            <th>Title</th>
            <th>Mag_type</th>
            <th>Place</th>
            <th>Time</th>
            <th>Tsunami</th>
            <th>Magnitude</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>External_URL</th>
            <th>Acción</th>
            </tr>
        </thead>
        <tbody>
            {earthquakes.map(earthquake => (
                <tr key={earthquake.id}>
                    <td>{earthquake.id}</td>
                    <td>{earthquake.attributes.title}</td>
                    <td>{earthquake.attributes.mag_type}</td>
                    <td>{earthquake.attributes.place}</td>
                    <td>{earthquake.attributes.time}</td>
                    <td>{earthquake.attributes.tsunami ? 'Yes' : 'No'}</td>
                    <td>{earthquake.attributes.magnitude}</td>
                    <td>{earthquake.attributes.coordinates.longitude}</td>
                    <td>{earthquake.attributes.coordinates.latitude}</td>
                    <td>{earthquake.links.external_url}</td>
                    <td key={earthquake.id}>
                    <button onClick={() => handleButtonClick(earthquake.id)}>Comentar</button>
                    </td>
                </tr>
            ))}
            
        </tbody>
        </Table>
    )
}

export default TableComponent