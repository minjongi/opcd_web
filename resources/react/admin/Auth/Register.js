import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const AdminRegister = () => {
    const history = useHistory();
    return (
        <div>AdminRegister
            <Button onClick={() => history.push('/admin')}>register</Button>
        </div>
    )
}

export default AdminRegister;