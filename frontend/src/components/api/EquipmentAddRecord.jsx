import React, {  useState } from 'react';

const EquipmentAddRecord = () => {
    const [name, setName ] = useState('')
    const [file, setFile]  = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!file) {
            setError('Изображение не выбрано')
        }

        const formData = new FormData()

        formData.append('name' , name)
        formData.append('file', file)


        try{
            const response = await fetch('/about/equipment-upload/', {
                method : 'POST',
                body: formData
            })

            if(response.ok) {
                const result = await response.json()

                setMessage(`OK! ${result.message}.`)
                setError('')

                setName('')
                setFile(null)
            } else {
                const result = await response.json()
                setError(result.detail || 'Ошибка загрузки! Попробуйте позднее. Если ошибка сохраняется обратитесь  к администратору')
                setMessage('')
            }
        } catch (err) {
            setError('Ошибка соединения с сервером! Попробуйте позднее. Если ошибка сохраняется обратитесь  к администратору')
            setMessage('')
        }
    }


  return (
    <div className='modal_form'>
        <h2>Добавление записи "Партнеры"</h2>
        <form className='modal_form_body' onSubmit={handleSubmit}>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <div className='modal_form_body_block'>
                <div className='modal_form_body_block_content'>
                    <div className="modal_form_body_block_input">
                        <label htmlFor="title">Заголовок</label>
                        <input type="text"
                            required
                            id='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className='modal_form_body_block_btn'>
                <label htmlFor="file">Изображение:</label>
                <input
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
            </div>
            <div className='modal_form_body_block_btn'>
                <button className="login_btn" type="submit">Загрузить</button>
            </div>
        </form>
    </div>
  );
};

export default EquipmentAddRecord;