import React, { Component } from 'react';
import { connect } from 'dva';
import HeaderView from './components/HeaderView';
import ExceptionTips from './components/ExceptionTips';
import DataView from './components/DataView';
import TodayOrder from './components/TodayOrder';
import TodayDeliver from './components/TodayDeliver';
import Schedule from './components/Schedule';
import Title from './components/Title';

import styles from './style.less';

class Overview extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    this.props.dispatch({ type: 'session/queryIndexData' });
    this.props.dispatch({ type: 'session/querySiteMsg' });
    // this.props.dispatch({ type: 'session/readMsg', payload: { id: 15 } });
  }
  render() {
    const { overviewInfo } = this.props;
    const { msgList = [] } = overviewInfo;
    return (
      <div className={styles.overview}>
        <HeaderView info={overviewInfo} />
        {/* <ExceptionTips info={overviewInfo} /> */}
        <div>
          <div style={{ width: '70%', float: 'left', marginRight: '5%' }}>
            <DataView info={overviewInfo} />
          </div>
          <div className={styles.fr}>
            <div className={styles.mb20}>
              <Title title="今日采购任务" icon="sync" />
              <div className={styles.purchase}>
                <ul>
                  <li>
                    <a>
                      <div className={styles.count}>{overviewInfo.todayPurOrderNum || 0}</div>
                      <div className={styles.title}>今日采购订单数</div>
                    </a>
                  </li>
                  <li>
                    <a>
                      <div className={styles.count}>{overviewInfo.todayPurItemNum || 0}</div>
                      <div className={styles.title}>今日已采购商品数</div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.mb20}>
              <Title title="今日入库数" icon="sync" />
              <div className={styles.inventory}>
                <ul>
                  <li>
                    <a>
                      <div className={styles.count}>{overviewInfo.balancedItemNum || 0}</div>
                      <div className={styles.title}>入预报商品</div>
                    </a>
                  </li>
                  <li>
                    <a>
                      <div className={styles.count}>{overviewInfo.inItemNum || 0}</div>
                      <div className={styles.title}>已入库商品</div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {/* <TodayOrder info={overviewInfo} /> */}
          </div>
        </div>
        <div>
          <div style={{ width: '70%', float: 'left', marginRight: '5%' }}>
            <TodayDeliver data={overviewInfo.todaySendOrder} />
          </div>
          <div style={{ width: '25%', float: 'right' }}>
            <Schedule info={overviewInfo} msgList={msgList} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ session }) {
  return {
    overviewInfo: session.overviewInfo,
    msgList: session.msgList
  };
}

export default connect(mapStateToProps)(Overview);

