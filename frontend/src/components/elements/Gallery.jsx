import React, { useRef, useEffect, useState } from 'react';
import { useSwipeable} from "react-swipeable"
import {  IoMdClose  } from "react-icons/io";
import GalleryItem from './GalleryItem';
import { motion } from 'framer-motion';

const Gallery = () => {
  const [galleryRecord, setGalleryRecord] = useState([])
  const [firstGalleryBlock, setFirstGalleryBlock] = useState([])
  const [secondGalleryBlock, setSecondGalleryBlock] = useState([])
  const [activeIndex, setActiveIndex] = useState(false)
  const [modalGalleryActive, setModalGalleryActive] = useState(false)
  const [activeIndexRemove, setActiveIndexRemove] = useState(false);
  const [modalBodyVisible, setModalBodyVisibe] = useState(false)
  const [modalBtnVisible, setModalBtnVisible] = useState(false)
  const [visibleItem, setVisibleItem] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const modalGalleryRef = useRef(null)

  const fetchata = async () =>{
    try{
      const response = await fetch('/gallery/get-gallery/')
      if(response.ok) {
        const result = await response.json()
        setGalleryRecord(result.images)

        setFirstGalleryBlock(result.images.slice(0, 2));
        setSecondGalleryBlock(result.images.slice(2));

      }else {
        console.error("Ошибка загрузки данных о поставщиках");
      }
    } catch (err) {
      console.error('Ошибка загрузки данных', err);
    }
  }

  useEffect(() => {
    fetchata()
    
    setFirstGalleryBlock(galleryRecord.slice(0, 2))
    setSecondGalleryBlock(galleryRecord.slice(2))
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalGalleryRef.current && !modalGalleryRef.current.contains(event.target)) {
        closeGalleryModal();
      }
    };    
    document.addEventListener('mousedown', handleClickOutside);
  
      
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    animationModal()
  }, [modalBodyVisible])


  const handlePrev = () => {

    setActiveIndex(true)
    setActiveIndexRemove(false)
    setTimeout(() => {
      setActiveIndex(false)
    }, 500)

    setCurrentId((prevId) => {
      const currentIndex = secondGalleryBlock.findIndex((record) => record.id === prevId);
      const prevIndex = (currentIndex - 1 + secondGalleryBlock.length) % secondGalleryBlock.length;
      return secondGalleryBlock[prevIndex].id; 
    });

  };

  const handleNext = () => {

    setActiveIndex(false)
    setActiveIndexRemove(true)

    setTimeout(() => {
      setActiveIndexRemove(false)
    }, 500)

    
    setCurrentId((prevId) => {
      const currentIndex = secondGalleryBlock.findIndex((record) => record.id === prevId);
      const nextIndex = (currentIndex + 1) % secondGalleryBlock.length;
      return secondGalleryBlock[nextIndex].id;
    });

  };


  const swipeHandlers = useSwipeable({
    onSwipedLeft : handlePrev,
    onSwipedRight : handleNext,
    preventScrollOnSwipe : true,
    trackMouse : true,
  })

  const swipeHandlersModal = useSwipeable({
    onSwipedLeft : handlePrev,
    onSwipedRight : handleNext,
    preventScrollOnSwipe : true,
    trackMouse : true,
  })


  const openModal = (id) => {
    setCurrentId(id)
    setActiveIndex(id)
    setModalGalleryActive(true)
    setTimeout(() => {
      setModalBodyVisibe(true)
    }, 300)
    setTimeout(() => {
      setModalBtnVisible(true)
    }, 400)
    setTimeout(() => {
      setVisibleItem(true)
    }, 500)
  }

  const closeGalleryModal = () => {
    setTimeout(() => {
     setModalBodyVisibe(false) 
    }, 400)
  }



  const animationModal = () => {
    
    if(!modalBodyVisible) {
      setTimeout(() => {
        setModalBtnVisible(false)
      }, 100)
      setTimeout(() => {
        setModalGalleryActive(false)
      }, 600)
    }
  }


  return (
    <section className='gallery' id='gallery' name='gallery'>
        <div className="gallery_welcome">
          {firstGalleryBlock.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true, amount: 0.3 }}  
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="gallery_welcome_card"
            >
              <img src={item.url} alt={item.title} />
              {(item.id % 2) === 0 ? (
                <motion.p 
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true, amount: 1 }}  
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className='left_text'
                >
                  {item.title}
                </motion.p>
              ) : (
                <motion.p 
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true, amount: 1 }}  
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className='right_text'>
                    {item.title}
                  </motion.p>
              )}
            </motion.div>
          ))}
        </div>
        <div className="container gallery_content"  {...swipeHandlers}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, amount: 0.8 }}  
            transition={{ duration: 0.8 }} 
          >
            <h3 className='title-typography'>Галерея</h3>
          </motion.div>
          <div className="gallery_swiper">
            {secondGalleryBlock.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true, amount: 0.3 }}  
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={
                  `gallery_swiper_item
                  ${item.id === currentId ? 'border_gold' : 'border_none'}
                  ${
                    (item.id  % 2) !== 0 ? 'width700' : ''
                  }
                  `
                }
                onClick={() => {openModal(item.id)}}>
                <img src={item.url} alt={item.title} />
              </motion.div> 
            ))}
          </div>
        </div>
        <div className={`material_modal_start
            tranition
            ${modalGalleryActive ? 'material_modal_finish' : ''}
            `}>
          <div
            ref={modalGalleryRef}
            {...swipeHandlersModal}
            className={`
              tranition
              ${modalBodyVisible ? 'gallery_modal' : 'gallery_no_modal'}
            `}>
              <div
                onClick={closeGalleryModal} 
                className={`
                  materials_modal_close
                  tranition
                  ${ modalBtnVisible ? 'btn_is_visible' : 'btn_no_visible'}
                `}>
                <IoMdClose />
              </div>
              <button
                      onClick={handlePrev}
                      className={`prev-btn
                      is_modal
                      is_modal_left
                      is_modal_no_visible
                      tranition
                      ${ modalBtnVisible ? 'btn_is_visible' : 'btn_no_visible'}`}>
                      <div className="btn_bottom"></div>
                    </button> 
                    <button 
                      onClick={handleNext}
                      className={`
                        prev-btn
                        is_modal
                        is_modal_right
                        is_modal_no_visible
                        tranition
                        ${ modalBtnVisible ? 'btn_is_visible' : 'btn_no_visible'}`}>
                      <div className="btn_top"></div>
                  </button>
                  <div className={`item-visible ${ visibleItem ? 'item_on' : 'item_off'}`}>
                    <GalleryItem id={currentId} />
                  </div>
                  
          </div>    
        </div>
    </section>
  );
};

export default Gallery;