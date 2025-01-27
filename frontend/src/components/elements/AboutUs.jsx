import React, { useEffect, useState } from 'react';

const AboutUs = () => {
  const [equipments, setEquipments] = useState([])

  const fetchEquipmentData = async () => {
    try{
      const response = await fetch('/about/equipment/')
      if(response.ok){
        const result = await response.json()

        setEquipments(result.equipments)

      } else {
        console.error("Ошибка загрузки данных о поставщиках")
      }
    } catch(err) {
      console.error('Ошибка загрузки данных', err);
    }
  }


  useEffect(() => {
    fetchEquipmentData()
  }, [])

  return (
    <section className='about' name='about' id='about'>
      {equipments.length > 0 ? (
          <div className="container about_parhtners">
            <h2>Проверенное оборудование</h2>
            <div className="parhtners_table">
              
              


            </div>
          </div>
        ):(
          <div className="container about_parhtners"></div>)
      }
    </section>
  );
};

export default AboutUs;