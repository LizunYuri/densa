import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaterialsRecord = ({id}) => {

    const [record, setRecord] = useState([])
    const [message, setMessage] = useState(true);
    const [error, setError] = useState("");
    const [aniomationModalRecord, setAnimationModalRecord] = useState(false)


    const fetchData = async () => {
        try {
            const response = await axios.get(`materials/materials/${id}/`);
            return response.data.record;
        } catch (err) {
            throw err;
        }
    }

    const addAnimation = () => {
        setAnimationModalRecord(true)
        setTimeout(() => {
            setAnimationModalRecord(false)
        }, 500)
    }

    useEffect(() => {
        addAnimation()
    }, [id])



    useEffect(() => {
        fetchData()
        .then((data) =>{
            setRecord(data)
            setMessage(false)
        })
        .catch((err) => {
            setError(err.message)
            setMessage(false)
        })
    }, [id])


    

  return (
    <div className={`record_modal tranition ${aniomationModalRecord ? 'is_opacity' : ''}`}>
        <div className={`record_modal_img`}>
            <img src={record.url} alt={record.title} />
        </div>
        <div className="record_modal_content">
            <h3>{record.title} </h3>
            <p>{record.content}</p>
        </div>
    </div>
  );
};

export default MaterialsRecord;