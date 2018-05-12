import React, { Component } from 'react';
import styles from '../style.less';

const orderList = [{
  count: 165,
  title: '今日订单数',
},
{
  count: 151,
  title: '待分配订单数',
},
{
  count: 228,
  title: '采购商品数',
},
{
  count: 41,
  title: '今日入库商品数',
},
{
  count: 1,
  title: '采购异常订单数',
},
{
  count: 15,
  title: '库存异常的商品数',
}];

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
      <div className={styles.head}>
        <ul>
          {orderList.map(order => this.renderItem({ count: order.count, title: order.title }))}
        </ul>
      </div>
    );
  }
}
