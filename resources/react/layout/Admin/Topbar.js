import React from 'react';
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { toggleMobileMenu, deleteUser } from '../../store/actions';
import { Icon } from '../../components';
import { Button } from '../../components/form';

const Topbar = () => {
    const history = useHistory();
    const user = useSelector((state) => state.userState);
    const dispatch = useDispatch();

    const toggleMenu = () => {
        dispatch(toggleMobileMenu());
    }

    const handleLogout = () => {
        dispatch(deleteUser());
        history.push('/admin/login');
    }
    
    return (
        <React.Fragment>
            <header id="page-topbar">
                <div className="navbar-header">
                    <div className="d-flex">

                        <div className="navbar-brand-box">
                            <Link to="/admin" className="logo logo-dark">
                                <span className="logo">
                                    <img src="/logo.png" alt="" height="20"/>
                                </span>
                            </Link>
                        </div>

                        <button type="button" onClick={ toggleMenu } className="burger-menu-btn btn px-4">
                            <Icon name="burger" color="black"/>
                        </button>

                    </div>

                    <div className="d-flex align-items-center">
                        <span>{user.name}</span>
                        <Button
                            label="로그아웃"
                            className=" btn-outline rounded light py-1 px-3 ml-4"
                            onClick={handleLogout}/>
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
}

export default Topbar;
