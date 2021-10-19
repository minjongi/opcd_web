import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Switch, BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import "react-datepicker/dist/react-datepicker.css";

import {
  publicRoutes,
  adminRoutes,
  memberRoutes,
  mainRoutes,
  wmmRoutes,
  featureRoutes,
  beatboxRoutes,
  vinylboxRoutes
} from "./routes";
import AppRoute from "./routes/route";

const App = () => {
  const user = useSelector((state) => state.userState);
  
  useEffect(() => {
    if(Kakao){
        Kakao.init(process.env.MIX_KAKAO_JS_KEY);
    }
  }, []);

  return (
    <React.Fragment>
      <Router>
        <Switch>
          {user && user.role === 'ADMIN' && adminRoutes.map((route, idx) => (
            <AppRoute key={idx} {...route}/>
          ))}

          {user && user.role === 'MEMBER' && memberRoutes.map((route, idx) => (
            <AppRoute key={idx} {...route}/>
          ))}

          {user && user.role === 'MAIN' && mainRoutes.map((route, idx) => (
            <AppRoute key={idx} {...route}/>
          ))}

          {user && user.role === 'MAGAZINE' && featureRoutes.map((route, idx) => (
            <AppRoute key={idx} {...route}/>
          ))}

          {user && user.role === 'WMM' && wmmRoutes.map((route, idx) => (
            <AppRoute key={idx} {...route}/>
          ))}

          {user && user.role === 'BEATBOX' && beatboxRoutes.map((route, idx) => (
            <AppRoute key={idx} {...route}/>
          ))}

          {user && user.role === 'VINYL' && vinylboxRoutes.map((route, idx) => (
            <AppRoute key={idx} {...route}/>
          ))}

          {publicRoutes.map((route, idx) => (
            <AppRoute key={idx} {...route}/>
          ))}
        </Switch>
      </Router>

      <ToastContainer/>
      
    </React.Fragment>
  );
}

export default App;
