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
    // console.log(overviewInfo);
    const { msgList = [] } = overviewInfo;
    const { data ={}} = overviewInfo;
    return (
      <div className={styles.overview}>
      <Title title="订单"  />
      <HeaderView info={overviewInfo} />
      <div>
         
          <div className={styles.fr}>
            <div className={styles.mb20}>
              <Title title="发货"  />
              <div className={styles.purchase}>
                <ul>
                  <li>
                    <a href="/#/sale/erpOrder">
                      <div className={styles.count}>{data.waitSendOrderNum || 0}</div>
                      <div className={styles.title}>待发货订单数</div>
                    </a>
                  </li>
                  <li>
                    <a>
                      <div className={styles.count}>{data.todaySendNum || 0}</div>
                      <div className={styles.title}>今日发货包裹数</div>
                    </a>
                  </li>
                  <li>
                    <a>
                      <div className={styles.count}>{data.weekSendNum || 0}</div>
                      <div className={styles.title}>一周发货包裹数</div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.mb21}>
              <Title title="售后"  />
              <div className={styles.inventory}>
                <ul>
                  <li>
                    <a href="/#/sale/returnOrder">
                      <div className={styles.count1}>{data.returningOrderNum || 0}</div>
                      <div className={styles.title}>未完成售后订单数</div>
                    </a>
                  </li>
                  
                </ul>
              </div>
            </div>
            {/* <TodayOrder info={overviewInfo} /> */}
          </div>
        </div>
         <div style={{ width: '100%', float: 'left',  }}>
            <DataView info={overviewInfo} />
          </div>
        {/* <div>
          <div style={{ width: '70%', float: 'left', marginRight: '5%' }}>
            <TodayDeliver data={overviewInfo.todaySendOrder} />
          </div>
          <div style={{ width: '25%', float: 'right' }}>
            <Schedule info={overviewInfo} msgList={msgList} />
          </div>
        </div> */}
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

