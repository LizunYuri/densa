import React, { useEffect, useState } from 'react';

const GetRecord = (record, setRecord, url) => {

    [record, setRecord ] = useEffect('')

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch(url)
                const result = await response.json()
                setRecord(result)
            } catch (err) {
                console.error("Error fetching seo data", err)
            }
        }
        fetchData()
    })
};




export default GetRecord;