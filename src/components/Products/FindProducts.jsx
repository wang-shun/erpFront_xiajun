import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form, Modal, Popover, Icon, Popconfirm } from 'antd';
import ProductsModal from './ProductsModal';

@window.regStateCache
class FindProducts extends Component {

  constructor() {
    super();
    this.state = {
      checkId: [],
    };
  }
  handleSubmit(e, page, pageSize) {
    if (e) e.preventDefault();
    const { currentPageSizeone } = this.props;
    // 清除多选
    this.setState({ checkId: [] }, () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (err) return;
        if (values.saleDate && values.saleDate[0] && values.saleDate[1]) {
          values.startDate = new Date(values.saleDate[0]).format('yyyy-MM-dd');
          values.endDate = new Date(values.saleDate[1]).format('yyyy-MM-dd');
        }
        delete values.saleDate;
        this.props.dispatch({
          type: 'products/queryFindProductList',
          payload: {
            ...values,
            pageIndex: typeof page === 'number' ? page : 1,
            pageSize: pageSize || currentPageSizeone,
          },
        });
      });
    });
  }
  queryFindProduct(id) {
    const p = this;
    p.props.dispatch({
      type: 'products/queryFindProduct',
      payload: { id },
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
    switch (batchType) {
      case 'syn': action = '同步'; type = 'products/batchSynItemYouzan'; break;
      case 'onSell': action = '上架'; type = 'products/batchListingYouzan'; break;
      case 'offSell': action = '下架'; type = 'products/batchDelistingYouzan'; break;
      default: action = '';
    }
    Modal.confirm({
      title: '确定',
      content: `确定要${action}id为${JSON.stringify(checkId)}的产品吗？`,
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
    const { currentPage, findItemList = [], productsTotal, productsValues = {}, tree = [], currentPageSizeone } = this.props;
    const columns = [
      { title: '采购商品名称',
        dataIndex: 'name',
        key: 'name',
        width: 200 / 11.72 + '%',
        render(text) { return text || '-'; } },
      { title: '商品代码', dataIndex: 'itemCode', key: 'itemCode', width: 100 / 11.72 + '%' },
      { title: '商品状态',
        dataIndex: 'purchaseStatus',
        key: 'purchaseStatus',
        width: 80 / 11.72 + '%',
        render(text) {
          switch (text) {
            case 1: return <font color="#00f">审核通过</font>;
            case -1: return <font color="red">已拒绝</font>;
            case 0: return <font color="green">审核中</font>;
            default: return false;
          }
        },
      },
      { title: '商品图片',
        dataIndex: 'mainPic',
        key: 'mainPic',
        width: 80,
        render(text) {
          if (!text) return '-';
          const picList = JSON.parse(text).picList;
          const t = picList.length ? picList[0].url : '';
          return (
            t ? <Popover title={null} content={<img role="presentation" src={imgHandlerThumbBig(t)} style={{ width: 400 }} />}>
              <img role="presentation" src={imgHandlerThumb(t)} width={60} height={60} />
            </Popover> : '-'
          );
        },
      },
      { title: '商品品牌', dataIndex: 'brand', key: 'brand', width: 100 / 11.72 + '%', render(text) { return text || '-'; } },
      { title: '销售类型', dataIndex: 'saleType', key: 'saleType', width: 80 / 11.72 + '%', render(text) { return <span>{text === 0 ? '代购' : '现货' }</span>; } },
      { title: '商品类目',
        width: 100 / 11.72 + '%',
        dataIndex: 'categoryCode',
        key: 'categoryCode',
        render(t) {
          const cate = p.interator(tree, t && t.toString()) || [];
          return <span>{cate[0] ? cate[0].name : '-'}</span>;
        },
      },
      { title: '采购地点', dataIndex: 'buySite', key: 'buySite', width: 80 / 11.72 + '%', render(text) { return text || '-'; } },
      { title: '是否可售',
        dataIndex: 'isSale',
        key: 'isSale',
        width: 80 / 11.72 + '%',
        render(text) {
          switch (text) {
            case 1: return '可售';
            default: return '不可销售';
          }
        },
      },
      { title: '开始销售时间', dataIndex: 'startDate', key: 'startDate', width: 80 / 11.72 + '%', render(text) { return text ? text.split(' ')[0] : '-'; } },
      { title: '结束销售时间', dataIndex: 'endDate', key: 'endDate', width: 80 / 11.72 + '%', render(text) { return text ? text.split(' ')[0] : '-'; } },
      { title: '操作',
        key: 'oper',
        width: 50,
        render(text, record) {
          if (record.purchaseStatus === 0 || record.purchaseStatus === -1) {
            return (
              <div>
                <Popconfirm title="是否要审核通过？" onConfirm={p.queryFindProduct.bind(p, record.id)}>
                  <a href="javascript:void(0)"><font color="green">审核通过</font></a>
                </Popconfirm>
                <br />
              </div>
            );
          }
          return '-';
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
        p.handleSubmit(null, pageIndex, currentPageSizeone);
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


    return (
      <div>
        <div className="refresh-btn"><Button type="ghost" size="small" onClick={this._refreshData.bind(this)}>刷新</Button></div>

        <Row>
          <Col className="table-wrapper">
            <Table
              columns={columns}
              dataSource={findItemList}
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
          tree={tree}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { findItemList, productsTotal, tree, currentPageone, currentPageSizeone, findItemTotal, productsValues } = state.products;
  return {
    findItemList,
    productsTotal,
    findItemTotal,
    productsValues,
    currentPageone,
    currentPageSizeone,
    tree,
  };
}

export default connect(mapStateToProps)(Form.create()(FindProducts));
