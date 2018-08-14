import React, { Component } from 'react';
import styles from '../style.less';
import { Button } from 'antd';

export default class HeaderView extends Component {
  renderItem({ count, title }) {
    return (
      <li>
        <a onClick={this.handleClick.bind(this,title)}>
          <div className={styles.count}>{count}</div>
          <div className={styles.title}>{title}</div>
        </a>
      </li>
    );
  };
  handleClick(title) {
    if ("今日订单数" == title) {
      window.location.href = "/#/sale/orderList";
    }
  };
  render() {
    const { info = {} } = this.props;
    // console.log(info);
    const { data ={}} = info;
    // console.log(data)
    // console.log(data.todayOrderNum)
    // console.log(info.todayOrderNum)
    // console.log(info.data);
    // console.log(info.data.todayOrderNum)
    // let result;
    // if (info.data.todayInItemNum != undefined) {
    //   let result = info.data;
    // }
    const orderList = [{
      count: data.todayOrderNum || 0,    
      title: '今日订单数',
    },
    {
      count: data.todayGmv || 0,
      title: '今日GMV',
    },
    {
      count: data.weekOrderNum || 0,
      title: '一周订单数',
    },
    {
      count: data.weekGmv || 0,
      title: '一周GMV',
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
