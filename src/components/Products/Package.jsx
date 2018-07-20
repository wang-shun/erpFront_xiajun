import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Table, Input, Button, Row, Col, Form, Modal, Popconfirm, Select, InputNumber } from 'antd';
import styles from './Products.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
@window.regStateCache
class Package extends Component {

    constructor() {
        super();
        this.state = {
            activeTab: '1',
            visible: false,
            title: '', // modal的title
            titleTwo: '',
            visibleTwo: false,
        };
    }
    changeActiveKey(key) {
        this.setState({ activeTab: key });
    }
    //tab1
    handleSubmit() {
        const { scaleValues, dispatch } = this.props;
        console.log(scaleValues)
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            console.log(fieldsValue)
            if (err) {
                return;
            }
            if (scaleValues.data) {
                dispatch({
                    type: 'pack/updatePackageScale',
                    payload: { ...fieldsValue, id: scaleValues.data.id, pageIndex: 1 },
                });
            } else {
                dispatch({
                    type: 'pack/addPackageScale',
                    payload: { ...fieldsValue, pageIndex: 1 },
                });
            }
            this.closeModal(false);
        });
    }

    showModal() {
        this.setState({ visible: true, title: '新增', });
    }

    closeModal(visible) {
        this.setState({
            visible,
        });
        this.props.dispatch({
            type: 'pack/saveScale',
            payload: {},
        });
    }

    handleQuery(record) {
        const p = this;
        p.setState({
            visible: true,
        }, () => {
            p.props.dispatch({
                type: 'pack/queryPackageScale',
                payload: { id: record.id },
            });
        });
    }

    handleDelete(record) {
        this.props.dispatch({
            type: 'pack/deletePackageScale',
            payload: { id: record.id },
        });
    }
    // tab2
    handleSubmitTwo() {
        const { levelValues, dispatch } = this.props;
        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            console.log(fieldsValue)
            if (err) {
                return;
            }
            if (levelValues.data) {
                dispatch({
                    type: 'pack/updatePackageLevel',
                    payload: { ...fieldsValue, id: levelValues.data.id, pageIndex: 1 },
                });
            } else {
                dispatch({
                    type: 'pack/addPackageLevel',
                    payload: { ...fieldsValue, pageIndex: 1 },
                });
            }
            this.closeModalTwo(false);
        });
    }
    showModalTwo() {
        this.setState({
            visibleTwo: true,
        })      
        this.props.dispatch({
            type: 'pack/clearqueryPackageLevel',
            payload: {},
        });
    }
    closeModalTwo(visibleTwo) {
        this.setState({
            visibleTwo: false,
        }, () => {
            this.props.dispatch({
                type: 'pack/saveLevel',
                payload: {},
            });
        });
    }
    handleQueryTwo(record) {
        const p = this;
        p.setState({
            visibleTwo: true,
            titleTwo: '修改',
        }, () => {
            p.props.dispatch({
                type: 'pack/queryPackageLevel',
                payload: { id: record.id },
            });
        });
    }
    handleDeleteTwo(record) {
        this.props.dispatch({
            type: 'pack/deletePackageLevel',
            payload: { id: record.id },
            cb: () => { }
        });
    }
    handleSelectScale(value) {
        const { scaleList, form } = this.props;
        scaleList.forEach((el) => {
            if (el.id.toString() === value) form.setFieldsValue({ packageEn: el.enName });
        });
    }
    render() {
        const p = this;
        const { form, scaleList = [], scaleValues = {}, levelList = [], levelValues = {} } = p.props;
        const modalValues = scaleValues.data || {};
        const modalValueLevel = levelValues.data || {};
        console.log(modalValueLevel)
        const { getFieldDecorator } = form;
        const { title, visible, titleTwo, visibleTwo, activeTab } = p.state;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const columns = [
            { title: '包装类别名称', dataIndex: 'name', key: 'name' },
            { title: '包装类别英文名称', dataIndex: 'enName', key: 'enName' },
            {
                title: '操作',
                dataIndex: 'operator',
                key: 'operator',
                render(t, r) {
                    return (
                        <div className={styles.operation}>
                            <a href="javascript:void(0)" onClick={p.handleQuery.bind(p, r)}>修改</a>
                            <Popconfirm title="确定删除此类别？" onConfirm={p.handleDelete.bind(p, r)}>
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
        //
        const columnsTwo = [
            { title: '包装规格名称', dataIndex: 'name', key: 'name' },
            { title: '包装规格类别英文名称', dataIndex: 'packageEn', key: 'packageEn' },
            { title: '包装级别', dataIndex: 'packageLevel', key: 'packageLevel' },
            { title: '包装规格ID', dataIndex: 'packageId', key: 'packageId' },
            { title: '重量(磅)', dataIndex: 'weight', key: 'weight' },
            {
                title: '操作',
                dataIndex: 'operator',
                key: 'operator',
                render(t, r) {
                    return (
                        <div className={styles.operation}>
                            <a href="javascript:void(0)" onClick={p.handleQueryTwo.bind(p, r)}>修改</a>
                            <Popconfirm title="确定删除此规格？" onConfirm={p.handleDeleteTwo.bind(p, r)}>
                                <a href="javascript:void(0)">删除</a>
                            </Popconfirm>
                        </div>
                    );
                },
            },
        ];

        return (
            <Tabs activeKey={activeTab} type="card" onChange={this.changeActiveKey.bind(this)}>
                <TabPane tab="包装规格类别" key="1">
                        <Row>
                            <Col className={styles.productModalBtn}>
                                <Button type="primary" size="large" onClick={p.showModal.bind(p)}>新增类别</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table
                                    columns={columns}
                                    dataSource={scaleList}
                                    bordered
                                    size="large"
                                    rowKey={record => record.id}
                                />
                            </Col>
                        </Row>
                        {visible && <Modal {...modalProps}>
                            <Form>
                                <FormItem
                                    label="类别名称"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('name', {
                                        initialValue: modalValues.name,
                                        rules: [{ required: true, message: '请输入类别名称' }],
                                    })(
                                        <Input placeholder="请输入类别名称" />,
                                    )}
                                </FormItem>
                                <FormItem
                                    label="类别英文名称"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('enName', {
                                        initialValue: modalValues.enName,
                                        rules: [{ required: true, message: '请输入类别英文名称' }],
                                    })(
                                        <Input placeholder="请输入类别英文名称" />,
                                    )}
                                </FormItem>
                            </Form>
                        </Modal>}
                </TabPane>
                <TabPane tab="包装规格" key="2">
                        <Row>
                            <Col className={styles.productModalBtn}>
                                <Button type="primary" size="large" onClick={p.showModalTwo.bind(p)}>新增规格</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table
                                    columns={columnsTwo}
                                    dataSource={levelList}
                                    bordered
                                    size="large"
                                    rowKey={record => record.id}
                                // pagination={paginationProps}
                                />
                            </Col>
                        </Row>
                        {visibleTwo && <Modal
                            visible={visibleTwo}
                            title={titleTwo}
                            closable={true}
                            onOk={p.handleSubmitTwo.bind(p)}
                            onCancel={p.closeModalTwo.bind(p)}
                        >
                            <Form>
                                <FormItem
                                    label="包装规格类别名称"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('packageId', {
                                        initialValue: modalValueLevel.packageId,
                                        rules: [{ required: true, message: '请选择包装规格类别名称' }],
                                    })(
                                        <Select placeholder="请选择包装规格类别名称" onChange={this.handleSelectScale.bind(this)} optionLabelProp="title" allowClear>
                                            {scaleList.map(el => <Option key={el.name} value={el.id.toString()} title={el.name}>{el.name}</Option>)}
                                        </Select>,
                                    )}
                                </FormItem>
                                <FormItem
                                    label="包装规格类别英文名称"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('packageEn', {
                                        initialValue: modalValueLevel.packageEn,
                                        rules: [{ required: true }],
                                    })(
                                        <Input placeholder="请选择包装规格类别名称" disabled />,
                                    )}
                                </FormItem>
                                <FormItem
                                    label="包装规格名称"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('name', {
                                        initialValue: modalValueLevel.name,
                                        rules: [{ required: true, message: '请输入包装规格名称' }],
                                    })(
                                        <Input placeholder="请输入包装规格名称" />,
                                    )}
                                </FormItem>
                                <FormItem
                                    label="包装级别"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('packageLevel', {
                                        initialValue: modalValueLevel.packageLevel,
                                        rules: [{ required: true, message: '请输入包装级别' }],
                                    })(
                                        <Select placeholder="请输入包装级别" allowClear>
                                            <Option value={1}>一级</Option>
                                            <Option value={2}>二级</Option>
                                            <Option value={3}>三级</Option>
                                            <Option value={4}>四级</Option>
                                            <Option value={5}>五级</Option>
                                        </Select>,
                                    )}
                                </FormItem>
                                <FormItem
                                    label="重量(磅)"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('weight', {
                                        initialValue: modalValueLevel.weight,
                                        rules: [{ required: true, message: '请输入重量' }],
                                    })(
                                        <InputNumber step={0.01} placeholder="请输入重量" />,
                                    )}
                                </FormItem>
                            </Form>
                        </Modal>}
                </TabPane>
            </Tabs>
        );
    }
}

function mapStateToProps(state) {
    const { scaleList, scaleValues, levelList, levelValues, levelTotal } = state.pack;
    return {
        scaleValues,
        scaleList,
        levelValues,
        levelList,
        levelTotal,
    };
}

export default connect(mapStateToProps)(Form.create()(Package));
