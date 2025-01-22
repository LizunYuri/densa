import React, { use, useEffect, useState } from 'react';

const MainSection = () => {
  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animationDirectionImage, setAnimationDirectionImage] = useState(false)
  const [startTouchX, setStartTouchX] = useState(null);

  const isMobile = window.innerWidth < 768

  const previosSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length -1 : prevIndex - 1))

  }


  const nextSlide = () => {
    setAnimationDirectionImage((prevState) => !prevState)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);

    setTimeout(() => {
      setAnimationDirectionImage((prevState) => !prevState)
    }, 300)
  }

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 7000);

      return () => clearInterval(interval); 
    }
  }, [images]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/img/first-images/');
        if (response.ok) {
          const result = await response.json();
          
          
          if (Array.isArray(result.images)) {
            setImages(result.images);
          } else {
            console.error('Ожидается массив данных в ключе "images"');
          }
        } else {
          console.error("Ошибка загрузки данных компании");
        }
      } catch (err) {
        console.error('Ошибка загрузки данных', err);
      }
    };
    fetchData();
  }, []);

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

  
  return (
    <section className='main' onTouchStart={handleTouchSmart} onTouchMove={handleTouchMove}>
      {images.length > 0 ? 
        (<div className='container main_slider'>
          <div className="image_after main_slider_image">
            <img className={`transition ${animationDirectionImage ? 'img_novisible' : 'img_visible' }`} src={images[currentIndex].url} alt={images[currentIndex].title} />
            <div className="main_content">
              <div className="main_slider_content">
                <h2 className={`main_slider_content_title transition ${animationDirectionImage ? 'img_novisible' : 'img_visible' }`}>{images[currentIndex].title}</h2>
                <h3 className={`main_slider_content_subtitle transition ${animationDirectionImage ? 'img_novisible' : 'img_visible' }`}>{images[currentIndex].subtitle}</h3>
                <p className={`main_slider_content_content transition ${animationDirectionImage ? 'img_novisible' : 'img_visible' }`}>{images[currentIndex].content}</p>
              </div>
              <div className="main_slider_btn">
                <button onClick={previosSlide} className="prev-btn">
                    <div className="btn_top"></div>
                </button>
                <button onClick={nextSlide} className="prev-btn">
                  <div className="btn_bottom"></div>
                </button> 
              </div>
            </div>
          </div>
        </div>) : (<div></div>)}
    </section>
  );
};

export default MainSection;

