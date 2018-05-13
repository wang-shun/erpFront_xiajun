import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table } from 'antd';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.columns = [];
  }

  render() {
    const { messageList } = this.props;
    console.log(messageList);
    return (
      <Card>
        <Table
          columns={this.columns}
        />
      </Card>
    );
  }
}

function mapStateToProps({ message }) {
  console.log(message);
  return {
    messageList: message.messageList,
  };
}

export default connect(mapStateToProps)(Message);
