import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';

@window.regStateCache
class AgentTest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  hadleClick = () => {
  }
  componentDidMount(){
    var a =  this.props.location.query;
    let code = a.code;
    let state = a.state;
    console.log(code,state);
    this.props.dispatch({ type: 'order/setProxy', payload: { code,state }, cb: () => {this.props.dispatch(routerRedux.push('/marketing/saleAgent'))}, });
    }
  render() {
    return (
      <div onClick={this.hadleClick}>1111</div>
    );
  }
}

function mapStateToProps(state) {
  const {  } = state.order;
  return {  };
}

export default connect(mapStateToProps)(Form.create()(AgentTest));
