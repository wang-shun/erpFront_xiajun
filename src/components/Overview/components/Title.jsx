import React, { Component } from 'react';
import { Icon } from 'antd';

export default class Title extends Component {
  render() {
    const { title, href, icon } = this.props;
    return (
      <div style={{ marginBottom: 6 }}>
        <span style={{ color: '#999' }}>{title}</span>
        {icon && <span style={{ float: 'right', cursor: 'pointer' }}>{<Icon type={icon} />}</span>}
        {href && <a href={href} style={{ float: 'right' }}>查询更多</a>}
      </div>
    );
  }
}
