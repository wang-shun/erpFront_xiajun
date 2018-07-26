import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';

@window.regStateCache
class appsetTest extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        var a = this.props.location.query;
        // let code = a.code;
        // let state = a.state;
        let companyNo = a.companyNo;
        let auth_code = a.auth_code;
        let expires_in = a.expires_in;
        console.log(companyNo, auth_code, expires_in)
        this.props.dispatch({ type: 'appset/authcallbackWx', payload: { companyNo, auth_code, expires_in }, cb: () => { this.props.dispatch(routerRedux.push('/myApp/appSettings')) }, });
    }
    render() {
        return (
            <div></div>
        );
    }
}

function mapStateToProps(state) {
    const {  } = state.appset;
    return {  };
}

export default connect(mapStateToProps)(Form.create()(appsetTest));
