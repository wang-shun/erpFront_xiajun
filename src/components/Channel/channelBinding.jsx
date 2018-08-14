import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Select, Form, Popconfirm, Input } from 'antd';


@window.regStateCache
class channelBinding extends Component {

  constructor() {
    super();
    this.state = {
    };
  }


  showModal(){}
  render() {
    
    return (
      <div>
       
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { } = state.channel;
    return {

    };
    
}

export default connect(mapStateToProps)(Form.create()(channelBinding));
