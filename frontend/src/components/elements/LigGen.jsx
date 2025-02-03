import React, { useEffect, useState } from 'react';
import LidForm from '../UX/LidForm';


const LigGen = () => {
    return (
        <div className='user_data' id='user_data' name='user_data'>
            <div className='user_data_container'>
                <div className="user_data_container_img">
                </div>
                <div className="container user_data_content">
                    <LidForm />
                </div>
            </div>
        </div>
  );
};

export default LigGen;