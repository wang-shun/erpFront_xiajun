import React, { Component } from 'react';
import styles from '../style.less';

export default class ExceptionTips extends Component {
  render() {
    return (
      <div className={styles.exception}>
        <span className={styles.error}>异常提醒</span>
        <span>【订单异常】</span>
        <span style={{ width: '40%', color: '#333' }}>订单号：BS16034938329 异常信息的内容文字</span>
        <span style={{ color: '#ff2e38' }}>滚动显示</span>
        <span style={{ color: '#999', width: '20%' }}> 2018/04/12 12:33:00</span>
        <span><a>查看全部</a></span>
      </div>
    );
  }
}
