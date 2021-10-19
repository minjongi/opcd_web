
const setAccessToken = (token) => {
    localStorage.setItem('OPCD_TOKEN', token);
}

const getAccessToken = () => {
    const token = localStorage.getItem('OPCD_TOKEN');
    return token || null;
}

const setUserRole = (role) => {
    localStorage.setItem('role', role);
}

const getUserRole = () => {
    const role = localStorage.getItem('role');
    return role || null;
}

const clearAccessToken = () => {
    localStorage.removeItem('OPCD_TOKEN');
    localStorage.removeItem('role');
}

export {
    setAccessToken,
    getAccessToken,
    setUserRole,
    getUserRole,
    clearAccessToken
}