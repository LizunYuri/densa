import React, { useEffect, useState, useRef } from 'react';
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import SEOtxt from './SEOtxt';
import { motion } from 'framer-motion';


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
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.8 }}  
              transition={{ duration: 0.8 }} 
            >
              <h2 className='title-typography'>Проверенное оборудование</h2>
            </motion.div>
            
            <div className="parhtners_container">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true, amount: 1 }}  
                transition={{ duration: 0.8, delay: 1 }} 
              >
                <div onClick={scrollToBackward} className="parhtners_arrow">
              <MdArrowLeft />
              </div>
              </motion.div>
              <div ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="parhtners_table">
                  <div className="parhtners_body">
                    {upperRow.map((item, index) => (
                        <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }} 
                        viewport={{ once: true, amount: 0.7 }}  
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className='parhtners_body_content arrow_top'
                      >
                        <div className="parhtners_body_card">
                          <img src={item.url} alt={item.name} />
                        </div>
                      </motion.div> 
                    ))}
                  </div>
                
                  <div className="parhtners_body">
                    {lowerRow.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }} 
                        viewport={{ once: true, amount: 0.7 }}  
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className='parhtners_body_content arrow_bottom'
                      >
                        <div className="parhtners_body_card">
                          <img src={item.url} alt={item.name} />
                        </div>
                      </motion.div> 
                    ))}
                  </div>
                
              </div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true, amount: 1 }}  
                transition={{ duration: 0.8, delay: 1 }} 
              >
                <div onClick={scrollToForward} className="parhtners_arrow">
                  <MdArrowRight />
                </div>
              </motion.div>
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