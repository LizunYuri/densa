import React, { useEffect, useState } from 'react';

const CompanyInfo = () => {
    const [company, setCompany] = useState([])
    const [ name , setName] = useState('')
    const [ phone1, setPhone1] = useState('')
    const [ phone2 , setPhone2] = useState('')
    const [ email, setEmail] = useState('')
    const [ address, setAddress] = useState('')
    const [ tin, setTin] = useState('')
    const [ legalName, setLegalName] = useState('')
    const [ telegram, setTelegram] = useState('')
    const [whatsap , setWhatsap] = useState('')
    const [ vk, setVk] = useState('')  
    const [recordId, setRecordId] = useState('')
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [initialData, setInitialData] = useState({
      name: '',
      phone1: '',
      phone2: '',
      email: '',
      address: '',
      tin: '',
      legal_name: '',
      whatsap: '',
      telegram: '',
      vk: '',
      });


      useEffect(() => {
        const fetchData = async () => {
          try{
            const response = await fetch('/api/company')
            if(response.ok) {
              const result = await response.json()
              setRecordId(result.id)
              setName(result.name)
              setPhone1(result.phone1)
              setPhone2(result.phone2)
              setEmail(result.email)
              setAddress(result.address)
              setTin(result.tin)
              setLegalName(result.legal_name)
              setTelegram(result.telegram)
              setWhatsap(result.whatsap)
              setVk(result.vk)
              setInitialData({
                name: result.name,
                phone1: result.phone1,
                phone2: result.phone2,
                email: result.email,
                address: result.address,
                tin: result.tin,
                legal_name: result.legal_name,
                whatsap: result.whatsap,
                telegram: result.telegram,
                vk: result.vk,
              });

              if (!result.id) {
                throw new Error('ID не найден в ответе сервера');
              }

            } else{
              console.error("Ошибка загрузки данных компании")
            }
          } catch(err) {
            console.error('Ошибка загрузки данных', err)
          }
        }
        fetchData()
      }, [])


    const readData = async (e) =>{
      e.preventDefault()

      const currentId = recordId;

      if (!currentId) {
        setError('Ошибка: данные ещё не загружены.');
        return;
      }


      const updatedData = {
        name: name || initialData.name,
        phone1: phone1 || initialData.phone1,
        phone2: phone2 || initialData.phone2,
        email: email || initialData.email,
        address: address || initialData.address,
        tin: tin || initialData.tin,
        legal_name: legalName || initialData.legal_name,
        whatsap: whatsap || initialData.whatsap,
        telegram: telegram || initialData.telegram,
        vk: vk || initialData.vk,
      };

      try{
        const response = await fetch(`/api/company/company/${currentId}/`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData), // Преобразуем объект в JSON-строку
          });

        
        const result = await response.json()
        if(response.ok) {
          
          setMessage(`Запись успешно обновлена!`);
          setError('');
        }
        else{
          const errorMessage =
            typeof result.detail === 'string'
            ? result.detail
            : Array.isArray(result.detail)
            ? result.detail.map(err => `${err.loc.join(' -> ')}: ${err.msg}`).join(', ')
            : 'Ошибка загрузки! Попробуйте позднее.';
          setError(errorMessage);
          setMessage('');
        }
      } 
      catch(err) {
        setError('Ошибка соединения с сервером! Попробуйте позднее.');
      }
      
    }

  return (
    <div className='company'>
            <div className="company_form">
              <h3>Данные компании</h3>
              <p>Юридическая информация <br />
              <b>!Незаполненные блоки не отображаются на сайте. Для исключения блокировки со стороны Роскомнадзора рекомендуется заполнение всей информации!</b>
              </p>
              {message && <p className="success">{message}</p>}
              {error && <p className="error">{error}</p>}
              <form onSubmit={readData}>

                <div className="company_form_column">

                  <div className="company_form_row">
                    <label htmlFor="name">Название:</label>
                    <input
                      type="text" 
                      id='name' 
                      value={name}
                      onChange={(e) => setName(e.target.value)}/>
                  </div>

                  <div className="company_form_row">
                    <label htmlFor="legal_name">Юридическое наименование:</label>
                    <input
                      type="text" 
                      id='legal_name' 
                      value={legalName}
                      onChange={(e) => setLegalName(e.target.value)}/>
                  </div>
                  
                </div>
              
                <div className="company_form_column">

                  <div className="company_form_row">
                    <label htmlFor="phone1">Номер телефона:</label>
                    <input
                      type="text" 
                      id='phone1' 
                      value={phone1}
                      onChange={(e) => setPhone1(e.target.value)}/>
                  </div>

                  <div className="company_form_row">
                    <label htmlFor="phone2">Дополнительный номер телефона:</label>
                    <input
                      type="text" 
                      id='phone2' 
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value)}/>
                  </div>
                  
                </div>

                <div className="company_form_column">

                  <div className="company_form_row">
                    <label htmlFor="whatsap">Ссылка whatsApp:</label>
                    <input
                      type="text" 
                      id='whatsap' 
                      value={whatsap}
                      onChange={(e) => setWhatsap(e.target.value)}/>
                  </div>

                  <div className="company_form_row">
                    <label htmlFor="telegram">Ссылка telegram:</label>
                    <input
                      type="text" 
                      id='telegram' 
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}/>
                  </div>
                  
                </div>
                
                <div className="company_form_column">

                  <div className="company_form_row">
                    <label htmlFor="vk">Ссылка vk:</label>
                    <input
                      type="text" 
                      id='vk' 
                      value={vk}
                      onChange={(e) => setVk(e.target.value)}/>
                  </div>

                  <div className="company_form_row">
                    <label htmlFor="email">Электронная почта:</label>
                    <input
                      type="text" 
                      id='email' 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}/>
                  </div>
                  
                </div>
                
                <div className="company_form_column">

                  <div className="company_form_row">
                    <label htmlFor="address">Адрес:</label>
                    <input
                      type="text" 
                      id='address' 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}/>
                  </div>

                  <div className="company_form_row">
                    <label htmlFor="tin">ИНН:</label>
                    <input
                      type="text" 
                      id='tin' 
                      value={tin}
                      onChange={(e) => setTin(e.target.value)}/>
                  </div>
                  
                </div>
                <div className="company_form_column">
                  <button className="login_btn" type="submit"  >
                        Загрузить
                    </button>
                </div>

            </form>
            </div>
    </div>
  );
};

export default CompanyInfo;