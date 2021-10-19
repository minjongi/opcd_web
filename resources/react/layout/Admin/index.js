import React from 'react';
import { Container } from "react-bootstrap";

import Topbar from "./Topbar";
import Navbar from "./Navbar";

const AdminLayout = ({children}) => {
  

  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <Topbar/>
        <Navbar/>
        
        <div className="main-content">
          <div className="page-content">
            <Container fluid>
              {children}
            </Container>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default AdminLayout;
