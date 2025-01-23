import React, { useEffect, useState } from 'react';
const UploadFirstScreenRecord = () => {

    const [title, setTitle ] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [content, setContent] = useState('')
    const [file, setFile]  = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!file) {
            setError('Изображение не выбрано')
        }

        const formData = new FormData()

        formData.append('title' , title)
        formData.append('subtitle', subtitle)
        formData.append('content', content)
        formData.append('file', file)


        try{
            const response = await fetch('/img/upload-image/', {
                method : 'POST',
                body: formData
            })

            if(response.ok) {
                const result = await response.json()

                setMessage(`OK! ${result.message}.`)
                setError('')

                setTitle('')
                setSubtitle('')
                setContent('')
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
        <h2>Добавление записи</h2>
        <form className='modal_form_body' onSubmit={handleSubmit}>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <div className='modal_form_body_block'>
                <div className='modal_form_body_block_content'>
                    <div className="modal_form_body_block_input">
                        <label htmlFor="title">Заголовок</label>
                        <input type="text"
                            required
                            id='title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="modal_form_body_block_input">
                        <label htmlFor="subtitle">Подзаголовок</label>
                        <input type="text"
                            required
                            id='subtitle'
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)} />
                    </div>
                </div>
                <div className='modal_form_body_block_content'>
                    <div className="modal_form_body_block_input">
                        <label htmlFor="title">Содержание</label>
                        <textarea 
                            required
                            id='content'
                            value={content}
                            onChange={(e) => setContent(e.target.value)} />
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

export default UploadFirstScreenRecord;

