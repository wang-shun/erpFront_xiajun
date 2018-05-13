import React, { Component } from 'react';
import styles from '../style.less';
import Title from './Title';
import { Chart, Axis, Geom, Tooltip } from 'bizCharts';

export default class HeaderView extends Component {
  renderItem({ count, title }) {
    return (
      <li>
        <a>
          <div className={styles.count}>{count}</div>
          <div className={styles.title}>{title}</div>
        </a>
      </li>
    );
  }
  render() {
    const { weekSales = {} } = this.props.info || {};
        const data = [
          { year: '周一', sales: weekSales.oneDayNumber },
          { year: '周二', sales: weekSales.twoDayNumber },
          { year: '周三', sales: weekSales.threeDayNumber },
          { year: '周四', sales: weekSales.fourDayNumber },
          { year: '周五', sales: weekSales.fiveDayNumber },
          { year: '周六', sales: weekSales.sixDayNumber },
          { year: '周日', sales: weekSales.sevenDayNumber },
        ];
        const cols = {
          'sales': {tickInterval: 20},
        };
    return (
      <div className={styles.data}>
        <Title title="数据看板" />
        <Chart height={350} data={data} scale={cols} forceFit>
            <Axis name="year" />
            <Axis name="sales" />
            <Tooltip crosshairs={{type : "y"}}/>
            <Geom type="interval" position="year*sales" color="#00cbd7" style={{ lineWidth: 0 }} />
          </Chart>
      </div>
    );
  }
}
