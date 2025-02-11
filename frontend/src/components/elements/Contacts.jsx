import React, { useEffect, useState } from 'react';
import LidForm from '../UX/LidForm';
import { motion } from 'framer-motion';

const Contacts = () => {

    const [company, setCompany] = useState('')
    
    const companyData = (data) => ({
        'id' : data.id || null,
        'name' : data.name || null,
        'phone1' :data.phone1 || null,
        'phone2' : data.phone2 || null,
        'email' : data.email || null,
        'address' : data.address || null,
        'tin' : data.tin || null,
        'legal_name' : data.legal_name || null,
        'whatsap' : data.whatsap || null,
        'telegram' : data.telegram || null,
        'vk' : data.vk|| null
    })
    
    useEffect(() => {
        const fetchData = async () => {
          try{
            const response = await fetch('/api/company')
            if(response.ok) {
              const result = await response.json()
              setCompany(companyData(result))
            } else{
              console.error("Ошибка загрузки данных компании")
            }
          } catch(err) {
            console.error('Ошибка загрузки данных', err)
          }
        }
        fetchData()
    }, [])


  return (
    <section id='contacts' name='contacts' className='container contacts'>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, amount: 0.8 }}  
        transition={{ duration: 0.8 }} 
      >
        <h3 className='title-typography'>Контакты</h3>
      </motion.div>
      <div className="contacts_body">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true, amount: 0.3 }}  
          transition={{ duration: 0.8 }} 
          className="contacts_card">
          <div className="contacts_card_left">
            <div className="contacts_card_post" >
              <a className='contacts_card_phone' href={"tel:" + company.phone1}>{company.phone1}</a>
              <a className='contacts_card_mail' href={"mailto:" + company.email}>e-mail: <span>{company.email}</span></a>
            </div>
            <div className='contacts_card_tin'>
              {company.address ? <p>Наш адрес: {company.address}</p> : <></>}
              {company.legal_name ? <p><span>{company.legal_name}</span></p> : <></>}
              {company.tin ? <p><span>ИНН:{company.tin}</span></p> : <></>}
            </div>   
          </div>
          <div className="contacts_card_right">
            {company.whatsap ? <a aria-label='Денса бассейны в Вацап' className='contacts_card_link' href={company.whatsap}>whatsApp</a> : <p></p>}
            {company.vk ? <a aria-label='Денса бассейны в VK' className='contacts_card_link' href={company.vk}>vk</a> : <p></p>}
            {company.telegram ? <a aria-label='Денса бассейны в телеграм' className='contacts_card_link' href={company.telegram}>telegram</a> : <p></p>}  
          </div>   
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true, amount: 0.3 }}  
          transition={{ duration: 0.8 }}
          className='contacts_form'
        >
          <LidForm formTitle={`Давайте знакомиться`} />
        </motion.div>     
      </div>
    </section>
  );
};

export default Contacts;