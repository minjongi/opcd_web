import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { Icon } from '../../components';
import { deleteUser } from "../../store/auth/actions";


const UserMenu = ({showSearch, toggleSearch}) => {
    const dispatch = useDispatch();
    const userState = useSelector(state => state.userState);

    const handleLogout = e => {
        e.preventDefault();
        dispatch(deleteUser());
        history.push("/main");
    };

    console.log(toggleSearch)
    return (
        <ul className="text-ttnorm-md">
            {userState && userState.id && userState.role === "USER" ? (
                <>
                    <li>
                        <Link
                            className="text-white"
                            to={`/profile/${userState.artist_id}`}
                        >
                            Profile
                        </Link>
                    </li>
                    <li className="divider"></li>
                    <li>
                        <Link className="text-white" to="/my_page">
                            My Page
                        </Link>
                    </li>
                    <li className="divider"></li>
                    <li>
                        <a
                            className="text-white"
                            style={{ cursor: "pointer" }}
                            onClick={handleLogout}
                        >
                            Logout
                        </a>
                    </li>
                </>
            ) : (
                <>
                    <li>
                        <Link className="text-white" to="/login">
                            Login
                        </Link>
                    </li>
                    <li className="divider"></li>
                    <li>
                        <Link className="text-white" to="/register">
                            Sign Up
                        </Link>
                    </li>
                </>
            )}
            <li>
                <a role="button" className="d-block d-md-none cursor-pointer pl-1" onClick={() => toggleSearch()}>
                    {showSearch ? 
                        <Icon name="close" />
                        :
                        <Icon name="search" />
                    }
                </a>
            </li>
        </ul>
    );
};

export default UserMenu;
