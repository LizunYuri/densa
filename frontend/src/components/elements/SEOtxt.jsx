import React, { useEffect, useState } from 'react';

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


  return (
    <div className='seo' id='seo' name='seo' onTouchStart={handleTouchSmart} onTouchMove={handleTouchMove}>
        {abouts.length > 0 ? (
            
                   <div className='seo_container'>
                        <div className="seo_container_img">
                            <img src={abouts[currentIndex].url} alt={abouts[currentIndex].name} />
                        </div>
                        <div className="container seo_content">
                            <div className="seo_body">
                                <h4>{abouts[currentIndex].title}</h4>
                                <p>{abouts[currentIndex].content}</p>
                                <div className="seo_btn">
                                    <button onClick={previosSlide} className="prev-btn">
                                        <div className="btn_top"></div>
                                    </button>
                                    <button onClick={nextSlide} className="prev-btn">
                                        <div className="btn_bottom"></div>
                                    </button> 
                                </div>
                            </div>
                            
                        </div>
                    </div> 

                
        ) : (<div></div>)}
    </div>
  );
};


export default SEOtxt;










  
//   return (
//     <section className='main' >
//       {images.length > 0 ? 
//         (<>
//           <div className='img_fixed '>
//             <img className={`transition img_fixed ${animationDirectionImage ? 'img_novisible' : 'img_visible' }`} src={images[currentIndex].url} alt={images[currentIndex].title} />
//           </div>

//         <div className='container main_slider'>
//           <div className="image_after main_slider_image">
//             <div className="main_content">
//               <div className="main_slider_content">
//                 <h2 className={`main_slider_content_title transition ${animationDirectionImage ? 'img_novisible' : 'img_visible' }`}>{images[currentIndex].title}</h2>
//                 <h3 className={`main_slider_content_subtitle transition ${animationDirectionImage ? 'img_novisible' : 'img_visible' }`}>{images[currentIndex].subtitle}</h3>
//                 <p className={`main_slider_content_content transition ${animationDirectionImage ? 'img_novisible' : 'img_visible' }`}>{images[currentIndex].content}</p>
//                 <div className="main_slider_btn">
//                 <button onClick={previosSlide} className="prev-btn">
//                     <div className="btn_top"></div>
//                 </button>
//                 <button onClick={nextSlide} className="prev-btn">
//                   <div className="btn_bottom"></div>
//                 </button> 
//               </div>
//               </div>

//             </div>
//           </div>
//         </div></>) : (<div></div>)}
//     </section>
//   );
// };

// export default MainSection;
