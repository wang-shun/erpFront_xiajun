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

    const list = messageList.map((el) => (<Card title={el.siteMsg.title}>
      <p>{el.siteMsg.title}</p>
    </Card>));
 
    return <div>{list}</div>;
  }
}

function mapStateToProps({ message }) {
  console.log(message);
  return {
    messageList: message.messageList,
  };
}

export default connect(mapStateToProps)(Message);
