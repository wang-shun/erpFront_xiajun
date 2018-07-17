import React, { Component } from 'react';
import { Form, Input, InputNumber, Select, Popover, Modal, Row, Col, Button, Table, Popconfirm, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;


class OutModal extends Component {
  constructor() {
    super();
    this.state = {
      outDetailList:[],
      checkId: [],
      warehouseIdChecked: undefined,
      specialSelect: '',
      warehouseNoSpe: '',

    };
  }
  handleCancel() {
    const { close } = this.props;
    close();
  }
  handleSelect(value, p) {
    // console.log(value)
    this.setState({
      specialSelect: value.label,
      warehouseNoSpe: value.key,
    })

  }
  render() {
    const p = this;
    const { visible, wareList = [], form, dataValue = {}, Mdata } = this.props;
    console.log(Mdata)
    const { getFieldDecorator } = form;
    const footerContent = (
        <div>
          {/* <Button type="ghost" size="large" onClick={p.handleCancel.bind(p)}>取消</Button> */}
          {/* <Button type="primary" size="large" onClick={p.handleSave.bind(p, 'confirm')}>确认出库</Button> */}
          {/* <Button type="primary" size="large" onClick={p.handleSave.bind(p, 'save')}>保存出库单</Button> */}
        </div>
      );
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };
    const modalTableProps = {
      columns: [
        {
          title: '商品SKU',
          dataIndex: 'skuCode',
          key: 'skuCode',
          width: 150,
        },
        {
          title: '出库数量',
          dataIndex: 'quantity',
          key: 'quantity',
          width: 100,
        },
        { title: '商品名称', key: 'itemName', dataIndex: 'itemName', width: 150 },
        { title: 'UPC', key: 'upc', dataIndex: 'upc', width: 100 },
        /* title: '尺码', key: 'scale', dataIndex: 'scale', width: 80 },
        { title: '规格1', key: 'color', dataIndex: 'color', width: 80 },*/
        { title: '货架号', key: 'shelfNo', dataIndex: 'shelfNo', width: 80 },
        {
          title: '商品图片',
          key: 'skuPic',
          dataIndex: 'skuPic',
          width: 90,
          render(r) {
            if (!r) return '-';
            const picList = JSON.parse(r).picList;
            const t = picList.length ? picList[0].url : '';
            return (
              t ? <Popover title={null} content={<img role="presentation" src={imgHandlerThumbBig(t)} style={{ width: 400 }} />}>
                <img role="presentation" src={imgHandlerThumb(t)} width={60} height={60} />
              </Popover> : '-'
            );
          },
        },
      ],
      dataSource: Mdata,
      bordered: true,
      pagination: false,
    };
    return (
      <Modal
        visible={visible}
        title="出库明细"
        width={800}
        footer={footerContent}
        onCancel={this.handleCancel.bind(this)}
        maskClosable={false}
      >
        <Form>
          <Row>
            <Col span="12">
              <FormItem
                label="仓库名称"
                {...formItemLayout}
              >
                {getFieldDecorator('warehouseName', {
                  initialValue: { key: dataValue.warehouseNo, label: dataValue.warehouseName } || {},
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <Select labelInValue placeholder="请选择" disabled={true} >
                    {wareList.map(el => <Option key={el.warehouseNo} title={el.name}>{el.name}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="备注"
                {...formItemLayout}
              >
                {getFieldDecorator('remark', {
                  initialValue: dataValue.remark,
                })(
                  <Input placeholder="请输入" disabled={true}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ paddingBottom: 10 }}>
            <Col style={{ float: 'left', marginTop: 6 }}>
              <font size="3">出库单明细</font>
            </Col>
          </Row>
          <Table {...modalTableProps} rowKey={r => r.key} />
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps({ inventory }) {
  const { wareList, list, total } = inventory;
  return { wareList, list, total };
}

export default connect(mapStateToProps)(Form.create()(OutModal));
