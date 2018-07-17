import React, { Component } from 'react';
import { Form, Input, InputNumber, Select, Popover, Modal, Row, Col, Button, Table, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import { compose } from '../../../../node_modules/redux';

const FormItem = Form.Item;
const { Option } = Select;

let latestSearch = {};
let isAdditional = false; // 是否追加
let isOperating = false; // 是否正在添加

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
  componentWillReceiveProps(...args) {
      // if (args[0].data && args[0].data.length > 0 && this.state.outDetailList.length === 0) {
      //   this.setState({
      //     outDetailList: args[0].data.map((el, index) => {
      //       el.key = index + 1;
      //       return el;
      //     }),
      //   });
      // }
  }
  handleSave(type) {
    const p = this;
    const { form, wareList, data = {} } = this.props;
    const skuList = [];
    form.validateFieldsAndScroll((err, fieldsSku) => {
      // console.log(fieldsSku)
      if (err) { return; }
      let count = 1;
      let warehouseNo;
      let warehouseName;
      const { desc } = fieldsSku;
      const keys = Object.keys(fieldsSku);
      wareList.forEach((el) => {
        if (el.name === fieldsSku.warehouseName.label) {
          warehouseNo = el.warehouseNo;
          warehouseName = el.name;
        }
      });
      for (let i = 1; i < keys.length; i += 1) {
        if (`r_${count}_skuCode` in fieldsSku) {
          const skuSingle = {};
          keys.forEach((key) => {
            if (key.match(`r_${count}_`)) {
              skuSingle[key.split(`r_${count}_`)[1]] = fieldsSku[key];
            }
          });
          if (!skuSingle.id) delete skuSingle.id;
          if (skuSingle.skuPic) delete skuSingle.skuPic;
          if (skuSingle.skuCode) delete skuSingle.skuCode;
          // console.log(skuSingle)
          skuList.push(skuSingle);
          count += 1;
        } else count += 1;
      }
      if (skuList.length < 1) {
        message.error('请至少填写一项出库信息');
        return;
      }
      const outObj = { inventoryOutDetailList: JSON.stringify(skuList), warehouseNo, warehouseName, desc };
      // console.log(outObj)
      switch (type) {
        case 'save':
          if (data.id) {
            p.props.dispatch({
              type: 'inventory/updateOut',
              payload: { ...outObj, id: data.id },
              cb() { p.handleCancel(); },
            });
          } else {
            p.props.dispatch({
              type: 'inventory/addOut',
              payload: { ...outObj },
              cb() { p.handleCancel(); },
            });
          }
          break;
        case 'confirm':
          p.props.dispatch({
            type: 'inventory/confirmOut',
            payload: { ...outObj, id: data.id },
            cb() { p.handleCancel(); },
          });
          break;
        default: return false;
      }
    });
  }
  addEmptyLine(num) {
    const { form } = this.props;
    let { outDetailList, specialSelect } = this.state;
    // console.log(specialSelect)
    if (!outDetailList) outDetailList = [];
    const skuLen = outDetailList ? outDetailList.length : 0;
    const lastId = skuLen < 1 ? 0 : outDetailList[outDetailList.length - 1].key;
    const looptime = typeof num === 'number' ? num : 1;
    this.props.dispatch({
      type: 'inventory/queryList',
      payload: { warehouseName: specialSelect },
    });
    let currentId = parseInt(lastId, 10);
    for (let i = 0; i < looptime; i += 1) {
      currentId += 1;
      const newId = currentId;
      const newItem = {
        id: '',
        inventoryOnWarehouseNo: '',
        key: newId,
        skuCode: '',
        skuId: '',
        itemName: '',
        color: '',
        scale: '',
        warehouseName: '',
        upc: '',
        shelfNo: '',
      };
      outDetailList.push(newItem);
    }
    form.validateFieldsAndScroll([`warehouseName`], (err, values) => {
      if (err) return;
      console.log(values)
      this.setState({ outDetailList }, () => {
        if (typeof num !== 'boolean') {
          setTimeout(() => {
            this[`r_${currentId}_skuCode`].focus();
            this[`r_${currentId}_skuCode`].refs.input.click();
          }, 0);
        }
      });
    })

  }
  batchAddProduct(props) {
    let { outDetailList } = this.state;
    // console.log(outDetailList)
    if (!outDetailList) outDetailList = [];
    const skuLen = outDetailList ? outDetailList.length : 0;
    const lastId = skuLen < 1 ? 0 : outDetailList[outDetailList.length - 1].key;
    const looptime = props.length;

    const batchUpdateFormValues = {};

    let currentId = parseInt(lastId, 10);

    // 本次是否有新增
    let isAddedItem = false;

    // 当前先选择一把
    // 检验重复
    let isDuplicatedFirst = false;
    for (let j = 0; j < outDetailList.length; j += 1) {
      if (outDetailList[j].skuCode.toString() === props[0].skuCode.toString()) {
        isDuplicatedFirst = true;
        break;
      }
    }
    if (!isDuplicatedFirst) {
      // 不重复则先新增第一个
      if (isAdditional) {
        this.addEmptyLine(true);
        currentId += 1;
        props.forEach((prop) => {
          prop.key += 1;
        });
        props[0].key = outDetailList[outDetailList.length - 1].key;
      }

      isAddedItem = true;
      this.props.list.forEach((value) => {
        if (value.id && value.id.toString() === props[0].id.toString()) {
          outDetailList.forEach((el) => {
            if (el.key.toString() === props[0].key.toString()) {
              el.inventoryOnWarehouseNo = value.inventoryOnWarehouseNo;
              el.skuCode = value.skuCode;
              el.skuPic = value.skuPic;
              el.itemName = value.itemName;
              el.warehouseName = value.warehouseName;
              el.shelfNo = value.shelfNo;
              el.upc = value.upc;
            }
          });
          batchUpdateFormValues[`r_${props[0].key}_inventoryOnWarehouseNo`] = value.inventoryOnWarehouseNo;
          batchUpdateFormValues[`r_${props[0].key}_skuCode`] = value.skuCode;
        }
      });
    }

    // 再进行追加
    for (let i = 1; i < looptime; i += 1) {
      // 检验重复
      let isDuplicated = false;
      for (let j = 0; j < outDetailList.length; j += 1) {
        if (outDetailList[j].skuCode.toString() === props[i].skuCode.toString()) {
          isDuplicated = true;
          break;
        }
      }
      if (!isDuplicated) {
        isAddedItem = true;

        currentId += 1;
        const newId = outDetailList[outDetailList.length - 1].key + 1;
        const newItem = {
          id: '',
          inventoryOnWarehouseNo: '',
          key: newId,
          skuCode: '',
          skuId: '',
          itemName: '',
          color: '',
          scale: '',
          warehouseName: '',
          upc: '',
          shelfNo: '',
        };

        this.props.list.forEach((value) => {
          if (value.id && value.id.toString() === props[i].id.toString()) {
            newItem.inventoryOnWarehouseNo = value.inventoryOnWarehouseNo;
            newItem.skuCode = value.skuCode;
            newItem.skuPic = value.skuPic;
            newItem.itemName = value.itemName;
            newItem.warehouseName = value.warehouseName;
            newItem.shelfNo = value.shelfNo;
            newItem.upc = value.upc;

            batchUpdateFormValues[`r_${newId}_inventoryOnWarehouseNo`] = value.inventoryOnWarehouseNo;
            batchUpdateFormValues[`r_${newId}_skuCode`] = value.skuCode;
          }
        });

        outDetailList.push(newItem);
      }
    }

    this.setState({ outDetailList }, () => {
      this.props.form.setFieldsValue(batchUpdateFormValues);
      setTimeout(() => {
        // this[`r_${key}_skuCode`].refs.input.click();
        setTimeout(() => {
          // this.clearSelectedSku();
          this.setState({ checkId: [] }, () => { isOperating = false; });
          if (isAddedItem) isAdditional = true;
        }, 300);
      }, 0);
    });
  }
  doSearch() {
    const { specialSelect } = this.state;
    // console.log(specialSelect)
    latestSearch = {
      warehouseName: specialSelect,
      shelfNo: this.shelfNo && this.shelfNo.refs.input.value,
      skuCode: this.skuCode && this.skuCode.refs.input.value,
      upc: this.upc && this.upc.refs.input.value,
    };
    // console.log(latestSearch)
    this.props.dispatch({
      type: 'inventory/queryList',
      payload: {
        ...latestSearch,
        pageIndex: 1,
      },
    });
  }
  handleDeleteDetail(key) {
    const newData = this.state.outDetailList.filter(el => el.key !== key);
    // newData.forEach((el) => {
    //   if (el.key > key) { el.key -= 1; }
    // });
    this.setState({ outDetailList: newData });
  }
  handleBatchAdd(key) { // 批量添加
    if (!isOperating) {
      isOperating = false;
      const { checkId } = this.state;
      const batchSelectParams = [];
      setTimeout(() => {
        let j = -1;
        for (let i = 0; i < checkId.length; i += 1) {
          j += 1;
          batchSelectParams.push({ key: key + j, skuCode: checkId[i].skuCode, id: checkId[i].id });
        }
        if (batchSelectParams.length > 0) this.batchAddProduct(batchSelectParams, key);
        else isOperating = false;
      }, 0);
    }
  }
  handleShowPop(value) {
    // console.log(value)
    if (value) {
      this.setState({ warehouseIdChecked: value });
    }
  }
  handleCancel() {
    const { form, close } = this.props;
    setTimeout(() => {
      this.setState({ outDetailList: undefined }, () => {
        form.resetFields();
      });
    }, 300);
    close();
  }
  clearSelected(visible) {
    if (!visible) {
      this.setState({ checkId: [] });
      isAdditional = false;
      isOperating = false;
    }
  }
  handleSelect(value, p) {
    const { outDetailList } = this.state;
    // console.log(value)
    this.setState({
      specialSelect: value.label,
      warehouseNoSpe: value.key,
    })

  }
  render() {
    const p = this;
    const { visible, wareList = [], form, data = {}, list = [], total, dataValue = {} } = this.props;
    // console.log(dataValue)
    // console.log(data)
    const { getFieldDecorator } = form;
    const { outDetailList, specialSelect } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };
    const footerContent = (
      <div>
        <Button type="ghost" size="large" onClick={p.handleCancel.bind(p)}>取消</Button>
        <Button type="primary" size="large" onClick={p.handleSave.bind(p, 'confirm')}>确认出库</Button>
        {/* <Button type="primary" size="large" onClick={p.handleSave.bind(p, 'save')}>保存出库单</Button> */}
      </div>
    );
    const columns = [
      { title: 'SKU代码', key: 'skuCode', dataIndex: 'skuCode', width: 100 },
      { title: '商品名称', key: 'itemName', dataIndex: 'itemName', width: 160 },
      {
        title: '商品图片',
        key: 'skuPic',
        dataIndex: 'skuPic',
        width: 90,
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
      { title: '仓库名称', key: 'warehouseName', dataIndex: 'warehouseName', width: 100 },
      { title: '货架号', key: 'shelfNo', dataIndex: 'shelfNo', width: 60 },
      { title: 'UPC', key: 'upc', dataIndex: 'upc', width: 100 },
      { title: '规格1', key: 'color', dataIndex: 'color', width: 80 },
      { title: '规格2', key: 'scale', dataIndex: 'scale', width: 80 },
      { title: '可售库存', key: 'totalAvailableInv', dataIndex: 'totalAvailableInv', width: 80 },
      { title: '现货库存', key: 'inventory', dataIndex: 'inventory', width: 80 },
      { title: '现货占用', key: 'lockedInv', dataIndex: 'lockedInv', width: 80 },
      { title: '在途库存', key: 'transInv', dataIndex: 'transInv', width: 80 },
      { title: '在途占用', key: 'lockedTransInv', dataIndex: 'lockedTransInv', width: 80 },
    ];
    const paginationProps = {
      total,
      pageSize: 20,
      onChange(pageIndex) {
        p.props.dispatch({
          type: 'inventory/queryList',
          payload: {
            pageIndex,
            ...latestSearch,
          },
        });
      },
    };
    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        p.setState({ checkId: selectedRows });
      },
      selectedRowKeys: p.state.checkId.map(out => out.id),
    };
    function renderInventoryContent(key) {
      return (
        <div id="popoverContainer">
          <Row>
            <Col span="5">
              <FormItem
                label="仓库名称"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 14 }}
              >
                {getFieldDecorator('name', {
                  initialValue: specialSelect,
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    onChange={p.handleShowPop.bind(p)}
                    getPopupContainer={() => document.getElementById('popoverContainer')}
                    disabled={true}
                  >
                    {wareList.map(el => <Option key={el.id && el.id.toString()}>{el.name}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem
                label="货架号"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
              >
                <Input
                  size="default"
                  placeholder="请输入货架号"
                  ref={(c) => { p.shelfNo = c; }}
                />
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem
                label="UPC"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
              >
                <Input
                  size="default"
                  placeholder="请输入UPC"
                  ref={(c) => { p.upc = c; }}
                />
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem
                label="SKU代码"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 15 }}
              >
                <Input
                  size="default"
                  placeholder="请输入SKU代码"
                  ref={(c) => { p.skuCode = c; }}
                />
              </FormItem>
            </Col>
            <Col className="listBtnGroup" span="3" style={{ marginTop: 2 }}>
              <Button type="primary" onClick={p.doSearch.bind(p)}>查询</Button>
            </Col>
          </Row>
          <Row>
            <Button
              type="primary"
              onClick={p.handleBatchAdd.bind(p, key)}
              style={{ position: 'absolute', bottom: 10, left: 0 }}
              disabled={p.state.checkId.length === 0}
            >批量添加</Button>
            <Table
              columns={columns}
              dataSource={list}
              rowSelection={rowSelection}
              size="small"
              bordered
              rowKey={record => record.id}
              pagination={paginationProps}
              scroll={{ x: 1300, y: 400 }}
            />
          </Row>
        </div>
      );
    }
    const modalTableProps = {
      columns: [
        {
          title: '商品SKU',
          dataIndex: 'skuCode',
          key: 'skuCode',
          width: 150,
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_skuCode`, {
                  initialValue: t || undefined,
                  rules: [{ required: true, message: '该项必填' }],
                })(
                  <Popover
                    overlayStyle={{ width: 900 }}
                    content={renderInventoryContent(r.key)}
                    title="搜索SKU"
                    trigger="click"
                    onVisibleChange={p.clearSelected.bind(p)}
                  >
                    <Input placeholder="请搜索" ref={(c) => { p[`r_${r.key}_skuCode`] = c; }} value={t || undefined} />
                  </Popover>,
                )}
              </FormItem>
            );
          },
        },
        {
          title: '出库数量',
          dataIndex: 'quantity',
          key: 'quantity',
          width: 100,
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_quantity`, {
                  initialValue: t,
                  rules: [{ required: true, message: '请输入' }],
                })(
                  <InputNumber placeholder="请输入" />,
                )}
                {getFieldDecorator(`r_${r.key}_inventoryOnWarehouseNo`, {
                  initialValue: r.inventoryOnWarehouseNo,
                })(
                  <Input placeholder="请搜索" ref={(c) => { p[`r_${r.key}_inventoryOnWarehouseNo`] = c; }} style={{ display: 'none' }} />,
                )}
              </FormItem>
            );
          },
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
        {
          title: '操作',
          key: 'oper',
          render(t, r) {
            return (
              <Popconfirm onConfirm={p.handleDeleteDetail.bind(p, r.key)} title="确定删除？">
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            );
          },
        },
      ],
      dataSource: outDetailList,
      bordered: true,
      pagination: false,
    };
    return (
      <Modal
        visible={visible}
        title="出库明细"
        width={800}
        onCancel={this.handleCancel.bind(this)}
        footer={footerContent}
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
                  <Select labelInValue placeholder="请选择" onChange={this.handleSelect.bind(this)} >
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
                  <Input placeholder="请输入" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ paddingBottom: 10 }}>
            <Col style={{ float: 'left', marginTop: 6 }}>
              <font size="3">出库单明细</font>
            </Col>
            <Col style={{ float: 'right' }}>
              <Button type="primary" onClick={p.addEmptyLine.bind(p)}>添加出库明细</Button>
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
