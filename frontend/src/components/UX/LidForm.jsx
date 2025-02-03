import React, { useEffect, useState } from 'react';
import axios from "axios";
import InputMask from "react-input-mask-next";


const LidForm = () => {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [is_ofer, setIs_ofer] = useState(true)
  const [errors, setErrors] = useState({})
  const [statusForm, setStatusForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')


  const validate = () =>{
    const errors = {}

    if(!name.trim()) {
      errors.name = 'Обязательно к заполнению'
    }

    if(!phone || phone.includes("_")){
      errors.phone = 'Проверьте правильность ввода'
    }


    setErrors(errors)

    return Object.keys(errors).length === 0

  }

  const formatPhoneNumber = (value) => {
    // Удаляем все символы, кроме цифр
    const numbers = value.replace(/\D/g, "");

    // Проверяем первую цифру и заменяем на +7, если начинается с 8 или 7
    let formatted = numbers;
    if (numbers.startsWith("8") || numbers.startsWith("7")) {
      formatted = "7" + numbers.slice(1);
    }

    
    if (formatted.length > 1) {
      formatted = "+" + formatted;
    }
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + "(" + formatted.slice(2);
    }
    if (formatted.length > 6) {
      formatted = formatted.slice(0, 6) + ")" + formatted.slice(6);
    }
    if (formatted.length > 10) {
      formatted = formatted.slice(0, 10) + "-" + formatted.slice(10);
    }
    if (formatted.length > 13) {
      formatted = formatted.slice(0, 13) + "-" + formatted.slice(13, 15);
    }

    return formatted.slice(0, 16); // Ограничиваем длину номера
  };

  const handlePhoneChange = (e) => {
    let input = e.target.value
    
    setPhone(formatPhoneNumber(input));
  }

  const handleCheckboxChange = (e) => {
    setIs_ofer(e.target.checked);
  };

  const handleSubmit = async (e) =>{
    e.preventDefault()

    if(!validate()){
      return
    }

    try{
      const response = await axios.post('/clients/upload/', {
        name,
        phone,
        is_ofer,
      });
      setSuccessMessage("form submit")
      setName('')
      setPhone('')
      setIs_ofer(true)
      setErrors({})
      setStatusForm(true)
    } catch(err) {
      setErrors({server : "Произошла ошибка при отправке формы. Попробуйте снова."})
    }

  }



  return (
    <div className={`user_data_body
      tranition
      ${statusForm ? 'form_none' : ''}
      `}>
      <h3 className='title-typography'>Узнайте больше</h3>
      <p>Оставьте номер телефона и мы Вам перезвоним</p>
      <div className={`lid_form`}>
        <form 
          onSubmit={handleSubmit}
          className={`lid_form`}
          noValidate>
          {errors.server && <p className="lid_form_message">{errors.server}</p>}
          <div className="lid_form_group">
            {errors.name && <p className="lid_form_message">{errors.name}</p>}
            <label className="lid_form_group_label" htmlFor="name">Имя</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите ваше имя"
              className="lid_form_group_input"
            />
          </div>
          <div className="lid_form_group">
            {errors.phone && <p className="lid_form_message">{errors.phone}</p>}
            <label className="lid_form_group_label" htmlFor="phone">Телефон</label>
            <input
            className="lid_form_group_input"
              type="text"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+7(000)000-00-00"
            />
          </div>
          <div className="lid_form_group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={is_ofer}
                onChange={handleCheckboxChange}
                className={`custom-checkbox`}
              />
              Вы соглашаетесь на обработку ваших персональных данных
            </label>
          </div>
          <div className="lid_form_group">
            <button type="submit" className="lid_form_btn">
                  Отправить
            </button>
          </div>
        </form>
      </div>

      <div className="form_circle">
        <div className="form_circle_inside">
          <div className="line"></div>
        </div>
      </div>

    </div>
  );
};

export default LidForm;