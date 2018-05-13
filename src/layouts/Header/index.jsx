import React from 'react';
import { Icon, Badge } from 'antd';
// import { Menu, Icon } from 'antd';
import { connect } from 'dva';
import { Link, hashHistory } from 'dva/router';
import { routerCfg } from '../../constants';
import Breadcrumb from '../Breadcrumb';
// import { routerCfg, getNavigation } from '../../constants';
import userImg from '../../assets/images/username.png';
import styles from './style.less';

class Header extends React.Component {
  logout() {
    this.props.dispatch({ type: 'session/logout' });
  }
  render() {
    const { session, location } = this.props;
    // const { pathname } = this.props.location;
    return (
      <div>
        <div style={{ height: 50 }}></div>
      <header className={styles.header}>
        <span className={styles.logo} />
        {/* <Menu
          className={styles.navi}
          mode="horizontal"
          selectedKeys={[pathname.split('/')[1] || 'overview']}
        >
          {getNavigation().map((item) => {
            return (
              <Menu.Item
                key={item.key}
              >
                <Link to={`/${item.key}`}>
                  {item.icon ? <Icon type={item.icon} /> : ''}
                  {item.name}
                </Link>
              </Menu.Item>
            );
          })}
        </Menu> */}
        <span className={styles.user}>
          <span className={styles.message}>
            <Badge dot >
              <Icon type="message" style={{ color: '#c39223', marginRight: 5 }} />
              <a onClick={() => hashHistory.push('/message')} className={styles.text}>消息</a>
            </Badge>
          </span>
          <span className={styles.img}><img src={userImg} role="presentation" /></span>
          <span className={styles.name}>{session.username}</span>
          {/* <span className={styles.mr10}><Icon type="lock" /> <Link to="/lock">修改密码</Link></span> */}
          <span style={{ marginLeft: 20 }}><Icon type="logout" /> <span onClick={this.logout.bind(this)}><Link to={`/${routerCfg.LOGIN}`}>安全退出</Link></span></span>
        </span>

        <Breadcrumb location={location} />
      </header>
      </div>
    );
  }
}


function mapStateToProps({ session }) {
  return { session };
}

export default connect(mapStateToProps)(Header);
