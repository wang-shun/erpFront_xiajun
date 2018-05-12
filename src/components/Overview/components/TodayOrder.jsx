import React, { Component } from 'react';
import styles from '../style.less';
import Title from './Title';


export default class HeaderView extends Component {
  render() {
    return (
      <div className={styles.order}>
        <Title title="今日订单总览" icon="sync" />
        <div >
          <div>采购订单数</div>
        </div>
      </div>
    );
  }
}
