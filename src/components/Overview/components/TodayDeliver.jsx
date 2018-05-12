import React, { Component } from 'react';
import { Table } from 'antd';
import styles from '../style.less';
import Title from './Title';


export default class HeaderView extends Component {
  renderColumn() {
    const columns = [{
      title: '子订单号',
      dataIndex: 'OrderNum',
      key: 'OrderNum',
    }, {
      title: '物流跟踪号',
      dataIndex: 'OrderNum',
      key: 'OrderNum',
    }, {
      title: '物流方式',
      dataIndex: 'OrderNum',
      key: 'OrderNum',
    }, {
      title: '发货仓库',
      dataIndex: 'OrderNum',
      key: 'OrderNum',
    }, {
      title: '状态',
      dataIndex: 'OrderNum',
      key: 'OrderNum',
    }, {
      title: '更新时间 / 创建时间',
      dataIndex: 'OrderNum',
      key: 'OrderNum',
    }, {
      title: '',
      key: 'oper',
      render: () => {
        return (
          <div>
            <a href="">物流轨迹</a>
          </div>
        );
      },
    }];
    return columns;
  }
  render() {
    return (
      <div className={styles.head}>
        <Title title="今日发货订单表" href="/order" />
        <Table
          columns={this.renderColumn()}
        />
      </div>
    );
  }
}
