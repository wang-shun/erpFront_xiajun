import React, { Component } from 'react';
import { connect } from 'dva';
import { Cascader, Table, Input, Button, Row, Col, Select, DatePicker, Form, TreeSelect, Modal, Popover, Icon, Popconfirm, Checkbox } from 'antd';
import ProductsModal from './ProductsModal';
import ProductsUpload2 from './ProductsUpload2';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@window.regStateCache
class Products extends Component {

  constructor() {
    super();
    this.state = {
      checkId: [],
      uploadVisble: false,
      titles: '',
    };
  }

  handleSubmit(e, page, pageSize) {
    if (e) e.preventDefault();
    const { currentPageSize } = this.props;
    // 清除多选
    this.setState({ checkId: [] }, () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (err) return;
        if (values.saleDate && values.saleDate[0] && values.saleDate[1]) {
          values.startTime = new Date(values.saleDate[0]).format('yyyy-MM-dd');
          values.endTime = new Date(values.saleDate[1]).format('yyyy-MM-dd');
        }
        if (values.categoryCode) {
          values.categoryCode = values.categoryCode[values.categoryCode.length - 1]
        }
        delete values.saleDate;
        this.props.dispatch({
          type: 'products/queryItemList',
          payload: {
            ...values,
            pageIndex: typeof page === 'number' ? page : 1,
            pageSize: pageSize || currentPageSize,
          },
        });
      });
    });
  }

  updateModal(id) {
    const p = this;
    console.log(id);
    this.setState({ modalVisible: true }, () => {
      p.props.dispatch({ type: 'products/queryProduct', payload: { id } });
    });
  }

  //单品下架
  putoffItem(id) {
    const p = this;
    let type = 'products/batchDelistingYouzan';
    let checkId = [];
    checkId.push(id);

        p.props.dispatch({
          type,
          payload: { itemIds: JSON.stringify(checkId) },
          cb() { p._refreshData(); },
        });
  }

  //单品上架
  putonItem(id) {
    const p = this;
    let type = 'products/batchListingYouzan';
    let checkId = [];
    checkId.push(id);

        p.props.dispatch({
          type,
          payload: { itemIds: JSON.stringify(checkId) },
          cb() { p._refreshData(); },
        });
  }

  showModal() {
    const p = this;
    this.setState({ modalVisible: true }, () => {
      this.props.dispatch({ type: 'products/queryAllBrand', payload: {} });
    });
  }
  showMore() {
    console.log('thisthis')
    this.setState({
      uploadVisble: true,
      titles: '导入商品',
    })
  }
  closeMore() {
    this.setState({ uploadVisble: false })
  }
  cleanVirtualInvModal(id) {
    const p = this;
    p.props.dispatch({
      type: 'products/updateVirtualInvByItemId',
      payload: { id },
      cb() { p._refreshData(); },
    });
  }
  createDimensionPic(itemId) {
    const p = this;
    p.props.dispatch({
      type: 'products/getDimensionCodeUtil',
      payload: { itemId },
      cb() { p._refreshData(); },
    });
  }
  closeModal() {
    const { dispatch } = this.props;
    this.setState({ modalVisible: false }, () => {
      dispatch({
        type: 'products/saveProductsValue',
        payload: {},
      });
      this._refreshData();
    });
  }

  batchAction(batchType) {
    const p = this;
    const { checkId } = this.state;
    let action = '';
    let type = '';
    /**********xiajun 当用户没有勾选任何商品就进行操作时，进行提示******************/
    if (0 == checkId.length) {
      Modal.confirm({
        title: '提示',
        content: `请勾选商品`,
        onOk() {
        },
      });
      return;
    }
    switch (batchType) {
      case 'syn': action = '同步'; type = 'products/batchSynItemYouzan'; break;
      case 'onSell': action = '上架'; type = 'products/batchListingYouzan'; break;
      case 'offSell': action = '下架'; type = 'products/batchDelistingYouzan'; break;
      default: action = '';
    }
    Modal.confirm({
      title: '确定',
      // content: `确定要${action}id为${JSON.stringify(checkId)}的产品吗？`,
      content: `确定要${action}该产品吗？`,
      onOk() {
        p.props.dispatch({
          type,
          payload: { itemIds: JSON.stringify(checkId) },
          cb() { p._refreshData(); },
        });
      },
    });
  }

  interator(arr, value, data = []) {
    const p = this;
    arr.forEach((el) => {
      if (el.id.toString() === value) data.push(el);
      else if (el.children.length) p.interator(el.children, value, data);
    });
    return data;
  }

  chooseCate(rules, value, cb) {
    const { tree } = this.props;
    const data = this.interator(tree, value);
    if (data && data[0] && data[0].level !== 3) cb('只能选择最后一级类目');
    else cb();
  }

  handleEmptyInput(type) { // 清空内容
    const { setFieldsValue } = this.props.form;
    switch (type) {
      case 'name': setFieldsValue({ name: undefined }); break;
      case 'itemCode': setFieldsValue({ itemCode: undefined }); break;
      case 'buySite': setFieldsValue({ buySite: undefined }); break;
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
    const { form, currentPage, currentPageSize, productsList = [], productsTotal, allBrands = [], productsValues = {}, tree = [], loginRoler, allBuyers = [], countries = [] } = this.props;
    console.log(productsList)
    const { getFieldDecorator, resetFields } = form;
    const { uploadVisble, titles } = this.state
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const yzBasicUrl = 'https://h5.youzan.com/v2/goods/';
    const columns = [
      {
        title: '商品图片',
        dataIndex: 'mainPic',
        key: 'mainPic',
        width: 60,
        render(text) {
          if (!text) return '-';
          const picList = JSON.parse(text).picList;
          const t = (picList.length && picList[0]) ? picList[0].url : '';
          return (
            t ? <Popover title={null} content={<img role="presentation" src={imgHandlerThumbBig(t)} style={{ width: 400 }} />}>
              <img role="presentation" src={imgHandlerThumb(t)} width={60} height={60} />
            </Popover> : '-'
          );
        },
      },
      {
        title: '二维码图片',
        dataIndex: 'dimensionCodePic',
        key: 'dimensionCodePic',
        width: 40,
        render(text) {
          if (!text) return '-';
          const t = text;
          return (
            t ? <Popover title={null} content={<img role="presentation" src={imgHandlerThumbBig(t)} style={{ width: 400 }} />}>
              <img role="presentation" src={imgHandlerThumb(t)} width={60} height={60} />
            </Popover> : '-'
          );
        },
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width: 200 / 14.32 + '%',
        render(t, r) {
          return r.outerAlias ? <a href={`${yzBasicUrl}${r.outerAlias}`} rel="noopener noreferrer" target="_blank">{t}</a> : <span>{t}</span>;
        },
      },
      {
        title: '价格',
        dataIndex: 'priceRange',
        key: 'priceRange',
        width: 10 + '%',
      },
      { title: '实际库存', dataIndex: 'inventory', key: 'inventory', width: 100 / 14.32 + '%' },
      {
        title: '虚拟库存',
        key: 'virtualInv', 
        width: 100 / 14.32 + '%',
        render(t, r){
          return (
            <div>
              {r.virtualInv}
             {/* {r.virtualInv < 0 ? 0 : r.virtualInv} */}
            </div>
          );
        },

      },
      {
        title: '商品状态',
        dataIndex: 'status',
        key: 'status',
        width: 60 / 14.32 + '%',
        render(t) {
          switch (t) {
            case 0: return <font color="">新建</font>;
            case 1: return <font color="blue">上架</font>;
            case 2: return <font color="red">下架</font>;
            case 3: return <font color="">同步</font>;
            case -1: return <font color="">删除</font>;
            default: return false;
          }
        },
      },
      { title: '销量', dataIndex: 'salesVolume', key: 'salesVolume', width: 100 / 14.32 + '%' },     
      { title: '开始时间', dataIndex: 'startDate', key: 'startDate', width: 80 / 14.32 + '%', render(text) { return text ? text.split(' ')[0] : '-'; } },
      {
        title: '操作',
        key: 'oper',
        width: 90,
        render(text, record) {
          if (record) {
            if (1 != record.status) {//不是上架状态的商品，提供上架操作
              return (<div style={{ whiteSpace: 'nowrap' }}>
              <a href="javascript:void(0)" onClick={p.updateModal.bind(p, record.id)}>编辑</a>
              <br />
              <Popconfirm title="确认上架？" onConfirm={p.putonItem.bind(p, record.id)}>
                <a href="javascript:void(0)"><font color="green">上架</font></a>
              </Popconfirm>
              <br/>
              <Popconfirm title="是否要生成该小程序的二维码？" onConfirm={p.createDimensionPic.bind(p, record.id)}>
                <a href="javascript:void(0)"><font color="green">生成二维码</font></a>
              </Popconfirm>
              <br />
              <Popconfirm title="确定清除虚拟库存吗？" onConfirm={p.cleanVirtualInvModal.bind(p, record.id)}>
                <a href="javascript:void(0)">清除虚拟库存</a>
              </Popconfirm>
              
            </div>);
            }
          }         
            return (<div style={{ whiteSpace: 'nowrap' }}>
              <a href="javascript:void(0)" onClick={p.updateModal.bind(p, record.id)}>编辑</a>
              <br />
              <Popconfirm title="确认下架？" onConfirm={p.putoffItem.bind(p, record.id)}>
                <a href="javascript:void(0)"><font color="green">下架</font></a>
              </Popconfirm>
              <br/>
              <Popconfirm title="是否要生成该小程序的二维码？" onConfirm={p.createDimensionPic.bind(p, record.id)}>
                <a href="javascript:void(0)"><font color="green">生成二维码</font></a>
              </Popconfirm>
              <br />
              <Popconfirm title="确定清除虚拟库存吗？" onConfirm={p.cleanVirtualInvModal.bind(p, record.id)}>
                <a href="javascript:void(0)">清除虚拟库存</a>
              </Popconfirm>
              
            </div>);

        },
      },
    ];

    const paginationProps = {
      total: productsTotal,
      defaultPageSize: 20,
      showSizeChanger: true,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      onShowSizeChange(current, size) {
        p.handleSubmit(null, 1, size);
      },
      current: currentPage,
      onChange(pageIndex) {
        p.handleSubmit(null, pageIndex, currentPageSize);
      },
    };

    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        const listId = [];
        selectedRows.forEach((el) => {
          listId.push(el.id);
        });
        p.setState({ checkId: listId });
      },
      selectedRowKeys: p.state.checkId,
    };

    const isNotSelected = p.state.checkId.length === 0;

    return (
      <div>
        {/* <div className="refresh-btn"><Button type="ghost" size="small" onClick={this._refreshData.bind(this)}>刷新</Button></div> */}
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
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('name', {})(
                  <Input placeholder="请输入商品名称" maxLength="60" suffix={p.showClear('name')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商品类目"
                {...formItemLayout}
              >
                {getFieldDecorator('categoryCode', {
                  rules: [{ validator: this.chooseCate.bind(this) }],
                })(
                  <Cascader allowClear options={tree} placeholder="请选择所属类目" expandTrigger="hover"/>
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span={14}>
              <FormItem
                label="销售时间范围"
                {...formItemLayout}
                labelCol={{ span: 6 }}
              >
                {getFieldDecorator('saleDate')(<RangePicker />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="商品状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {
                  initialValue:1
                })(
                  <Select
                    allowClear
                    placeholder="请选择状态"
                    showSearch
                  >               
                    <Option value={1}>上架</Option>
                    <Option value={-1}>全部</Option>
                    <Option value={2}>下架</Option>
                    <Option value={0}>新建</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            
          </Row>
          <Row style={{ marginLeft: 13 }}>
            <Col className="listBtnGroup">
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={() => resetFields()}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row className="operBtn" >
          <Col>
            <Button type="primary" style={{ float: 'left' }} size="large" onClick={() => { this.showModal(); }}>商品发布</Button>
            <Button style={{ float: 'left', marginLeft: '20px' }} type="primary" size="large" onClick={p.showMore.bind(p)}>批量导入商品</Button>
            <Button type="primary" style={{ float: 'left', marginLeft: '20px' }} size="large" onClick={p.batchAction.bind(p, 'syn')}>批量同步</Button>
            <Button type="primary" style={{ float: 'left', marginLeft: '20px' }} size="large" onClick={p.batchAction.bind(p, 'onSell')}>批量上架</Button>
            <Button type="primary" style={{ float: 'left', marginLeft: '20px' }} size="large" onClick={p.batchAction.bind(p, 'offSell')}>批量下架</Button>
          </Col>
        </Row>
        <Row>
          <Col className="table-wrapper">
            <Table
              columns={columns}
              dataSource={productsList}
              bordered
              size="large"
              rowKey={record => record.id}
              pagination={paginationProps}
              rowSelection={rowSelection}
            />
          </Col>
          <Col className="table-placeholder" />
        </Row>
        <ProductsModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={productsValues}
          allBrands={allBrands}
          allBuyers={allBuyers}
          tree={tree}
          loginRoler={loginRoler}
          countries={countries}
        />
        {uploadVisble && <ProductsUpload2
          visible={uploadVisble}
          title={titles}
          close={this.closeMore.bind(this)}
        />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { productsList, productsTotal, productsValues, allBrands, tree, currentPage, currentPageSize, loginRoler, allBuyers, countries } = state.products;
  return {
    productsList,
    productsTotal,
    productsValues,
    currentPage,
    currentPageSize,
    allBrands,
    tree,
    loginRoler,
    allBuyers,
    countries,
  };
}

export default connect(mapStateToProps)(Form.create()(Products));
