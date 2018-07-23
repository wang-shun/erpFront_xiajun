import React, { Component } from 'react';
import { Button, Row, Form, Input, Tabs } from 'antd';
import { connect } from 'dva';
import logoImg from '../../assets/images/logo-white.png';
import styles from './style.less';

import RedBox from 'redbox-react';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Login extends Component {
  constructor() {
    super();
    this.state = {
      loginButtonLoading: false,
      wxMao: '',
    };
  }
  handleOk() {
    const p = this;
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      p.submitLogin(values);
    });
  }
  submitLogin(payload) {
    this.props.session.username=payload.username;
    this.props.dispatch({
      type: 'session/login',
      payload,
    });
  }
  render() {
    const { session = {} } = this.props
    const { handleOk } = this;
    const { form } = this.props;
    const { loginButtonLoading } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.form}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="账户登录" key="1">
            <div className={styles.logo}>
              <img role="presentation" src={logoImg} />
            </div>
            <form>
              <FormItem hasFeedback>
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: '请填写用户名',
                    },
                  ],
                })(<Input size="large" onPressEnter={handleOk.bind(this)} placeholder="用户名" />)}
              </FormItem>
              <FormItem hasFeedback>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请填写密码',
                    },
                  ],
                })(<Input size="large" type="password" onPressEnter={handleOk.bind(this)} placeholder="密码" />)}
              </FormItem>
              <Row>
                <Button type="primary" size="large" onClick={handleOk.bind(this)} loading={loginButtonLoading}>
                  登录
            </Button>
              </Row>
              <p>网擒科技 版权所有</p>
              {/* <div style={{ textAlign: 'center' }}><a onClick={this.wxRouter.bind(this)}>微信登录</a></div> */}
            </form>
          </TabPane>
          <TabPane tab="微信登录" key="2">
            <iframe
              style={{ width: '250px', height: '300px', overflow: 'visible' }}
              ref="iframe"
              // srcdoc={wxData}
              // src="http://m.buyer007.com/wxTest.html"
              src="/wechatLogin/getLoginHtml"
              width="100%"
              scrolling="no"
              frameBorder="0"
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps({ session }) {
  return { session };
}

export default connect(mapStateToProps)(Form.create()(Login));
