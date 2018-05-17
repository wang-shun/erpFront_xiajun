import React, { Component } from 'react';
import styles from '../style.less';
import Title from './Title';


export default class HeaderView extends Component {
  render() {
    const { msgList } = this.props;
    // console.log(msgList);
    const list = msgList ? msgList.map((el) => <div className={styles.item}>
      <div className={styles.title} >【{el.siteMsg.title}】</div>
      {/* <div className={styles['content-title']}></div> */}
      <div className={styles.content}>{el.siteMsg.content}</div>
      <div className={styles.time}>{el.siteMsg.gmtCreate}</div>
    </div>) : [];
    return (
      <div className={styles.schedule}>
        <Title title="待办事项" icon="sync" />
        <div className={styles['schedule-content']}>
        {list}
        </div>
      </div>
    );
  }
}
