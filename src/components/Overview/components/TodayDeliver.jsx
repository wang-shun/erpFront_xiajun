import React, { Component } from 'react';
import { Table } from 'antd';
import styles from '../style.less';
import Title from './Title';


export default class HeaderView extends Component {
  renderColumn() {
    const columns = [{
      title: '子订单号',
      dataIndex: 'erpNo',
      key: 'erpNo',
    }, {
      title: '物流跟踪号',
      dataIndex: 'shippingNo',
      key: 'shippingNo',
    }, {
      title: '物流方式',
      dataIndex: 'logisticType',
      key: 'logisticType',
      render(text) { return text === 0 ? '直邮' : (text === 1 ? '拼邮' : '-'); },
    }, {
      title: '发货仓库',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      render(text) { return text || '-' },
    }, {
      title: '状态',
      dataIndex: 'stockStatus',
      key: 'stockStatus',
        render(text) {
          switch (text) {
            case 0: return <font>未备货</font>;
            case 1: return <font color="sienna">部分备货</font>;
            case 2: return <font color="saddlebrown">部分在途备货</font>;
            case 3: return <font color="saddlebrown">全部在途备货</font>;
            case 4: return <font color="sienna">混合备货完成</font>;
            case 9: return <font color="red">已释放</font>;
            case 10: return <font color="blue">已备货</font>;
            case 11: return <font color="green">预出库</font>;
            default: return '-';
          }
        },
      
    }, {
      title: '更新时间 / 创建时间',
      dataIndex: 'gmtModify',
      key: 'gmtModify',
    }];

    {/* , {
      title: '',
      key: 'oper',
      render: () => {
        return (
          <div>
            <a href="">物流轨迹</a>
          </div>
        );
      },
    } */}
    return columns;
  }
  render() {
    return (
      <div className={styles.head}>
        <Title title="今日发货订单表" href="#/sale/erpOrder" />
        <Table
          columns={this.renderColumn()}
          dataSource={this.props.data || []}
          pagination={false}
        />
      </div>
    );
  }
}
