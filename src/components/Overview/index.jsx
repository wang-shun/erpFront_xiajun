import React, { Component } from 'react';
import { Alert } from 'antd';
import { connect } from 'dva';

class Overview extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    // this.props.dispatch({ type: 'session/queryIndexData' });
    this.props.dispatch({ type: 'session/querySiteMsg' });
    this.props.dispatch({ type: 'session/readMsg', payload: { id: 15 } });
  }
  render() {
    return (
      <Alert
        message="欢迎来到ERP管理系统"
        description="点击左侧目录进行管理操作。"
        type="info"
        showIcon
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state
  };
}

export default connect(mapStateToProps)(Overview);

