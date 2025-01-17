import React, { useEffect, useState } from 'react';


const PageDynamicHead = () => {
    const [seo, setSeo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('api/seo')
                const result = await response.json()
                setSeo(result)
            } catch(error) {
                console.error("Error fetching seo data", error)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (seo) {
            
            document.title = seo.title || 'Строительство бассейнов ДенСа';
        
            let metaDescription = document.querySelector("meta[name='description']");
            if (!metaDescription) {
              // Если meta description не существует, создаем го
              metaDescription = document.createElement('meta');
              metaDescription.setAttribute('name', 'description');
              document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', seo.description || 'Описание по умолчанию');
        
            
            let metaKeywords = document.querySelector("meta[name='keywords']");
            if (!metaKeywords) {
              
              metaKeywords = document.createElement('meta');
              metaKeywords.setAttribute('name', 'keywords');
              document.head.appendChild(metaKeywords);
            }
            metaKeywords.setAttribute('content', seo.keywords || 'бассейн, строительство, проектирование');
          }

    }, [seo])
};

export default PageDynamicHead;