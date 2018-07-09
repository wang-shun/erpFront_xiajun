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

    const list = messageList.map((el) => (<Card title={el.siteMsg.title} style={{ marginBottom: 20 }}>
      <p>{el.siteMsg.content}</p>
      <p style={{marginTop: 10, color: '#ccc'}}>{el.siteMsg.gmtCreate}</p>
    </Card>));
 
    return <div>{list.length > 0 ? list : '暂无消息'}</div>;
  }
}

function mapStateToProps({ message }) {
  return {
    messageList: message.messageList,
  };
}

export default connect(mapStateToProps)(Message);
