import React, { useEffect, useState } from 'react';
import CheckAuthStatus from '../api/CheckAuthStatus';

const ClientsUpload = () => {
    const[getRecord, setGetRecord] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false);

  
    const handleAuthStatusChange = (status) => {
      setIsAuthenticated(status)
    }
  
    const fetchData = async () => {
      try {
        const response = await fetch('/clients/clients/');
        if (response.ok) {
          const result = await response.json();
              
              
          if (Array.isArray(result.clients)) {

            const data = result.clients
            const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            
            const formattedData = sortedData.map(item => ({
                ...item,
                created_at: new Date(item.created_at).toLocaleDateString('ru-RU')
            }))

            setGetRecord(formattedData);
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
        < CheckAuthStatus onAuthStatusChange={handleAuthStatusChange} />
        {isAuthenticated ? ( 
          <>
            <h2>Заявки с сайта</h2>
            <p> Добавление и редактирование записи через панель администратора невозможно <br /> <b>!Внимание! Для редактирования записи обратитесь к администратору информационной базы</b></p>
            <div className="dashboard_table">
              {getRecord.length > 0 ? (
                <div className="dashboard_table_body">
                  <div className="dashboard_table_body_row">
                    <div className="dashboard_table_body_column height_70">
                      <p>Дата</p>
                    </div>
                    <div className="dashboard_table_body_column height_70">
                      <p>Имя</p>
                    </div>
                    <div className="dashboard_table_body_column height_70">
                      <p>Номер телефона</p>
                    </div>
                    <div className="dashboard_table_body_column height_70">
                        <p>Согласие на обработку данных</p>
                    </div>
                  </div>
                  {getRecord.map((record) => (
                    <div key={record.id} className="dashboard_table_body_row">
                      <div className="dashboard_table_body_column height_70">
                        <p>{record.created_at}</p>
                      </div>
                      <div className="dashboard_table_body_column height_70">
                        <p>{record.name}</p>
                      </div>
                      <div className="dashboard_table_body_column height_70">
                        <p>{record.phone}</p>
                      </div>
                      <div className="dashboard_table_body_column height_70">
                        {record.is_ofer === 1 ? (<p>Получено</p>) : (<p>Не получено</p>) }
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span>no record</span>
              )}
            </div>
          </>
        ) : (
        <></>
        )}
      </div>
    );
};

export default ClientsUpload;