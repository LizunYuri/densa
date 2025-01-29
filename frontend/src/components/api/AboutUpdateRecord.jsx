import React, { useEffect, useState } from 'react';

const AboutUpdateRecord = ({ recordId, onRecordUpdated }) => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [currentFile, setCurrentFile] = useState('');
    const [newFile, setNewFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [initialData, setInitialData] = useState({ title: '', content: '', url: '' });

    const fetchData = async () => {
        try {
            const response = await fetch(`/about/about/about/${recordId}/`);
            if (response.ok) {
                const data = await response.json();
                setTitle(data.record.title);
                setContent(data.record.content);
                setCurrentFile(data.record.url);
                setError('');
            } else {
                const errorText = await response.text();
                setError(`Ошибка загрузки данных: ${errorText}`);
            }
        } catch (err) {
            setError(`Ошибка загрузки данных: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchData();
    }, [recordId]);


    const readData = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
    
        // Проверяем, изменены ли поля
        if (title !== initialData.title) {
            formData.append('title', title);
        }
        if (content !== initialData.content) {
            formData.append('content', content);
        }
    
        // Если новый файл выбран, добавляем его
        if (newFile) {
            formData.append('file', newFile);
        }
    
        try {
            const response = await fetch(`/about/about-update/about/${recordId}/`, {
                method: 'PUT',
                body: formData,
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setMessage(`Запись успешно обновлена!`);
                setError('');
                setCurrentFile(result.file);
                if (onRecordUpdated) onRecordUpdated();
            } else {
                const errorMessage =
                    typeof result.detail === 'string'
                        ? result.detail
                        : Array.isArray(result.detail)
                        ? result.detail.map(err => `${err.loc.join(' -> ')}: ${err.msg}`).join(', ')
                        : 'Ошибка загрузки! Попробуйте позднее.';
                setError(errorMessage);
                setMessage('');
            }
        } catch (err) {
            setError('Ошибка соединения с сервером! Попробуйте позднее.');
        }
    };
    

    return (
        <div className="modal_form">
            <form className="modal_form_body" onSubmit={readData}>
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
                <div className="modal_form_body_block">
                    <div className="modal_form_body_block_content">
                        <div className="modal_form_body_block_input">
                            <label htmlFor="title">Заголовок</label>
                            <input
                                type="text"
                                required
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="modal_form_body_block_content">
                        <div className="modal_form_body_block_input">
                            <label htmlFor="content">Содержание</label>
                            <textarea
                                required
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="modal_form_body_block_btn">
                    {currentFile && (
                        <div>
                            <label>Текущее изображение:</label>
                            <img src={currentFile} alt="Текущее изображение" style={{ maxWidth: '200px' }} />
                        </div>
                    )}
                    <label htmlFor="file">Новое изображение:</label>
                    <input
                        type="file"
                        id="file"
                        accept="image/*"
                        onChange={(e) => setNewFile(e.target.files[0])}
                    />
                </div>
                <div className="modal_form_body_block_btn">
                    <button className="login_btn" type="submit">
                        Загрузить
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AboutUpdateRecord;