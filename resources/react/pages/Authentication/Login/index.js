import React, { useState } from 'react';

import LoginForm from './LoginForm';
import ForgetForm from './ForgetForm';

const Login = () => {
    const [page, setPage] = useState('LOGIN');

    return (
        <div className="login-page-content mb-5">
            <div className="section-container">
                <div  className="max-w-500 m-auto">
                    {page === 'LOGIN' ?
                        <LoginForm onChangePage={(page) => setPage(page)}/>
                        :
                        <ForgetForm page={page} onChangePage={(page) => setPage(page)}/>
                    }
                </div>
            </div>
        </div>   
    )
}

export default Login;




