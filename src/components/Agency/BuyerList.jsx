import React, {
  Component,
} from 'react';
import { connect } from 'dva';
import { Table, Input, Row, Col, Form, Modal, Popconfirm, Select, Icon } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;


@window.regStateCache
class BuyerList extends Component {

  constructor() {
    super();
    this.state = {
      visible: false,
      title: '-', // modal的title
      editable: [],
      commissionAfter: '%',
    };
    this.selectAfter = (
      <Select defaultValue="%" style={{ width: 60 }} onChange={val => this.setState({ commissionAfter: val })}>
        <Option value="%">%</Option>
        <Option value="美元">美元</Option>
      </Select>
    );
  }
  // 这里的提交是新增或修改 不是分页， TODO: 分页
  handleSubmit() {
    const { buyerValues = {}, dispatch } = this.props;
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      if (buyerValues.id) { // 修改
        dispatch({
          type: 'agency/updateBuyerType',
          payload: {
            ...fieldsValue,
            id: buyerValues.id,
            pageIndex: 1,
          },
          cb: () => {
            this.closeModal(false);
          },
        });
      } else { // 新增
        dispatch({
          type: 'agency/addBuyerType',
          payload: {
            ...fieldsValue,
          },
          cb: () => {
            this.closeModal(false);
          },
        });
      }
    });
  }


  closeModal(visible) {
    this.setState({
      visible,
    });
    this.props.dispatch({
      type: 'agency/saveBuyerType',
      payload: {},
    }, () => {
      this._refreshData();
    });
  }

  handleQuery(record) {
    const p = this;
    p.setState({
      visible: true,
      title: '修改',
    }, () => {
      p.props.dispatch({
        type: 'agency/queryBuyerType',
        payload: {
          id: record.id,
        },
      });
    });
  }

  handleDelete(record, i) {
    const { editable } = this.state;
    this.props.dispatch({
      type: 'agency/deleteBuyerType',
      payload: {
        id: record.id,
      },
      cb() {
        this._refreshData();
        editable.splice(i, 1);
      },
    });
  }

  handleEditCommission(i) {
    const editable = this.state.editable;
    editable.forEach(n => n === false);
    editable[i] = true;
    this.setState({
      editable,
    });
  }

  handleChangeCommission(type, i, r) {
    const { editable } = this.state;
    if (type) {
      const value = this.commission.refs.input.value;
      // const purchaseCommissionStr = commissionAfter === '%' ? `${value}%` : value;
      const purchaseCommissionStr = value;
      this.props.dispatch({
        type: 'agency/setCommission',
        payload: {
          id: r.id,
          purchaseCommissionStr,
          purchaseCommissionMode: 0,
        },
        cb() {
          editable[i] = false;
        },
      });
    } else {
      editable[i] = false;
    }
    this.setState({ editable });
  }

  renderColumn(t, r, i) {
    const { editable } = this.state;
    if (editable[i]) {
      return (
        <div>
          <Input
            // addonAfter={this.selectAfter}
            placeholder="请输入佣金率"
            defaultValue={t}
            size="small"
            ref={(c) => { this.commission = c; }}
            style={{ textAlign: 'center', width: 150, marginRight: 10 }}
          />
          <div style={{ display: 'inline', lineHeight: 2.4 }}>
            <a onClick={this.handleChangeCommission.bind(this, true, i, r)}>确认</a>
            <span> | </span>
            <a onClick={this.handleChangeCommission.bind(this, false, i)}>返回</a>
          </div>
        </div>
      );
    }
    return (
      <span style={{ cursor: 'pointer' }}>{t} <Icon type="edit" style={{ color: '#00cbd7' }} onClick={this.handleEditCommission.bind(this, i)} /></span>
    );
  }

  render() {
    const p = this;
    const { form, buyerList = [], buyerValues = {}, wareList = [] } = p.props;
    console.log(buyerValues);
    const { getFieldDecorator } = form;
    const { title, visible } = p.state;
    const formItemLayout = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const columns = [{
      title: '买手名字',
      dataIndex: 'nickName',
      key: 'nickName',
      width: '25%',
    },
    {
      title: '所属仓库',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: '25%',
    },
    {
      title: '佣金管理',
      dataIndex: 'purchaseCommissionStr',
      key: 'purchaseCommissionStr',
      width: '25%',
      render: (t, r, i) => this.renderColumn(t, r, i),
    },
    {
      title: '操作',
      dataIndex: 'operator',
      key: 'operator',
      render(t, r, i) {
        return (
          <div>
            <a href="javascript:void(0)" onClick={p.handleQuery.bind(p, r)} style={{ marginRight: 10 }}>修改</a>
            <Popconfirm title="确定删除此类别？" onConfirm={p.handleDelete.bind(p, r, i)}>
              <a href="javascript:void(0)">删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
    ];
    const modalProps = {
      title,
      visible,
      closable: true,
      onOk() {
        p.handleSubmit();
      },
      onCancel() {
        p.closeModal(false);
      },
    };

    return (
      <div>
        {/* <Row>
          <Col className="operBtn" style={{ borderTop: 'none', marginTop: 0 }}>
            <Button type="primary" size="large" onClick={() => this.setState({ visible: true, title: '新增买手' })}>新增买手</Button>
          </Col>
        </Row> */}
        <Row>
          <Col>
            <Table
              columns={columns}
              dataSource={buyerList}
              bordered
              size="large"
              rowKey={record => record.id}
            />
          </Col>
        </Row>
        <Modal {...modalProps}>
          <Form>
            <Row>
              <Col span={11}>
                <FormItem
                  label="买手名"
                  {...formItemLayout}
                >
                  {getFieldDecorator('nickName', {
                    initialValue: buyerValues.nickName,
                    rules: [{ required: true, message: '请输入' }],
                  })(
                    <Input placeholder="请输入买手名" />,
                  )}
                </FormItem>
              </Col>
              <Col span={11}>
                <FormItem
                  label="所属仓库"
                  {...formItemLayout}
                >
                  {getFieldDecorator('warehouseId', {
                    initialValue: buyerValues.warehouseId && buyerValues.warehouseId.toString(),
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择仓库" allowClear>
                      {wareList.map(el => <Option key={el.id} value={el.id && el.id.toString()}>{el.name}</Option>)}
                    </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <FormItem
                  label="佣金设置"
                  {...formItemLayout}
                >
                  {getFieldDecorator('purchaseCommissionStr', {
                    initialValue: buyerValues.purchaseCommissionStr,
                    rules: [{ required: true, message: '请输入' }],
                  })(
                    <Input placeholder="请输入佣金比率" />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    buyerList,
    buyerValues,
    wareList,
  } = state.agency;
  return {
    buyerValues,
    buyerList,
    wareList,
  };
}

export default connect(mapStateToProps)(Form.create()(BuyerList));

