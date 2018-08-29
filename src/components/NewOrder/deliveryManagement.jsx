import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Row, Col, Select, Form, Modal, Popover, Icon, message } from 'antd';

const FormItem = Form.Item;

@window.regStateCache
class deliveryManagement extends Component {

  constructor() {
    super();
    this.state = {
    
    };
  }
  render() {
    const p = this;
    const { form, dispatch} = p.props;
    return(
      <div></div>
    );
  }
}

function mapStateToProps(state) {
  const { } = state.neworder;
  return {
  };
}

export default connect(mapStateToProps)(deliveryManagement);
