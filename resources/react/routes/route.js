import React from "react";
import { Route, Redirect } from "react-router-dom";
import { CommonLayout, AdminLayout } from "../layout"

const AppRoute = ({
  component: Component,
  layout,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      // if (isAuthProtected && !isUserAuthenticated(permission)) {
      //   return (
      //     <Redirect to={{ pathname: "/login", state: { from: props.location } }} exact />
      //   );
      // }

      if(layout === 'common'){
        return (
          <CommonLayout>
            <Component {...props}/>
          </CommonLayout>  
        )
      }

      if(layout === 'admin') {
        return (
          <AdminLayout>
            <Component {...props}/>
          </AdminLayout>  
        )
      }

      return (
        <Component {...props} />
      );
    }}
  />
);

export default AppRoute;

