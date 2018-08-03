import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Tabs, Row, Col, Button, Table, Input, Tooltip, Icon, Modal, Select, Menu, Popover, DatePicker, InputNumber } from 'antd';
import styles from './style.less';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import 'moment/locale/zh-cn';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
@window.regStateCache
class SaleAgent extends Component {

  constructor() {
    super();
    this.state = {
      activeTab: '1',
      selectedRowKeys: [],
      inputDisabled: true,
      visible: false,
      title: '',
      current: '1',
      visibleAccounts: false,
      titleAccounts: '',
      visibleWx: false,
      titles: '',
      shareUserSingle: '',
      shareUserList: [],
      underVisible: false,
      underTitle: '',
      commissionVisible: false,
      commissionTitle: '',
      commission: {},
      agentNames: '',
      userNos: '',
      watchVisible: false,
      watchTitle: '',
      wxName: {},
    };
  }
  changeActiveKey(key) {
    this.setState({
      activeTab: key,
    })
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });

  }
  editAgent(r) {
    this.setState({
      visible: true,
      title: '编辑',
      wxName: r,
    })
  }
  seeAgent(r) {
    let parentAgent = r.userNo;
    this.props.dispatch(routerRedux.push('/marketing/SeeAgent?parentAgent=' + parentAgent));
  }
  goSettlement(r) {
  }
  // editA(e) {
  //   let submitObj = document.getElementById('test' + e);
  //   console.log(submitObj.childNodes[0])
  //   // submitObj.childNodes[0].className = 'ant-input';
  //   submitObj.childNodes[0].style.border = ' 1px solid #eee';
  //   submitObj.childNodes[1].style.visibility = 'hidden';
  //   submitObj.childNodes[2].style.visibility = 'visible';
  // }
  // editConfirm(e, r) {
  //   let submitObj = document.getElementById('test' + e);
  //   // submitObj.childNodes[0].className = 'ant-input ant-input-disabled';
  //   submitObj.childNodes[0].style.border = '0px';
  //   submitObj.childNodes[1].style.visibility = 'visible';
  //   submitObj.childNodes[2].style.visibility = 'hidden';
  //   console.log(submitObj.childNodes[0])

  // }
  // editCancel(e) {
  //   let submitObj = document.getElementById('test' + e);
  //   // submitObj.childNodes[0].className = 'ant-input ant-input-disabled';
  //   submitObj.childNodes[0].style.border = '0px';
  //   submitObj.childNodes[1].style.visibility = 'visible';
  //   submitObj.childNodes[2].style.visibility = 'hidden';
  // }
  submitEdit() {
    const { form } = this.props;
    const { wxName = {} } = this.state;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'order/updateMallSaleAgent',
        payload: {
          userNo: wxName.userNo,
          agentName: fieldsValue.agentName,
          realName: fieldsValue.realName,
          status: fieldsValue.status,
          phone: fieldsValue.phone,
        },
        cb: () => {
          this.props.dispatch({
            type: 'order/queryMallSaleAgents',
            payload: {},
          });
          this.setState({
            visible: false,
          })
        }
      });
    });
  }
  hSubmit() {
    this.submitEdit();
  }
  hCancel() {
    this.setState({
      visible: false,
    })
  }
  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
    if (e.key == '1') {
      this.props.dispatch({
        type: 'order/sumSettlePageList',
        payload: { status: 1 },
      });
    } else if (e.key == '2') {
      this.props.dispatch({
        type: 'order/sumSettlePageList',
        payload: { status: 0 },
      })
    } else if (e.key == '3') {
      this.props.dispatch({
        type: 'order/sumSettlePageList',
        payload: { status: 2 },
      })
    }


  }
  Accounts(r) {
    console.log(r)
    const { shareUserSingle } = this.state;
    this.setState({
      titleAccounts: '提醒框',
      visibleAccounts: true,
      shareUserSingle: r.shareUserId,
    })
  }
  AccountsList() {
    const { selectedRowKeys } = this.state;
    this.setState({
      titleAccounts: '提醒框',
      visibleAccounts: true,
      shareUserList: selectedRowKeys,
    })
  }
  accountsSubmit() {
    const { shareUserSingle, } = this.state;
    if (shareUserSingle) {
      this.props.dispatch({
        type: 'order/doSettleSingle',
        payload: { shareUserId: shareUserSingle },
        cb: () => {
          this.props.dispatch({
            type: 'order/sumSettlePageList',
            payload: {},
          })
          this.setState({
            visibleAccounts: false,
          })
        },
      })
    }

  }
  accountsCancel() {
    this.setState({
      visibleAccounts: false,
    })
  }
  orderDetailCan(r) {
    this.props.dispatch(routerRedux.push('/marketing/detailAgent?userNo=' + r.shareUserId + '&status=' + 1));
  }
  orderDetailWait(r) {
    this.props.dispatch(routerRedux.push('/marketing/detailAgent?userNo=' + r.shareUserId + '&status=' + 0));
  }
  orderDetailBeen(r) {
    this.props.dispatch(routerRedux.push('/marketing/detailAgent?userNo=' + r.shareUserId + '&status=' + 2));
  }
  handleSearch(num, size) {
    const payload = { pageIndex: typeof num === 'number' ? num : 1 };
    if (typeof size === 'number') payload.pageSize = size;
    this.props.dispatch({
      type: 'order/queryMallSaleAgents',
      payload,
    });
  }
  onSearchOne(value) {
    if (value == '') {
      this.props.dispatch({
        type: 'order/queryMallSaleAgents',
        payload: {},
      });
    } else {
      this.props.dispatch({
        type: 'order/queryMallSaleAgents',
        payload: {
          agentName: value,
        },
      });
    }

  }
  onSearchTwo(value) {
    if (value == '') {
      this.props.dispatch({
        type: 'order/sumSettlePageList',
        payload: {},
      });
    } else {
      this.props.dispatch({
        type: 'order/sumSettlePageList',
        payload: {
          agentName: value,
        },
      });
    }
  }
  showWxModal() {
    this.setState({
      visibleWx: true,
      titles: '扫码添加代理'
    })
  }
  wxOk() {
    this.setState({
      visibleWx: false,
    })
  }
  wxCancel() {
    this.setState({
      visibleWx: false,
    })
  }
  commissionUnder(r) {
    const { userNos } = this.state;
    this.setState({
      underVisible: true,
      underTitle: '线下佣金记录',
      agentNames: r.agentName,
      userNos: r.shareUserId,
    })
  }
  underSubmit() {
    const { form } = this.props;
    const { userNos } = this.state;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      // console.log(fieldsValue, userNos)
      this.props.dispatch({
        type: 'order/settlementAdd',
        payload: {
          shareUserId: userNos,
          shareUserName: fieldsValue.shareUserName,
          totalPrice: fieldsValue.totalPrice,
          settlement: fieldsValue.positionNo,
          detailCount: fieldsValue.detailCount,
          remark: fieldsValue.remark,
          settlementTime: fieldsValue.settlementTime && fieldsValue.settlementTime.format('YYYY-MM-DD HH:mm:ss'),
        },
        cb: () => {
          this.setState({
            underVisible: false,
          })
        }
      });
    });
  }
  underSubmitOk() {
    this.underSubmit();
  }
  underCancel() {
    this.setState({
      underVisible: false,
    })
  }
  onBlurMoney(r) {
    const { form } = this.props;
    form.validateFieldsAndScroll([`r_${r.userNo}_commissionValue`], (err, fieldsValue) => {
      if (err) {
        return;
      }
      const comMao = {
        userNo: r.userNo,
        commissionMode: r.commissionMode,
        commissionValue: (parseFloat(fieldsValue["r_" + r.userNo + "_commissionValue"])) / 100.0,
        // commissionValue: fieldsValue["r_" + r.userNo + "_commissionValue"],
      }
      // console.log(comMao)
      this.setState({
        commissionVisible: true,
        commissionTitle: '修改佣金',
        commission: comMao,
      })
    });
  }
  commissionSubmit() {
    const { commission = {} } = this.state;
    console.log('commission' + typeof (commission.commissionValue))
    this.props.dispatch({
      type: 'order/updateCommissionValue',
      payload: {
        userNo: commission.userNo,
        commissionMode: commission.commissionMode,
        commissionValue: commission.commissionValue,
      },
      cb: () => {
        this.setState({
          commissionVisible: false,
        })
        this.props.dispatch({
          type: 'order/queryMallSaleAgents',
          payload: {},
        })

      }
    });
  }
  commissionCancel() {
    this.setState({
      commissionVisible: false,
    })
  }
  watchAccounts(r) {
    this.props.dispatch({
      type: 'order/searchPageList',
      payload: {
        shareUserId: r.shareUserId,
      },
    })
    this.setState({
      watchVisible: true,
      watchTitle: '查看结算记录',
    })
  }
  watchSubmit() {
    this.setState({
      watchVisible: false,
    })
  }
  watchCancel() {
    this.setState({
      watchVisible: false,
    })
  }
  render() {
    const p = this;
    const { form, saleAgentList = [], skuTotal, pageSize, SettlePageList = [], searchPageLists = [] } = this.props;

    const { activeTab, selectedRowKeys, moneyAgent, inputDisabled, visible, title, visibleAccounts, titleAccounts, visibleWx, titles, underVisible, underTitle, commissionVisible, commissionTitle, agentNames, watchVisible, watchTitle, wxName = {} } = this.state;
    console.log(wxName)
    const { getFieldDecorator } = form;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const formItemLayoutT = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const paginationProps = {
      defaultPageSize: 20,
      showSizeChanger: true,
      total: skuTotal,
      pageSizeOptions: ['20', '30', '50', '100'],
      onShowSizeChange(current, size) {
        p.props.dispatch({
          type: 'order/queryMallSaleAgents',
          payload: {
            pageIndex: current,
            pageSize: size,
          },
        });
      },
      onChange(page) {
        p.handleSearch(page, pageSize);
        // console.log(page, pageSize)
      },
    };
    const columnsAgent = [
      {
        title: '',
        dataIndex: 'headProtraitUrl',
        key: 'headProtraitUrl',
        width: '12%',
        render(t) {
          if (!t) return '-';
          return (
            t ? <Popover title={null} content={<img role="presentation" src={imgHandlerThumbBig(t)} style={{ width: 400 }} />}>
              <img role="presentation" src={imgHandlerThumb(t)} width={60} height={60} />
            </Popover> : '-'
          );
        },
      },
      { title: '一级代理', dataIndex: 'agentName', key: 'agentName', width: '12%' },
      {
        title: '二级代理（人数）',
        dataIndex: 'childAgentsNum',
        key: 'childAgentsNum',
        width: '12%',
        render(t, r) {
          return (
            <Tooltip placement="bottom" title={<a onClick={p.seeAgent.bind(p, r)} style={{ color: '#fff' }}>查看二级代理</a>}>
              <span style={{ color: '#4A90E2', fontWeight: 'bolder' }}>{r.childAgentsNum}</span>
            </Tooltip>
          );
        }
      },
      {
        title: '佣金',
        dataIndex: 'commissionValue',
        key: 'commissionValue',
        width: '18%',
        render(t, r, index) {
          return (
            // <div id={"test" + index}>
            //   <Input defaultValue={t} placeholder="请填写佣金" style={{ width: '30%', textAlign: 'center', border: '0px' }} />
            //   <Icon type="edit" style={{ color: '#4A90E2', margin: '0 10px', cursor: 'pointer' }} onClick={p.editA.bind(p, index)} />
            //   <div style={{ color: '#4A90E2', overflow: 'hidden', visibility: 'hidden' }}>
            //     <a href="javascript:void(0)" style={{ color: '#4A90E2' }} onClick={p.editConfirm.bind(p, index, r)}>确认</a> |
            //     <a href="javascript:void(0)" style={{ color: '#4A90E2' }} onClick={p.editCancel.bind(p, index)}>返回</a>
            //   </div>
            // </div>
            <FormItem>
              {getFieldDecorator(`r_${r.userNo}_commissionValue`, { initialValue: (parseInt(t * 10000)/100), rules: [{ required: true, message: '请输入佣金' }], })(
                <InputNumber placeholder="请填写佣金" onBlur={p.onBlurMoney.bind(p, r)} min={0} max={100} style={{ width: 50 }} />
              )}
              <span style={{ marginLeft: 5 }}>%</span>
            </FormItem>
          );
        }
      },
      { title: '手机号', dataIndex: 'phone', key: 'phone', width: '12%' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '12%',
        render(t) {
          switch (t) {
            case 1: return <font color="">正常</font>;
            case 0: return <font color="red">已解除</font>;
            default: return false;
          }
        }
      },
      { title: '加入时间', dataIndex: 'joinTime', key: 'joinTime', width: '12%' },
      {
        title: '操作',
        dataIndex: 'opearter',
        key: 'opearter',
        width: '10%',
        render(t, r) {
          return (
            <div style={{ textAlign: 'center', padding: '10px 0px 10px 0px' }}>
              <a href="javascript:void(0)" style={{ color: '#4A90E2' }} onClick={p.seeAgent.bind(p, r)}>二级代理管理</a>
              <br />
              <a href="javascript:void(0)" style={{ color: '#4A90E2' }} onClick={p.editAgent.bind(p, r)}>编辑</a>
            </div>
          );
        }
      }
    ]
    const columnsAccounts = [
      {
        title: '',
        dataIndex: 'headProtraitUrl',
        key: 'headProtraitUrl',
        width: '10%',
        render(t) {
          if (!t) return '-';
          return (
            t ? <Popover title={null} content={<img role="presentation" src={imgHandlerThumbBig(t)} style={{ width: 400 }} />}>
              <img role="presentation" src={imgHandlerThumb(t)} width={60} height={60} />
            </Popover> : '-'
          );
        },
      },
      { title: '代理人', dataIndex: 'agentName', key: 'agentName', width: '10%' },
      { title: '代理级别', dataIndex: 'agentLevel', key: 'agentLevel', width: '10%' },
      {
        title: '订单笔数',
        dataIndex: 'orderNum',
        key: 'orderNum',
        width: '10%',
      },
      { title: '销售金额', dataIndex: 'totalSalePrice', key: 'totalSalePrice', width: '10%' },
      {
        title: '可结算佣金',
        dataIndex: 'canSettlement',
        key: 'canSettlement',
        width: '10%',
        render(t, r) {
          return (
            <span style={{ color: '#4A90E2', fontWeight: 'bolder', cursor: 'pointer' }} onClick={p.orderDetailCan.bind(p, r)}>{r.canSettlement}</span>
          );
        }
      },
      {
        title: '待结算佣金',
        dataIndex: 'waitSettlement',
        key: 'waitSettlement',
        width: '12%',
        render(t, r) {
          return (
            <span style={{ color: '#4A90E2', fontWeight: 'bolder', cursor: 'pointer' }} onClick={p.orderDetailWait.bind(p, r)}>{r.waitSettlement}</span>
          );
        }
      },
      {
        title: '已结算佣金',
        dataIndex: 'beenSettlement',
        key: 'beenSettlement',
        width: '13%',
        render(t, r) {
          return (
            <span style={{ color: '#4A90E2', fontWeight: 'bolder', cursor: 'pointer' }} onClick={p.orderDetailBeen.bind(p, r)}>{r.beenSettlement}</span>
          );
        }
      },
      {
        title: '操作',
        dataIndex: 'Accounts6',
        key: 'Accounts6',
        width: '15%',
        render(t, r) {
          return (
            <div style={{ textAlign: 'center' }}>
              <a href="javascript:void(0)" style={{ color: '#4A90E2' }} onClick={p.Accounts.bind(p, r)}>结算</a>
              <br />
              <a href="javascript:void(0)" style={{ color: '#4A90E2' }} onClick={p.watchAccounts.bind(p, r)}>查看结算记录</a>
              <br />
              <a href="javascript:void(0)" style={{ color: '#4A90E2' }} onClick={p.commissionUnder.bind(p, r)}>线下结算</a>
            </div>
          );
        }
      },
    ]
    const watchlistAccounts = [
      { title: '结算单号', dataIndex: 'settlementNo', key: 'settlementNo', width: '20%' },
      { title: '微信名', dataIndex: 'shareUserName', key: 'shareUserName', width: '20%' },
      { title: '订单笔数', dataIndex: 'detailCount', key: 'detailCount', width: '20%' },
      { title: '结算金额', dataIndex: 'settlement', key: 'settlement', width: '20%' },
      { title: '结算时间', dataIndex: 'settlementTime', key: 'settlementTime', width: '20%' },

    ]
    return (
      <div className={styles.form}>
        <Tabs activeKey={activeTab} type="card" onChange={this.changeActiveKey.bind(this)}>
          <TabPane tab="一级代理管理" key="1">
            <Form>
              <Row style={{ marginBottom: 10 }}>
                <Col span="18"></Col>
                <Col span="6">
                  <Search
                    placeholder="输入代理名"
                    enterButton={true}
                    onSearch={this.onSearchOne.bind(this)}
                    style={{ float: 'right' }}
                  />
                </Col>
              </Row>
              <Row style={{ marginBottom: 10 }} >
                <Col>
                  <Button type="primary" size="large" onClick={this.showWxModal.bind(this)}>扫码添加代理</Button>
                  {/* <Button size="large" disabled={!hasSelected} style={{ float: 'right', marginLeft: 10 }}>删除</Button> */}
                  {/* <Button type="primary" size="large" disabled={!hasSelected} style={{ float: 'right', marginLeft: 10 }}>解除代理</Button> */}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Table
                    // rowSelection={rowSelection}
                    columns={columnsAgent}
                    dataSource={saleAgentList}
                    size="large"
                    rowKey={record => record.userNo}
                    pagination={paginationProps}
                  />
                </Col>
              </Row>
              {visible && <Modal
                visible={visible}
                title={title}
                onOk={this.hSubmit.bind(this)}
                onCancel={this.hCancel.bind(this)}
              >
                <Form onSubmit={this.submitEdit.bind(this)}>
                  <Row>
                    <Col span={12}>
                      <FormItem label="微信名" {...formItemLayoutT}>
                        {getFieldDecorator('agentName', {
                          // rules: [{ required: true, message: '请输入微信名' }],
                          initialValue: wxName.agentName,
                        })(
                          <Input placeholder="请输入微信名" disabled={true} />,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="真实姓名" {...formItemLayoutT}>
                        {getFieldDecorator('realName', {
                          rules: [{ required: true, message: '请输入真实姓名' }],
                          initialValue: wxName.realName,
                        })(

                          <Input placeholder="请输入真实姓名" />,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="状态" {...formItemLayoutT}>
                        {getFieldDecorator('status', {
                          rules: [{ required: true, message: '请选择状态' }],
                          initialValue: wxName.status,
                        })(

                          <Select placeholder="请选择状态" allowClear>
                            <Option value={1}>正常</Option>
                            <Option value={0}>已解除</Option>
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="联系电话" {...formItemLayoutT}>
                        {getFieldDecorator('phone', {
                          rules: [{ required: true, message: '请输入联系电话' }],
                          initialValue: wxName.phone,
                        })(

                          <Input placeholder="请输入联系电话" />,
                        )}
                      </FormItem>
                    </Col>
                    {/* <Col span={12}>
                      <FormItem label="佣金比例" {...formItemLayoutT}>
                        {getFieldDecorator('positionNo2', {
                          rules: [{ required: true, message: '请输入佣金比例' }],
                          // initialValue: roleModal.seq,
                        })(

                          <Input placeholder="请输入佣金比例" />,

                        )}

                      </FormItem>
                    </Col> */}
                  </Row>
                </Form>
              </Modal>}
              {visibleWx && <Modal
                visible={visibleWx}
                width={600}
                title={titles}
                onOk={this.wxOk.bind(this)}
                onCancel={this.wxCancel.bind(this)}>
                <iframe
                  style={{ width: '100%', height: '500px', overflow: 'visible' }}
                  ref="iframe"
                  // srcdoc={wxData}
                  // src="http://m.buyer007.com/wxTest.html"
                  src="/wechatLogin/getProxyHtml"
                  width="100%"
                  scrolling="no"
                  frameBorder="0"
                />
              </Modal>}
              {commissionVisible && <Modal
                visible={commissionVisible}
                title={commissionTitle}
                onOk={this.commissionSubmit.bind(this)}
                onCancel={this.commissionCancel.bind(this)}
              >
                <Form>
                  <Row>
                    <Col span={24}>
                      <p>确定修改佣金吗？</p>
                    </Col>
                  </Row>
                </Form>
              </Modal>}
            </Form>
          </TabPane>
          <TabPane tab="佣金结算管理" key="2">
            <Form>
              {/* <Row>
                <Menu
                  onClick={this.handleClick}
                  selectedKeys={[this.state.current]}
                  mode="horizontal"
                  style={{ background: '#fff' }}
                >
                  <Menu.Item key="1">
                    可结算
                  </Menu.Item>
                  <Menu.Item key="2">
                    待结算
                  </Menu.Item>
                  <Menu.Item key="3">
                    已结算
                  </Menu.Item>
                </Menu>
              </Row> */}
              <Row style={{ marginBottom: 10, marginTop: 15, }}>
                {/* <Col span="18">
                  <Button type="primary" size="large" onClick={this.commissionUnder.bind(this)}>线下佣金记录</Button>
                  <Button type="primary" size="large" style={{ marginLeft: 10, width: 122 }} onClick={this.AccountsList.bind(this)}>结算</Button>
                  <span style={{ marginLeft: 15, fontSize: '16px' }}>可结佣金：<b style={{ color: '#00cbd7' }}>¥200</b></span>
                </Col> */}
                <Col span="18"></Col>
                <Col span="6" >
                  <Search
                    placeholder="输入代理名"
                    enterButton={true}
                    onSearch={this.onSearchTwo.bind(this)}
                    style={{ float: 'right' }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Table
                    columns={columnsAccounts}
                    dataSource={SettlePageList}
                    size="large"
                    rowKey={record => record.shareUserId}
                  />
                </Col>
              </Row>
              {visibleAccounts && <Modal
                visible={visibleAccounts}
                title={titleAccounts}
                onOk={this.accountsSubmit.bind(this)}
                onCancel={this.accountsCancel.bind(this)}
              >
                <Form>
                  <Row>
                    <Col span={24}>
                      <p>确定结算？</p>
                    </Col>
                  </Row>
                </Form>
              </Modal>}
              {underVisible && <Modal
                visible={underVisible}
                title={underTitle}
                onOk={this.underSubmitOk.bind(this)}
                onCancel={this.underCancel.bind(this)}
              >
                <Form onSubmit={this.underSubmit.bind(this)}>
                  <Row>
                    <Col span={12}>
                      <FormItem label="微信名" {...formItemLayoutT}>
                        {getFieldDecorator('shareUserName', {
                          initialValue: agentNames,
                          rules: [{ required: true, message: '请输入微信名' }],
                        })(
                          <Input placeholder="请输入微信名" disabled={true} />,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="销售金额" {...formItemLayoutT}>
                        {getFieldDecorator('totalPrice', {
                          rules: [{ required: true, message: '请输入销售金额' }],
                        })(

                          <Input placeholder="请输入销售金额" />,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="结算金额" {...formItemLayoutT}>
                        {getFieldDecorator('positionNo', {
                          rules: [{ required: true, message: '请选择结算金额' }],
                        })(

                          <Input placeholder="请输入结算金额" />,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="订单笔数" {...formItemLayoutT}>
                        {getFieldDecorator('detailCount', {
                          rules: [{ required: true, message: '请输入订单笔数' }],
                        })(

                          <Input placeholder="请输入订单笔数" />,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="结算时间" {...formItemLayoutT}>
                        {getFieldDecorator('settlementTime', {
                          rules: [{ required: true, message: '请输入结算时间' }],
                          initialValue: moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                        })(

                          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,

                        )}

                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="备注" {...formItemLayoutT}>
                        {getFieldDecorator('remark', {
                        })(

                          <Input placeholder="请输入备注" />,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Modal>}
              {watchVisible && <Modal
                visible={watchVisible}
                title={watchTitle}
                onOk={this.watchSubmit.bind(this)}
                onCancel={this.watchCancel.bind(this)}
                width={1000}
              >
                <Form>
                  <Row>
                    <Col span={24}>
                      <Table
                        columns={watchlistAccounts}
                        dataSource={searchPageLists}
                        size="large"
                        rowKey={record => record.id}
                      />
                    </Col>
                  </Row>
                </Form>
              </Modal>}
            </Form>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps({ order }) {
  const { saleAgentList, skuTotal, SettlePageList, searchPageLists } = order;
  console.log(searchPageLists)
  return {
    saleAgentList,
    skuTotal,
    SettlePageList,
    searchPageLists,
  };
}

export default connect(mapStateToProps)(Form.create()(SaleAgent));
