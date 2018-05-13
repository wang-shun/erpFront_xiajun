import React, { Component } from 'react';
import styles from '../style.less';

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
    const { info = {} } = this.props;
    console.log(info);
    const orderList = [{
      count: info.todayOrderNum || 0,
      title: '今日订单数',
    },
    {
      count: info.todayUnAlloOrderNum || 0,
      title: '待分配订单数',
    },
    {
      count: info.todayPurItemNum || 0,
      title: '采购商品数',
    },
    {
      count: info.todayInItemNum || 0,
      title: '今日入库商品数',
    },
    {
      count: info.purchaseProblem || 0,
      title: '采购异常订单数',
    }];

    // {
    //   count: info.asas || '--',
    //   title: '库存异常的商品数',
    // }

    return (
      <div className={styles.head}>
        <ul>
          {orderList.map(order => this.renderItem({ count: order.count, title: order.title }))}
        </ul>
      </div>
    );
  }
}
