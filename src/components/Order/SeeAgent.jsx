import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Tabs, Row, Col, Button, Table, Input, Popover, Modal, Select } from 'antd';
import { routerRedux } from 'dva/router';
const FormItem = Form.Item;
const Search = Input.Search;
@window.regStateCache
class SeeAgent extends Component {

    constructor() {
        super();
        this.state = {
            selectedRowKeys: [],
            commissionVisible: false,
            commissionTitle: '',
            commission: {},
            visible: false,
            title: '',
            wxName: {},
            visibleWx: false,
            titles: '',
            wxLink:'',
        };
    }
    componentDidMount() {
        const { wxLink } = this.state;
        var a = this.props.location.query;
        this.props.dispatch({
            type: 'order/queryMallSaleAgents',
            payload: {
                parentAgent: a.parentAgent,
            },
        });
        this.setState({
            wxLink : "/wechatLogin/getProxyHtml?parentAgent="+a.parentAgent
        })

    }
    back() {
        this.props.dispatch(routerRedux.push('/marketing/saleAgent'));
    }
    editAgent(r) {
        this.setState({
            visible: true,
            title: '编辑',
            wxName: r,
        })
    }
    editA() {

    }
    editConfirm() { }
    editCancel() { }
    handleSearch(num, size) {
        var a = this.props.location.query;
        const payload = { pageIndex: typeof num === 'number' ? num : 1, parentAgent: a.parentAgent };
        if (typeof size === 'number') payload.pageSize = size;
        var a = this.props.location.query;
        this.props.dispatch({
            type: 'order/queryMallSaleAgents',
            payload,
        });
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    onBlurMoney(r) {
        console.log('this is mao')
        const { form } = this.props;
        form.validateFieldsAndScroll([`r_${r.userNo}_commissionValue`], (err, fieldsValue) => {
            if (err) {
                return;
            }
            const comMao = {
                userNo: r.userNo,
                commissionMode: r.commissionMode,
                commissionValue: (parseFloat(fieldsValue["r_" + r.userNo + "_commissionValue"])) / 100,
            }
            console.log(comMao)
            this.setState({
                commissionVisible: true,
                commissionTitle: '修改佣金',
                commission: comMao,
            })
        });
    }
    commissionSubmit() {
        const { commission } = this.state;
        var a = this.props.location.query;
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
                    payload: {
                        parentAgent: a.parentAgent,
                    },
                })

            }
        });
    }
    commissionCancel() {
        this.setState({
            commissionVisible: false,
        })
    }

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
            });
        });
    }
    hSubmit() {
        var a = this.props.location.query;
        this.submitEdit();
        this.props.dispatch({
            type: 'order/queryMallSaleAgents',
            payload: {
                parentAgent: a.parentAgent,
            },
        });
        this.setState({
            visible: false,
        })
    }
    hCancel() {
        this.setState({
            visible: false,
        })
    }
    showWxModal() {
        this.setState({
            visibleWx: true,
            titles: '扫码添加代理'
        })
    }
    wxOk(){
        this.setState({
            visibleWx: false,
        })
    }
    wxCancel(){
        this.setState({
            visibleWx: false,
        })
    }
    render() {
        const p = this;
        const { form, saleAgentList = [], skuTotal, pageSize } = this.props;
        const { selectedRowKeys, commissionVisible, commissionTitle, visible, title, visibleWx, titles, wxName, wxLink } = this.state;
        const { getFieldDecorator } = form;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const formItemLayoutT = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
          };
        const hasSelected = selectedRowKeys.length > 0;
        var a = this.props.location.query;
        console.log(a)
        let parentAgent = a.parentAgent;
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
                        parentAgent: a.parentAgent,
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
            { title: '二级代理', dataIndex: 'agentName', key: 'agentName', width: '12%' },
            {
                title: '一级代理',
                dataIndex: 'parentAgentName',
                key: 'parentAgentName',
                width: '12%',
            },
            {
                title: '佣金',
                dataIndex: 'commissionValue',
                key: 'commissionValue',
                width: '18%',
                render(t, r, index) {
                    return (
                        <FormItem>
                            {getFieldDecorator(`r_${r.userNo}_commissionValue`, { initialValue: t ? (t * 100) : '', rules: [{ required: true, message: '请输入佣金' }], })(
                                <Input placeholder="请填写佣金" onBlur={p.onBlurMoney.bind(p, r)} style={{ width: 50 }} />
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
                            <a href="javascript:void(0)" style={{ color: '#4A90E2' }} onClick={p.editAgent.bind(p, r)}>编辑</a>
                        </div>
                    );
                }
            }
        ]
        return (
            <div>

                <Form>
                    <Row style={{ marginBottom: 10 }} >
                        <Col>
                            <Button type="primary" size="large" onClick={this.back.bind(this)}>返回</Button>
                            <Button size="large" disabled={!hasSelected} style={{ float: 'right', marginLeft: 10 }}>删除</Button>
                            <Button type="primary" size="large" disabled={!hasSelected} style={{ float: 'right', marginLeft: 10 }}>解除代理</Button>
                            <Button type="primary" size="large" style={{ float: 'right', marginLeft: 10 }} onClick={this.showWxModal.bind(this)}>增加二级代理</Button>

                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table
                                rowSelection={rowSelection}
                                columns={columnsAgent}
                                dataSource={saleAgentList}
                                size="large"
                                rowKey={record => record.userNo}
                                pagination={paginationProps}
                            />
                        </Col>
                    </Row>
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
                            src={wxLink}
                            width="100%"
                            scrolling="no"
                            frameBorder="0"
                        />
                    </Modal>}
                </Form>
            </div>
        );
    }
}

function mapStateToProps({ order }) {
    const { saleAgentList, skuTotal, pageSize } = order;
    console.log(saleAgentList)
    return {
        saleAgentList,
        skuTotal,
        pageSize,
    };
}

export default connect(mapStateToProps)(Form.create()(SeeAgent));
