import React, { useEffect, useState } from 'react';
import { FaWindowClose } from "react-icons/fa";
import GalleryAddRecord from './GalleryAddRecord';
import GalleryUpdateRecord from './GalleryUpdateRecord';


const GalleryGet = () => {
    const [getRecord, setGetRecord] = useState([])
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [deleteNameElement, setDeleteNameElement] = useState({ id: '', title: '' })
    const [deleteMessage, setDeleteMessage] = useState('')
    const [completeModalIsOpen, setCompleteModalIsOpen] = useState(false)
    const [addModalVisible, setAddModalVisible] = useState(false)
    const [editRecordInformation, setEditRecordInformation] = useState({id : '',})
    const [editModalVisible, setEditModalVisible] = useState(false)

  
    const closeDeleteModalWindow = () => {
          setDeleteModalVisible(false)
      }
  
  
    const confirmationDeleteRecord = (id, title) => {
          setDeleteNameElement({id, title})
          setDeleteModalVisible(true)
    }
  
  
  
    const deleteFetch = async (id) => {
      try{
        const response = await fetch (`/gallery/delete/gallery/${id}/`,
          {
            method : 'DELETE',
            headers : {
              'Content-Type': 'application/json',
            }
          }
        )
  
        if(response.ok) {
          const result = await response.json();
            setDeleteMessage(result.message)
            fetchData()
            setDeleteModalVisible(false)
            setCompleteModalIsOpen(true)
                  
        } else{
          const result = await response.json()
            fetchData()
            setDeleteMessage(result.detail || 'Ошибка удаления')
        }
  
          } catch(err) {
              setDeleteMessage('Ошибка удаления')
          }
      }
  
    const completeModal = () =>{
      setCompleteModalIsOpen(false)
  
    }
  
    const visibleWindow = () => {
      setAddModalVisible(true)
    }
  
    const notVisibleWindow = () => {
      setAddModalVisible(false)
      fetchData()
    }
  
    const editModal = (id) => {
      setEditModalVisible(true)
      setEditRecordInformation({id})
    }
  
    const notEditModal = () =>{
      setEditModalVisible(false)
    }
  
    const fetchData = async () => {
      try {
        const response = await fetch('/gallery/get-gallery/');
          if (response.ok) {
          const result = await response.json();
              
              
          if (Array.isArray(result.images)) {
            setGetRecord(result.images);
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
    
    
    useEffect(() => {
        fetchData();
    }, []);
  
    return (
  
      <div className='dashboard_modal'>
          <h2>Раздел "Галерея"</h2>
          <p>Первые два изображения устанавливаются в качестве обложки и не участвуют в слайдере<br /><b>!Внимание! при отсутсвии записей данный блок не отображается на сайте</b></p>
          <div className="dashboard_table_add">
            <button onClick={visibleWindow} className="login_btn">
              Добавить запись
            </button>
          </div>
          <div className="dashboard_table">
            {getRecord.length > 0 ? (
              <div className="dashboard_table_body">
                <div className="dashboard_table_body_row">
                  <div className="dashboard_table_body_column">
                    <p>Заголовок</p>
                  </div>
                  <div className="dashboard_table_body_column">
                    <p>Изображение</p>
                  </div>
                  <div className="dashboard_table_body_column">
                                          
                  </div>
                </div>
                {getRecord.map((record) => (
                  <div key={record.id} className="dashboard_table_body_row">
                    <div className="dashboard_table_body_column">
                      <p>{record.title}</p>
                     </div>
                     <div className="dashboard_table_body_column dashboard_table_image">
                      <img src={record.url} alt={record.title} />
                     </div>
                     <div className="dashboard_table_body_column">
                      <div className="edit_btn">
                        <button onClick={() => editModal(record.id)} className="login_btn">Изменить</button>  
                      </div>
                      <div className="edit_btn">
                        <button onClick={() => confirmationDeleteRecord(record.id, record.title)} className="login_btn">Удалить</button>  
                      </div>
                     </div>
                  </div>
                ))}
  
              </div>
            ) : (
              <div><span>нет записей</span></div>
            )}
          </div>
          <div className={`upload_form ${deleteModalVisible ? 'dashboard_visible' : 'dashboard_not_visible'}`}>
            <div className="upload_form_body">
              <FaWindowClose onClick={closeDeleteModalWindow} className='closed_btn_modal' />
              <div className="confirmation_body">
                <h3>Удалить {deleteNameElement.title} ?</h3>
                <p>Данное действие необратимо</p>
                <div className="confirmation_btn">
                  <div className="confirmation_btn_perv">
                    <button onClick={() => deleteFetch(deleteNameElement.id)} className="login_btn">
                      Удалить
                    </button>
                  </div>
                  <div className="confirmation_btn_perv">
                    <button onClick={closeDeleteModalWindow} className="login_btn">
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`upload_form ${completeModalIsOpen ? 'dashboard_visible' : 'dashboard_not_visible'}`}>
            <div className="upload_form_body">
              <div className="confirmation_body">
                <h3>{deleteMessage} ?</h3>
                <div className="confirmation_btn">
                  <button onClick={completeModal} className="login_btn">ок</button>
                </div>
              </div>
            </div>
          </div>
          <div className={`upload_form ${addModalVisible ? 'dashboard_visible' : 'dashboard_not_visible'}`}>
            <div className="upload_form_body">
              <FaWindowClose onClick={notVisibleWindow} className='closed_btn_modal' />
              <GalleryAddRecord />
            </div>
          </div>
          <div className={`upload_form ${editModalVisible ? 'dashboard_visible' : 'dashboard_not_visible'}`}>
            <div className="upload_form_body">
              <FaWindowClose onClick={notEditModal} className='closed_btn_modal' />
                {editModalVisible && (
                  <GalleryUpdateRecord  recordId={editRecordInformation.id} onRecordUpdated={fetchData}/>
                )}
            </div>
          </div>
      </div>
    );
};

export default GalleryGet;