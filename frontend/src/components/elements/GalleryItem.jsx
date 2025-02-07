import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GalleryItem = ({id}) => {
    const [item, setItem] = useState([])
    const [message, setMessage] = useState(true);
    const [error, setError] = useState("");
    const [aniomationModalRecord, setAnimationModalRecord] = useState(false)

    const fetchData = async () => {
        try {
            const response = await axios.get(`/gallery/gallery/${id}/`);
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
            setItem(data)
            setMessage(false)
        })
        .catch((err) => {
            setError(err.message)
            setMessage(false)
            })
        }, [id])

  return (
    <div className={`gallery_modal_item tranition ${aniomationModalRecord ? 'is_opacity' : ''}`}>
        <div className={`gallery_record_modal`}>
            <img src={item.url} alt={item.title} />
        </div>
    </div>

  );
};

export default GalleryItem;