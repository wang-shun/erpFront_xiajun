import React, { Component } from 'react';
import { Form, Row, Col, Button, Table, Modal, Popover, Input, InputNumber } from 'antd';
import { connect } from 'dva';


const FormItem = Form.Item;
@window.regStateCache
class release extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            appids: [],
            selectedRowKeys: [],
            editVisible: false,
            updateList: {},
            visibleWx: false,
            titleWx: '',
            appidWx:'',
        };
    }
    allBatch() {

        this.setState({
            visible: true,
        })
    }
    handleSubmit() {
        const { form } = this.props;
        const { appids } = this.state;
        form.validateFieldsAndScroll((err, fieldsValue) => {
            console.log(fieldsValue.templateId)
            if (fieldsValue.templateId == undefined) {
                return;
            }
            this.props.dispatch({
                type: 'appset/weChatPublish',
                payload: {
                    templateId: fieldsValue.templateId,
                    userDesc: fieldsValue.userDesc,
                    userVersion: fieldsValue.userVersion,
                    appids: JSON.stringify(appids),
                },
                cb: () => {
                    this.setState({
                        visible: false,
                        selectedRowKeys: [],
                    })
                }
            });
        })
    }
    handleCancel() {
        this.setState({
            visible: false,
            selectedRowKeys: [],
        })
    }
    edit(r) {
        this.setState({
            editVisible: true,
            updateList: r,
        })

    }
    generate(r) {
        console.log(r.appid)
        this.setState({
            visibleWx: true,
            titleWx: '扫码',
            appidWx:"/wechatApplet/getUrl?appid="+r.appid,
        })
    }
    WxCancel(){
        this.setState({
            visibleWx: false,
        })
    }
    editSubmit() {
        const { form } = this.props;
        const { updateList } = this.state;
        console.log(updateList.id)
        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            console.log(values.templateIdT)
            this.props.dispatch({
                type: 'appset/wechatAppletUpdate',
                payload: {
                    id: updateList.id,
                    templetId: values.templateIdT,
                },
                cb: () => {
                    this.props.dispatch({
                        type: 'appset/wechatApplet',
                        payload: {},
                    })
                    this.setState({
                        editVisible: false,
                    })
                }
            })
        })


    }
    editCancel() {
        this.setState({
            editVisible: false,
        })
    }
    render() {
        const p = this;
        const { appletList, form } = this.props;
        const { getFieldDecorator } = form;
        const { visible, appids = [], selectedRowKeys, editVisible, updateList = {}, visibleWx, titleWx, appidWx } = this.state;
        console.log(updateList.appid)
        const paginationProps = {
            // defaultPageSize: 20,
            // total: cateTotal,
            // pageSize: catePageSize,
            // onChange(page, pageSize) {
            //     console.log(page, pageSize)
            //     p.handleSearch(page, pageSize);
            // },
        };
        const rowSelection = {
            selectedRowKeys,
            onChange(selectedRowKeys, selectedRows) {
                const listId = [];
                selectedRows.forEach((el) => {
                    listId.push(el.appid);
                });
                p.setState({ appids: listId, selectedRowKeys: selectedRowKeys });
            },
        };
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const formItemLayouT = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 },
        }
        const columns = [
            {
                title: '小程序名',
                dataIndex: 'companyName',
                key: 'companyName',
                width: 10 + '%',
            },
            {
                title: 'App ID',
                dataIndex: 'appid',
                key: 'appid',
                width: 10 + '%',
            },
            {
                title: '服务器域名',
                dataIndex: 'domainName',
                key: 'domainName',
                width: 32 + '%',
                render(t, r) {
                    return (
                        <div>
                            <p>request合法域名:{r.requestdomain}</p>
                            <p>socket合法域名:{r.wsrequestdomain}</p>
                            <p>uploadFile合法域名:{r.uploaddomain}</p>
                            <p>downloadFile合法域名:{r.downloaddomain}</p>
                        </div>
                    );
                }
            },
            {
                title: '业务域名',
                dataIndex: 'webviewdomain',
                key: 'webviewdomain',
                width: 10 + '%',
            },
            {
                title: '模版ID',
                dataIndex: 'templetId',
                key: 'templetId',
                width: 10 + '%',
            },
            {
                title: '最新发布时间',
                dataIndex: 'gmtModify',
                key: 'gmtModify',
                width: 10 + '%',
            },
            {
                title: '小程序二维码',
                dataIndex: 'imgUrl',
                key: 'imgUrl',
                width: 8 + '%',
                render(t) {
                    return (
                        t ? <Popover title={null} content={<img role="presentation" src={imgHandlerThumbBig(t)} style={{ width: 400 }} />}>
                            <img role="presentation" src={imgHandlerThumb(t)} width={80} height={80} />
                        </Popover> : '-'
                    );
                }
            },
            {
                title: '操作 ',
                dataIndex: 'operation',
                key: 'operation',
                width: 10 + '%',
                render(t, r) {
                    return (
                        <div>
                            <a href="javascript:void(0)" onClick={p.edit.bind(p, r)} style={{ marginRight: 10 }}>修改</a>
                            <br />
                            {/* <a href="javascript:void(0)" onClick={p.generate.bind(p, r)} style={{ marginRight: 10 }}>生成体验二维码</a> */}
                        </div>
                    );
                }
            },
        ]
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div>
                <Form>
                    <Row style={{ marginBottom: 15 }}>
                        <Col >
                            <Button type="primary" style={{ float: 'left' }} size="large" onClick={() => { this.allBatch(); }} disabled={!hasSelected}>批量发布</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="table-wrapper">
                            <Table
                                columns={columns}
                                dataSource={appletList}
                                bordered
                                size="large"
                                rowKey={record => record.id}
                                pagination={paginationProps}
                                rowSelection={rowSelection}
                            />
                        </Col>
                    </Row>
                </Form>
                {visible && <Modal
                    visible={visible}
                    title={<font color="#333" size="4">批量发布</font>}
                    onOk={p.handleSubmit.bind(p)}
                    onCancel={p.handleCancel.bind(p)}
                    width={600}
                >
                    <Form>
                        <Row gutter={10}>
                            <Col span={12}>
                                <FormItem
                                    label="模板ID"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('templateId', {
                                        rules: [{ required: true, message: '请输入模板ID' }],
                                    })(
                                        <InputNumber placeholder="请输入模板ID" />,

                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label="版本号"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('userVersion', {
                                    })(
                                        <Input placeholder="请输入版本号" />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={10}>
                            <Col span={24}>
                                <FormItem
                                    label="发布说明"
                                    {...formItemLayouT}
                                >
                                    {getFieldDecorator('userDesc', {
                                    })(
                                        <Input placeholder="请输入发布说明" />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>}
                {editVisible && <Modal
                    visible={editVisible}
                    title={<font color="#333" size="4">修改</font>}
                    onOk={p.editSubmit.bind(p)}
                    onCancel={p.editCancel.bind(p)}
                    width={800}
                >
                    <Form>
                        <Row gutter={10}>
                            <Col span={12}>
                                <FormItem
                                    label="小程序名"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('companyName', {
                                        initialValue: updateList.companyName,
                                        rules: [{ required: true, message: '请输入小程序名' }],
                                    })(
                                        <InputNumber placeholder="请输入小程序名" disabled={true} />,

                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    label="App ID"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('appid', {

                                        initialValue: updateList.appid,
                                        rules: [{ required: true, message: '请输入AppID' }],
                                    })(
                                        <Input placeholder="请输入AppID" disabled={true} />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={10}>
                            <Col span={24}>
                                <FormItem
                                    label="模板ID"
                                    {...formItemLayouT}
                                >
                                    {getFieldDecorator('templateIdT', {
                                        initialValue: updateList.templateId,
                                        rules: [{ required: true, message: '请输入模板ID' }],
                                    })(
                                        <InputNumber placeholder="请输入模板ID" />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>}
                {visibleWx && <Modal
                    visible={visibleWx}
                    width={500}
                    height={500}
                    title={titleWx}
                    onOk={this.WxCancel.bind(this)}
                    onCancel={this.WxCancel.bind(this)}>
                    <iframe
                        style={{ width: '100%', height: '500px', overflow: 'visible' }}
                        ref="iframe"
                        // srcdoc={wxData}
                        // src="http://m.buyer007.com/wxTest.html"
                        src={appidWx}
                        width="100%"
                        scrolling="no"
                        frameBorder="0"
                    />
                </Modal>}
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { appletList, updateList } = state.appset;
    return {
        appletList,
        updateList,
    };
}

export default connect(mapStateToProps)(Form.create()(release));
