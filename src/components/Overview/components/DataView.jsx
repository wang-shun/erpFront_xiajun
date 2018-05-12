import React, { Component } from 'react';
import styles from '../style.less';
import Title from './Title';


export default class HeaderView extends Component {
  renderItem({ count, title }) {
    return (
      <li>
        <a>
          <div className={styles.count}>{count}</div>
          <div className={styles.title}>{title}</div>
        </a>
      </li>
    );
  }
  render() {
    return (
      <div className={styles.data}>
        <Title title="今日订单总览" />
      </div>
    );
  }
}
