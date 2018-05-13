import React, { Component } from 'react';
import styles from '../style.less';
import Title from './Title';


export default class HeaderView extends Component {
  render() {
    return (
      <div className={styles.schedule}>
        <Title title="待办事项" icon="sync" />
        <div className={styles['schedule-content']}>
          <div className={styles.item}>
            <div className={styles.title} >【发现新品审核】</div>
            <div className={styles['content-title']}>买手belig，提交最新发现商品</div>
            <div className={styles.content}>女款西服，采购有效时间为48小时，请尽快审核。</div>
            <div className={styles.time}>2018/04/29 12:33:00</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title} >【采购任务单待分配】</div>
            <div className={styles['content-title']}>订单号：BS103938493，待分配</div>
            <div className={styles.time}>2018/04/29 12:33:00</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title} >【采购任务待接收】</div>
            <div className={styles['content-title']}>订单号：BS103938493，已分配给你采购</div>
            <div className={styles.content}>请前往订单列表查看详情，也可以打开采购小程序，直接采购。</div>
            <div className={styles.time}>2018/04/29 12:33:00</div>
          </div>
        </div>
      </div>
    );
  }
}
