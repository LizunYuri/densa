import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSwipeable} from "react-swipeable"
import { PiSwimmingPoolThin } from "react-icons/pi";
import { IoMdArrowDropleft, IoMdArrowDropright, IoMdClose  } from "react-icons/io";
import MaterialsRecord from "./MaterialsRecord";
import { motion } from 'framer-motion';


const LimitedText = ({ text, limit }) => {
  const truncatedText =
    text.length > limit ? text.slice(0, limit) + "..." : text;
  return <p>{truncatedText}</p>;
};




const Materials = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(false);
  const [activeIndexRemove, setActiveIndexRemove] = useState(false);
  const [modalMaterialsIsOpen, setModalMaterialsIsOpen] = useState(false)
  const [bodyModal, setBodyModal] = useState(false)
  const [minModalSize, setMinModalSize] = useState(false)
  const [ btnIsVisible, setBtnIsVisible] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const modalRef = useRef(null)

  const fetchData = () => {
    return new Promise((resolve, reject) => {
      axios
        .get("/materials/materials/")
        .then((response) => {
          resolve(response.data.materials);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  useEffect(() => {
    fetchData()
      .then((materials) => {
        setData(materials);
        setMessage(false);
      })
      .catch((err) => {
        setError(err.message);
        setMessage(false);
      });
  }, []);

  const handlePrev = () => {

    setActiveIndex(true)
    setActiveIndexRemove(false)
    setTimeout(() => {
      setActiveIndex(false)
    }, 500)
    setData((prevData) => {
      const lastItem = prevData[prevData.length - 1]; 
      const newArray = [lastItem, ...prevData.slice(0, prevData.length - 1)];
      return newArray;
    });

    setCurrentId((prevId) => {
      const currentIndex = data.findIndex((record) => record.id === prevId);
      const prevIndex = (currentIndex - 1 + data.length) % data.length;
      return data[prevIndex].id; // Устанавливаем ID предыдущей записи
    });

  };

  const handleNext = () => {

    setActiveIndex(false)
    setActiveIndexRemove(true)

    setTimeout(() => {
      setActiveIndexRemove(false)
    }, 500)
    setData((prevData) => {
      const firstItem = prevData[0]; // Первый элемент
      const newArray = [...prevData.slice(1), firstItem];
      return newArray;
    });
    
    setCurrentId((prevId) => {
      const currentIndex = data.findIndex((record) => record.id === prevId);
      const nextIndex = (currentIndex + 1) % data.length;
      return data[nextIndex].id; // Устанавливаем ID следующей записи
    });

  };

  const closedModalMaterials = () => {


    setBtnIsVisible(false)
    setTimeout(() => {
       setBodyModal(false) 
      }, 500)

      setModalMaterialsIsOpen(false)
      setMinModalSize(true)

  }


  const openModalMaterials = (id) =>{
    setCurrentId(id)
    setMinModalSize(false)
    setModalMaterialsIsOpen(true)
    setTimeout(() => {
      setBodyModal(true)
    }, 600)
    setTimeout(() => {
      setBtnIsVisible(true)
    }, 750)

  }


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closedModalMaterials();
      }
    };

    
    document.addEventListener('mousedown', handleClickOutside);

    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  return (
    <section name="materials" id="materials">
      {data.length > 0 ? (
        <div className={`materials`}>
          <div className="container about_parhtners">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.8 }}  
              transition={{ duration: 0.8 }} 
            >
              <h2 className='title-typography'>Услуги</h2>
            </motion.div>
            
          </div>
          <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true, amount: 0.4 }}  
              transition={{ duration: 0.8 }} 
              className="materials_content"
              >
            <div
              className="slider_bottom materials_content_btn"
            >
              {data.map((record, index) => (
                <div
                  className={`materials_card no_visible_card ${activeIndex ? 'isAnimated_slider' : ''} ${activeIndexRemove ? 'isAnimated_slider_remove' : ''}`}
                  key={index}
                >
                    <div className={`materials_card_img`}>
                      <img src={record.url} alt={record.title} />
                    </div>
                    <div className={`materials_card_content`}>
                      <LimitedText text={record.content} limit={200} />
                      <h3>
                        <span>
                          <PiSwimmingPoolThin />
                        </span>
                        {record.title}
                      </h3>
                    </div>
                  
                </div>
              ))}
            </div>
            <div className="materials_slider">
              <div className="container materials_slider_container" {...swipeHandlers}>
                <div className="materials_slider_btn_left">
                  <div className="slider_arrow" onClick={handlePrev}>
                    <IoMdArrowDropleft />
                  </div>
                </div>

                <div
                  className="slider_bottom materials_content_btn"
                >
              {data.map((record, index) => (
                <div
                  className={`materials_card ${activeIndex ? 'isAnimated_slider' : ''} ${activeIndexRemove ? 'isAnimated_slider_remove' : ''} `}
                  key={index}  onClick={() => {openModalMaterials(record.id)}}
                >
                  <div className={`materials_card_img`}>
                    <img src={record.url} alt={record.title} />
                  </div>
                  <div className={`materials_card_content`}>
                    <LimitedText text={record.content} limit={200} />
                    <h3>
                      <span>
                        <PiSwimmingPoolThin />
                      </span>
                      {record.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
                <div className="materials_slider_btn_right">
                  <div className="slider_arrow" onClick={handleNext}>
                    <IoMdArrowDropright />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <div className={`material_modal_start
            tranition
            ${modalMaterialsIsOpen ? 'material_modal_finish' : ''}
            `}>
              <div ref={modalRef}  className={
                `modal_body
                tranition
                ${bodyModal ? 'material_modal_visible' : 'material_modal_no_visible'}
                 `}  {...swipeHandlersModal}>
                  <div
                    onClick={closedModalMaterials} 
                    className={`
                      materials_modal_close
                      tranition
                      ${ btnIsVisible ? 'btn_is_visible' : ''}
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
                      ${ btnIsVisible ? 'btn_is_visible' : ''}`}>
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
                        ${ btnIsVisible ? 'btn_is_visible' : ''}`}>
                      <div className="btn_top"></div>
                  </button>
                  <MaterialsRecord id={currentId} />
              </div>
          </div>
        </div>

      ) : (
        <></>
      )}
    </section>
  );
};

export default Materials;
