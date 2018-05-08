import React from 'react';
import { Icon } from 'antd';
// import { Menu, Icon } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
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
          <span className={styles.message}><Icon type="message" style={{ color: '#c39223', marginRight: 5 }} /> <span className={styles.text}>消息</span></span>
          <span className={styles.img}><img src={userImg} role="presentation" /></span>
          <span className={styles.name}>{session.username}</span>
          {/* <span className={styles.mr10}><Icon type="lock" /> <Link to="/lock">修改密码</Link></span> */}
          <span style={{ marginLeft: 20 }}><Icon type="logout" /> <span onClick={this.logout.bind(this)}><Link to={`/${routerCfg.LOGIN}`}>安全退出</Link></span></span>
        </span>

        <Breadcrumb location={location} />
      </header>
    );
  }
}


function mapStateToProps({ session }) {
  return { session };
}

export default connect(mapStateToProps)(Header);
