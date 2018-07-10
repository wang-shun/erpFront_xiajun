import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form, Input, InputNumber, Popconfirm, Popover, Select, TreeSelect, Modal, Icon } from 'antd';
import SkuModal from './SkuModal';

const FormItem = Form.Item;
const Option = Select.Option;

@window.regStateCache
class Sku extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      lockedNumGroup: {},
      lockedPopoverVisible: {},
    };
  }

  handleSubmit(e, page, pageSize) {
    if (e) e.preventDefault();
    const { skuPageSize } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.dispatch({
        type: 'sku/querySkuList',
        payload: { ...fieldsValue, pageIndex: typeof page === 'number' ? page : 1, pageSize: pageSize || skuPageSize },
      });
    });
  }

  handleEmpty() {
    const { resetFields } = this.props.form;
    resetFields();
  }

  handleDelete(id) {
    const p = this;
    this.props.dispatch({
      type: 'sku/deleteSku',
      payload: { id },
      cb() { p._refreshData(); },
    });
  }

  updateModal(skuCode) {
    this.setState({
      modalVisible: true,
    }, () => {
      this.props.dispatch({
        type: 'sku/querySku',
        payload: { skuCode:skuCode },
      });
    });
  }

  showModal() {
    this.setState({
      modalVisible: true,
    });
  }

  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    }, () => {
      this.props.dispatch({
        type: 'sku/saveSku',
        payload: {},
      });
      // 记忆状态的刷新
      this._refreshData();
    });
  }

  toggleLockedPopoverVisible(record) {
    const { lockedPopoverVisible } = this.state;
    lockedPopoverVisible[record.id] = !lockedPopoverVisible[record.id];
    this.setState({ lockedPopoverVisible });
  }

  updateLockedSku(record) {
    const p = this;
    const { lockedNumGroup } = this.state;
    const num = lockedNumGroup[record.id];
    if (!num) {
      Modal.warning({ title: '请输入锁定库存数量' });
      return;
    }
    this.toggleLockedPopoverVisible(record);
    lockedNumGroup[record.id] = undefined;
    this.setState({ lockedNumGroup }, () => {
      this.props.dispatch({
        type: 'sku/lockVirtualInv',
        payload: {
          lockedVirtualInv: num,
          itemCode: record.itemCode,
          id: record.id,
        },
        cb() { p._refreshData(); },
      });
    });
  }

  handleEmptyInput(type) { // 清空内容
    const { setFieldsValue } = this.props.form;
    switch (type) {
      case 'itemCode': setFieldsValue({ itemCode: undefined }); break;
      case 'skuCode': setFieldsValue({ skuCode: undefined }); break;
      case 'itemName': setFieldsValue({ itemName: undefined }); break;
      case 'upc': setFieldsValue({ upc: undefined }); break;
      default: return false;
    }
  }

  showClear(type) { // 是否显示清除按钮
    const { getFieldValue } = this.props.form;
    const data = getFieldValue(type);
    if (data) {
      return <Icon type="close-circle" onClick={this.handleEmptyInput.bind(this, type)} />;
    }
    return null;
  }

  render() {
    const p = this;
    const { skuList = {}, skuTotal, currentPageSkuIndex, skuData, brandList = [], productsList = [], form, tree = [], packageScales } = this.props;
    console.log(skuList)
    const { lockedPopoverVisible } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      { title: 'SKU代码', dataIndex: 'skuCode', key: 'skuCode', width: 100 / 11.48 + '%' },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 150 / 11.48 + '%' },
      { title: '商品代码', dataIndex: 'itemCode', key: 'itemCode', width: 100 / 11.48 + '%' },
      { title: 'UPC码',
        dataIndex: 'upc',
        key: 'upc',
        width: 60 / 11.48 + '%',
        render(text) {
          return text || '-';
        },
      },
      {
        title: 'sku图片',
        dataIndex: 'skuPic',
        key: 'skuPic',
        width: 78,
        render(text, r) {
          if (!text) return '-';
          const picList = JSON.parse(text).picList;
          const t = picList.length ? picList[0] ? picList[0].url : '' : '';
          return (
            t ? <Popover title={null} content={<img role="presentation" src={imgHandlerThumbBig(t)} style={{ width: 400 }} />}>
              <img role="presentation" src={imgHandlerThumb(t)} width={60} height={60} />
            </Popover> : '-'
          );
        },
      },
      { title: '所属分类', dataIndex: 'categoryName', key: 'categoryName', width: 80 / 11.48 + '%', render(text) { return text || '-'; } },
      { title: '规格1', dataIndex: 'color', key: 'color', width: 60 / 11.48 + '%', render(text) { return text || '-'; } },
      { title: '规格2', dataIndex: 'scale', key: 'scale', width: 60 / 11.48 + '%', render(text) { return text || '-'; } }, 
      { title: '销售价(元)', dataIndex: 'salePrice', key: 'salePrice', width: 70 / 11.48 + '%', render(text) { return text || '-'; } },
      { title: '库存',
        key: 'inve',
        width: 120 / 11.48 + '%',
        render(t, r) {
          return (
            <div>
              可售库存：{r.totalAvailableInv}<br />
              虚拟库存：{r.virtualInv < 0 ? 0 : r.virtualInv}<br />
              {/* 虚拟预扣：{r.lockedVirtualInv}<br />  */}
              现货库存：{r.inventory}<br />
              现货占用：{r.lockedInv}<br />
              {/* 在途库存：{r.transInv}<br /> */}
              {/* 在途占用：{r.lockedTransInv} */}
            </div>
          );
        },
      },
      { title: '重量(克)', dataIndex: 'weight', key: 'weight', width: 50 / 11.48 + '%', render(text) { return text || '-'; } },
      { title: '运费', dataIndex: 'freightStr', key: 'freightStr', width: 60 / 11.48 + '%', render(text) { return text || '-'; } },
      { title: '修改时间', dataIndex: 'gmtModify', key: 'gmtModify', width: 100 / 11.48 + '%', render(text) { return text || '-'; } },
      { title: '操作',
        dataIndex: 'oper',
        key: 'oper',
        width: 60,
        // fixed: 'right',
        render(text, record) {
          return (
            <div>
              <div><a href="javascript:void(0)" onClick={p.updateModal.bind(p, record.skuCode)}>修改</a></div>
              <Popconfirm title="确定删除此类目？" onConfirm={p.handleDelete.bind(p, record.id)}>
                <div><a href="javascript:void(0)" >删除</a></div>
              </Popconfirm>
              <Popover
                content={<div>
                  <div>商品名称：{record.itemName}</div>
                  <div style={{ paddingTop: 6 }}>锁定数量：<InputNumber placeholder="请输入" step={1} value={p.state.lockedNumGroup[record.id] || undefined} onChange={(v) => { p.state.lockedNumGroup[record.id] = v; p.setState({ lockedNumGroup: p.state.lockedNumGroup }); }} /></div>
                  <Button size="small" type="primary" style={{ marginTop: 6 }} onClick={p.updateLockedSku.bind(p, record)}>保存</Button>
                </div>}
                title="锁定库存"
                trigger="click"
                visible={lockedPopoverVisible[record.id] || false}
                onVisibleChange={p.toggleLockedPopoverVisible.bind(p, record)}
              >
                <div><a href="javascript:void(0)">锁定</a></div>
              </Popover>
            </div>);
        },
      },
    ];

    const paginationProps = {
      total: skuTotal,
      defaultPageSize: 20,
      showSizeChanger: true,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      onShowSizeChange(current, size) {
        p.handleSubmit(null, 1, size);
      },
      current: currentPageSkuIndex,
      onChange(pageIndex) {
        p.handleSubmit(null, pageIndex);
      },
    };

    return (
      <div>
        <div className="refresh-btn"><Button type="ghost" size="small" onClick={this._refreshData.bind(this)}>刷新</Button></div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="商品代码"
                {...formItemLayout}
              >
                {getFieldDecorator('itemCode', {})(
                  <Input placeholder="请输入商品代码" suffix={p.showClear('itemCode')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="SKU代码"
                {...formItemLayout}
              >
                {getFieldDecorator('skuCode', {})(
                  <Input placeholder="请输入SKU代码" suffix={p.showClear('skuCode')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('itemName', {})(
                  <Input placeholder="请输入商品名称" suffix={p.showClear('itemName')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商品类目"
                {...formItemLayout}
              >
                {getFieldDecorator('categoryCode', {})(
                  <TreeSelect placeholder="请选择类目" treeDefaultExpandAll treeData={tree} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="品牌"
                {...formItemLayout}
              >
                {getFieldDecorator('brand', {})(
                  <Select placeholder="请选择品牌" mode="combobox">
                    {brandList && brandList.map(item => <Option key={item.name} value={item.name}>{item.name}</Option>)}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="UPC"
                {...formItemLayout}
              >
                {getFieldDecorator('upc', {})(
                  <Input placeholder="请输入UPC" suffix={p.showClear('upc')} />)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginLeft: 13 }}>
            <Col className="listBtnGroup">
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={this.handleEmpty.bind(this)}>清空</Button>
            </Col>
          </Row>
        </Form>
        <div style={{ height: 20 }} />
        <Row>
          <Col>
            <Table
              columns={columns}
              dataSource={skuList}
              bordered
              rowKey={record => record.id}
              pagination={paginationProps}
            />

              {/* scroll={{ y: 540, x: 1000 }} */}
          </Col>
        </Row>
        <SkuModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={skuData}
          brandList={brandList}
          productsList={productsList}
          packageScales={packageScales}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { skuList, skuTotal, skuPageSize, currentPageSkuIndex, skuData, packageScales } = state.sku;
  const { brandList, productsList, tree } = state.products;
  return {
    skuList,
    skuTotal,
    skuPageSize,
    currentPageSkuIndex,
    skuData,
    packageScales,
    brandList,
    productsList,
    tree,
  };
}

export default connect(mapStateToProps)(Form.create()(Sku));
