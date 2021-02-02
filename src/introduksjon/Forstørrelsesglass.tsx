import React, { FunctionComponent } from 'react';

const Forstørrelsesglass: FunctionComponent = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none">
            <title>Forstørrelsesglass</title>
            <path
                fill="#3E3832"
                fillRule="evenodd"
                d="M0 17.2a17.2 17.2 0 1034.4 0 17.2 17.2 0 00-34.4 0zm31.2 0a14 14 0 11-28 0 14 14 0 0128 0z"
                clipRule="evenodd"
            ></path>
            <path
                fill="#3E3832"
                d="M28.6 27.5c.8-.8 2.2-.8 3 0l15 15a2.1 2.1 0 01-3 3.1l-15-15c-.9-1-.9-2.3 0-3.1z"
            ></path>
            <path fill="#C2EAF7" d="M17.2 31.2a14 14 0 100-28 14 14 0 000 28z" opacity="0.5"></path>
            <path
                fill="#CDE7D8"
                d="M12.9 26.2c1 .4 2 .6 3.2.6 5.4 0 9.7-4.7 9.7-10.5 0-3.7-1.7-6.9-4.3-8.8C25.3 9 28 13 28 17.5c0 5.7-4.4 10.5-9.7 10.5-2 0-3.9-.7-5.4-1.8z"
            ></path>
        </svg>
    );
};

export default Forstørrelsesglass;
