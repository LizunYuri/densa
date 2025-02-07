import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SEOtxt = () => {
  const [abouts, setAbouts] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animationDirectionImage, setAnimationDirectionImage] = useState(false)
  const [startTouchX, setStartTouchX] = useState(null);
  const isMobile = window.innerWidth < 1200


  const previosSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? abouts.length -1 : prevIndex - 1))
    }

  const nextSlide = () => {
        setAnimationDirectionImage((prevState) => !prevState)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % abouts.length);

        setTimeout(() => {
            setAnimationDirectionImage((prevState) => !prevState)
        }, 300)
    }

  useEffect(() => {
    if (abouts.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 8000);

      return () => clearInterval(interval); 
    }
  }, [abouts]);

  const handleTouchSmart = (e) => {
    if(isMobile) {
      setStartTouchX(e.touches[0].clientX)
    }
  }
  const handleTouchMove = (e) => {
    if (isMobile && startTouchX !== null) {
      const diff = startTouchX - e.touches[0].clientX;

      
      if (diff > 50) {
        nextSlide(); 
        setStartTouchX(null);
      } else if (diff < -50) {
        previosSlide(); 
        setStartTouchX(null);
      }
    }
  }
  const fetchAbiutsData = async () => {
        try {
          const response = await fetch('/about/about/');
          if (response.ok) {
            const result = await response.json();
            setAbouts(result.abouts);
          } else {
            console.error("Ошибка загрузки данных о поставщиках");
          }
        } catch (err) {
          console.error('Ошибка загрузки данных', err);
        }
  };

  useEffect(() => {
        fetchAbiutsData()
  }, [])

  const slideAnimation = {
    initial: { opacity: 0, x: -10 }, 
    animate: { opacity: 1, x: 0 }, 
    exit: { opacity: 0, x: 10 }, 
    transition: { duration: 0.6 }, 
  };

  return (
    <div className='seo' id='seo' name='seo' onTouchStart={handleTouchSmart} onTouchMove={handleTouchMove}>
        {abouts.length > 0 ? (
          <div className='seo_container'>
            <motion.div
              key={currentIndex}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideAnimation.transition}
              variants={slideAnimation}
              className="seo_container_img"
              >
                <img src={abouts[currentIndex].url} alt={abouts[currentIndex].name} />
              </motion.div>
            <div className="container seo_content">
                <div className="seo_body">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x : 20}}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x : 0}} 
                  viewport={{ once: true, amount: 0.5 }}  
                  transition={{ duration: 0.6 }} 
                >
                  <h4 className="seo_body_title">{abouts[currentIndex].title}</h4>
                  <p>{abouts[currentIndex].content}</p>
                </motion.div>
                <div className="seo_btn">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }} 
                    viewport={{ once: true, amount: 0.5 }}  
                    transition={{ duration: 0.8, delay: 1 }} 
                  >
                    <button onClick={previosSlide} className="prev-btn">
                      <div className="btn_top"></div>
                    </button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }} 
                    viewport={{ once: true, amount: 0.5 }}  
                    transition={{ duration: 0.8, delay: 1}} 
                  >
                    <button onClick={nextSlide} className="prev-btn">
                      <div className="btn_bottom"></div>
                    </button>
                  </motion.div>
                </div>
                            </div>
                            
            </div>
      </div>                 
      ) : (<div></div>)}
    </div>
  );
};


export default SEOtxt;