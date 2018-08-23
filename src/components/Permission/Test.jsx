import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';

@window.regStateCache
class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount(){
    var a =  this.props.location.query;
    let code = a.code;
    let state = a.state;
    console.log(code,state);
    this.props.dispatch({ type: 'permission/authorizedWx', payload: { code,state }, cb: () => {this.props.dispatch(routerRedux.push('/permission/user',{visibleWx:false}))}, });
    }
  render() {
    return (
      <div></div>
    );
  }
}

function mapStateToProps(state) {
  const { userList, userTotal, userModal, orgList, roleList, wxData } = state.permission;
  return { userList, total: userTotal, userModal, orgList, roleList, wxData };
}

export default connect(mapStateToProps)(Form.create()(Test));
