import React, { useEffect, useState, useRef } from 'react';
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import SEOtxt from './SEOtxt';

const AboutUs = () => {
  const [equipments, setEquipments] = useState([]);
  const [upperRow, setUpperRow] = useState([]);
  const [lowerRow, setLowerRow] = useState([]);
  const containerRef = useRef(null);
  const touchStartX = useRef(0)
  const isMobile = window.innerWidth < 1200



  const fetchEquipmentData = async () => {
    try {
      const response = await fetch('/about/equipment/');
      if (response.ok) {
        const result = await response.json();
        setEquipments(result.equipments);
      } else {
        console.error("Ошибка загрузки данных о поставщиках");
      }
    } catch (err) {
      console.error('Ошибка загрузки данных', err);
    }
  };

  const scrollToForward = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollToBackward = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleTouchStart = (e) =>{
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    if (!isMobile) return

    const touchEndX = e.touches[0].clientX
    const diffX = touchStartX.current - touchEndX

    if (Math.abs(diffX) > 10) { 
      e.preventDefault();
      if (containerRef.current) {
        containerRef.current.scrollBy({ left: diffX, behavior: 'auto' });
      }
    }
  }

  const handleTouchEnd = () => {
    touchStartX.current = 0
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        const newUpperRow = [...upperRow];
        const newLowerRow = [...lowerRow];
        const firstUpper = newUpperRow.shift();
        const firstLower = newLowerRow.shift();
        setUpperRow([...newUpperRow, firstUpper]);
        setLowerRow([...newLowerRow, firstLower]);
        container.scrollTo({ left: 0, behavior: 'auto' });
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [upperRow, lowerRow]);

  useEffect(() => {
    if (equipments.length > 0) {
      const upper = equipments.filter((item) => item.id % 2 === 0);
      const lower = equipments.filter((item) => item.id % 2 !== 0);
      setUpperRow(upper);
      setLowerRow(lower);
    }
  }, [equipments]);

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  return (
    <section className='about' name='about' id='about'>
      {equipments.length > 0 ? (
        <div className="container about_parhtners">
          <h2 classsName='title-typography'>Проверенное оборудование</h2>
          <div className="parhtners_container">
            <div onClick={scrollToBackward} className="parhtners_arrow">
              <MdArrowLeft />
            </div>
            <div ref={containerRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="parhtners_table">
              <div className="parhtners_body">
                {upperRow.map((item) => (
                  <div className='parhtners_body_content arrow_top' key={item.id}>
                    <div className="parhtners_body_card">
                      <img src={item.url} alt={item.name} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="parhtners_body">
                {lowerRow.map((item) => (
                  <div className='parhtners_body_content arrow_bottom' key={item.id}>
                    <div className="parhtners_body_card">
                      <img src={item.url} alt={item.name} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div onClick={scrollToForward} className="parhtners_arrow">
              <MdArrowRight />
            </div>
          </div>
        </div>
      ) : (
        <div className="container about_parhtners"></div>
      )}
      <SEOtxt />
    </section>
  );
};

export default AboutUs;