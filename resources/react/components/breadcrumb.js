import React, { Component } from 'react';
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

import { getLoggedInUser } from '../helpers/authority';

class Breadcrumb extends Component {

    triggerAction () {
        const { history, toolbars } = this.props;
        if(toolbars.path){
            history.push(toolbars.path);
        }else if(toolbars.toggle){
            toolbars.toggle();
        }
    }
    render() {
        const { t } = this.props;
        const itemLength = this.props.breadcrumbItems.length;
        const userInfo = getLoggedInUser();

        const ableAction = !!this.props.toolbars && (userInfo.type === 'ADMIN' || this.props.toolbars.actionName === 'add_new_transaction');

        return (
            <React.Fragment>
                    <Row>
                        <Col sm="6">
                            <div className="page-title-box">
                                {/* <h4>{this.props.title}</h4> */}
                                    <ol className="breadcrumb m-0">
                                        <li><i className="fas fa-home" style={{color: "#a0a0a0", margin: "0 10px"}}></i></li>
                                        {
                                            this.props.breadcrumbItems.map((item, key) =>
                                                (key+1) === itemLength ?
                                                    <li key={key} className="breadcrumb-item active">{t(item.title)}</li>
                                                :   <li key={key} className="breadcrumb-item"><Link to="#">{t(item.title)}</Link></li>
                                            )
                                        }
                                    </ol>
                            </div>
                        </Col>
                        <Col sm="6">
                            {ableAction && 
                                <div className="state-information">
                                    <Button color="info" className="float-right" onClick={this.triggerAction}>{t(this.props.toolbars.actionName)}</Button>
                                </div>
                            }
                        </Col>
                    </Row>
            </React.Fragment>
        );
    }
}

const mapStatetoProps = state => {
    const Layout = state.Layout;
    const BreadcrumbData = state.Breadcrumb
    return {layoutType : Layout.layoutType, title : BreadcrumbData.title, breadcrumbItems : BreadcrumbData.breadcrumbItems, toolbars: BreadcrumbData.toolbars };
};

export default connect(mapStatetoProps, { })(Breadcrumb);