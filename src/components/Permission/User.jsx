import React, { Component } from 'react';
import { Form, Table, Row, Col, Button, Modal, Input, Popconfirm, Select } from 'antd';
import { connect } from 'dva';

import check from '../../utils/checkLib';
import isNull from '../../utils/isNull';
import { routerRedux } from 'dva/router';
const FormItem = Form.Item;
const Option = Select.Option;

@window.regStateCache
class Resource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      visibleWx: false,
      titles: '',
      visiblePassword: false,
      info: '',
    };
  }
  // componentWillMount() {
  //   this.setState({
  //     visibleWx: false,
  //   })
  // }
  componentDidMount() {
    
    // console.log('this is mao')
    // var a =  this.props.location.query;
    //window.alert(a.visible)
    this.setState({
      visibleWx: false,
    })
    // console.log('关闭modal框')
}



  handleSubmit() {
    const p = this;
    const { userModal = {}, dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      if (values.createTime) values.createTime = new Date(values.createTime).format('yyyy-MM-dd hh:mm:ss');
      console.log(values)
      if (userModal.id) {
        dispatch({ type: 'permission/updateUser', payload: { ...values, id: userModal.id } });
      } else {
        dispatch({ type: 'permission/addUser', payload: { ...values } });
      }
      p.handleCancel();
    });
  }
  handleCancel() {
    this.setState({ visible: false, visibleWx: false, visiblePassword: false });
    this.props.form.resetFields();
  }
  showModal() {
    this.setState({ visible: true, title: '新增', userModal: {} });
    this.props.dispatch({ type: 'permission/clearUser', payload: {} });
  }
  showWxModal() {
    this.setState({
      visibleWx: true,
      titles: '扫码加用户'
    })
    // this.props.dispatch({ type: 'permission/wxRout', payload: {} })
  }
  showPasswordModal() {
    this.setState({
      visiblePassword: true,
      info: '修改密码'
    })
  }
  confirmPassword() {
    const { form } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      this.props.dispatch({ type: 'permission/editUserPwdList', ...values });
      this.setState({
        visiblePassword: false,
      })
    })
    
  }
  compareToFirstPassword = (rule, value, callback) =>{
    const form = this.props.form;
    if (value && value !== form.getFieldValue('pwd')) {
      callback('两次密码输入不同');
    } else {
      callback();
    }
  }
  handleQuery(r) {
    this.setState({ visible: true, title: '修改' });
    this.props.dispatch({ type: 'permission/queryUser', payload: { id: r.id } });
  }
  handleDelete(r) {
    this.props.dispatch({ type: 'permission/deleteUser', payload: { id: r.id } });
  }
  checkPhone(rules, value, cb) {
    if (!check.phone(value)) cb('请输入正确的手机号码');
    cb();
  }
  render() {
    const p = this;
    const { userList = [], total, form, userModal = {}, orgList = [], roleList = [], wxData } = this.props;
    console.log(roleList)
    const { visible, title, titles, visibleWx, info, visiblePassword } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const _roleIds = [];
    if (userModal.rolesList) {
      console.log(userList.rolesList)
      userModal.rolesList.forEach((el) => {
        if (el && el.roleId) _roleIds.push(el.roleId.toString());
      });
      console.log(_roleIds)
    }
    const columns = [
      { title: '登录名', key: 'loginName', dataIndex: 'loginName' },
      { title: '姓名', key: 'name', dataIndex: 'name' },
      { title: '所属部门', key: 'organizationName', dataIndex: 'organizationName' },
      { title: '创建时间', key: 'gmtCreate', dataIndex: 'gmtCreate' },
      {
        title: '性别',
        key: 'sex',
        dataIndex: 'sex',
        render(t) {
          if (t === 1) return '男';
          return '女';
        },
      },
      { title: '年龄', key: 'age', dataIndex: 'age' },
      { title: '手机号', key: 'phone', dataIndex: 'phone' },
      {
        title: '角色',
        key: 'rolesList',
        dataIndex: 'rolesList',
        render(t) {
          const role = [];
          if (t && t[0]) {
            t.forEach((el) => {
              role.push(el.name);
            });
          }
          return role.join(', ');
        },
      },
      {
        title: '用户类型',
        key: 'userType',
        dataIndex: 'userType',
        render(t) {
          if (t === 0) return '管理员';
          return '用户';
        },
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        render(t) {
          if (t === 0) return '正常';
          return '停用';
        },
      },
      {
        title: '操作',
        key: 'oper',
        dataIndex: 'oper',
        render(t, r) {
          return (
            <div>
              <a href="javascript:void(0)" style={{ marginRight: 10 }} onClick={p.handleQuery.bind(p, r)}>修改</a>
              <Popconfirm title="确定删除" onConfirm={p.handleDelete.bind(p, r)}>
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    const paginationProps = {
      total,
      pageSize: 20,
      onChange(pageIndex) {
        p.props.dispatch({ type: 'user/queryUserList', payload: { pageIndex } });
      },
    };

    return (
      <div>
        {/* <div className="refresh-btn"><Button type="ghost" size="small" onClick={this._refreshData.bind(this)}>刷新</Button></div> */}
        <Row>
          <Col style={{ paddingBottom: '15px' }}>
            <Button type="primary" size="large" onClick={this.showModal.bind(this)}>增加用户</Button>
            <Button type="primary" size="large" onClick={this.showWxModal.bind(this)} style={{ marginLeft: '10px' }}>扫码加用户</Button>
            <Button type="primary" size="large" onClick={this.showPasswordModal.bind(this)} style={{ marginLeft: '10px' }}>修改密码</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table columns={columns} dataSource={userList} rowKey={r => r.id} pagination={paginationProps} bordered />
          </Col>
        </Row>
        {visible && <Modal
          visible={visible}
          width={600}
          title={title}
          onOk={this.handleSubmit.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <Form>
            <Row>
              <Col span={12}>
                <FormItem label="登录名" {...formItemLayout}>
                  {getFieldDecorator('loginName', {
                    rules: [{ required: true, message: '请输入登录名' }],
                    initialValue: userModal.loginName,
                  })(
                    <Input placeholder="请输入登录名" disabled= {userModal.id && userModal.loginName.indexOf("#init#") != 0}/>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="姓名" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入姓名' }],
                    initialValue: userModal.name,
                  })(
                    <Input placeholder="请输入姓名" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="密码"
                  {...formItemLayout}
                >
                  {getFieldDecorator('password', {
                    // rules: [{ required: true, message: '请输入密码' }],
                    initialValue: userModal.password,
                  })(
                    <Input type="password" placeholder="请输入密码" disabled= {userModal.id? true: false}/>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="性别" {...formItemLayout}>
                  {getFieldDecorator('sex', {
                    rules: [{ required: true, message: '请选择性别' }],
                    initialValue: !isNull(userModal.sex) ? userModal.sex.toString() : undefined,
                  })(
                    <Select placeholder="请选择性别" allowClear>
                      <Option value="1">男</Option>
                      <Option value="2">女</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="年龄" {...formItemLayout}>
                  {getFieldDecorator('age', {
                    rules: [{ required: true, message: '请输入年龄' }],
                    initialValue: userModal.age,
                  })(
                    <Input placeholder="请输入年龄" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="用户类别" {...formItemLayout}>
                  {getFieldDecorator('userType', {
                    rules: [{ required: true, message: '请输入用户类别' }],
                    initialValue: typeof (userModal.userType) === 'number' ? userModal.userType.toString() : undefined,
                  })(
                    <Select placeholder="请输入用户类别" allowClear>
                      <Option value="1">用户</Option>
                      <Option value="0">管理员</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="部门" {...formItemLayout}>
                  {getFieldDecorator('organizationId', {
                    rules: [{ required: true, message: '请选择部门' }],
                    initialValue: userModal.organizationId ? userModal.organizationId.toString() : undefined,
                  })(
                    <Select placeholder="请选择部门" allowClear>
                      {orgList.map(el => <Option key={el.id} value={el.id.toString()}>{el.name}</Option>)}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="角色" {...formItemLayout}>
                  {getFieldDecorator('roleIds', {
                    rules: [{ required: true, message: '请选择角色' }],
                    initialValue: _roleIds,
                  })(
                    <Select placeholder="请选择角色" mode="multiple" allowClear>
                      {roleList.map(el => <Option key={el.roleId} value={el.roleId.toString()}>{el.name}</Option>)}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="手机号" {...formItemLayout}>
                  {getFieldDecorator('phone', {
                    rules: [{ validator: this.checkPhone.bind(this) }, { required: true, message: '请输入手机号' }],
                    initialValue: userModal.phone,
                  })(
                    <Input placeholder="请输入手机号" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="状态" {...formItemLayout}>
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '请选择状态' }],
                    initialValue: !isNull(userModal.status) ? userModal.status.toString() : undefined,
                  })(
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="0">正常</Option>
                      <Option value="1">停用</Option>
                    </Select>,
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
          onOk={this.handleCancel.bind(this)}
          onCancel={this.handleCancel.bind(this)}>
          <iframe
            style={{ width: '100%', height: '500px', overflow: 'visible' }}
            ref="iframe"
            // srcdoc={wxData}
            // src="http://m.buyer007.com/wxTest.html"
            src="/wechatLogin/getHtml"
            width="100%"
            scrolling="no"
            frameBorder="0"
          />
        </Modal>}
        {visiblePassword && <Modal
          visible={visiblePassword}
          width={500}
          title={info}
          onOk={this.confirmPassword.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <Form>
            <Row>
              <Col>
                <FormItem label="旧密码" {...formItemLayout}>
                  {getFieldDecorator('oldPwd', {
                    rules: [{ required: true, message: '请输入旧密码' }],
                  })(
                    <Input type="password" placeholder="请输入旧密码" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label="新密码" {...formItemLayout}>
                  {getFieldDecorator('pwd', {
                    rules: [{ required: true, message: '请输入新密码' }],
                  })(
                    <Input type="password" placeholder="请输入新密码" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label="确认密码" {...formItemLayout}>
                  {getFieldDecorator('pwdConfirm', {
                  rules: [{ required: true, message: '请再输入一次密码' },{ validator: this.compareToFirstPassword,}],
                  })(
                    <Input type="password" placeholder="请再输入一次密码" />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>}
      </div>);
  }
}

function mapStateToProps(state) {
  const { userList, userTotal, userModal, orgList, roleList, wxData } = state.permission;
  return { userList, total: userTotal, userModal, orgList, roleList, wxData };
}

export default connect(mapStateToProps)(Form.create()(Resource));
