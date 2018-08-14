import React, { Component } from 'react';
import styles from '../style.less';
import Title from './Title';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';

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
    const { weekSales = {} } = this.props.info;
    const { data = {} } = this.props.info;
    // console.log(data.dataList[0].date)
    //console.log(data)
  //   const { dataList=[] } = data;
  //   //console.log(dataList)
  //  // console.log(dataList[0])
  //   let result = dataList[0];
  //   //console.log(result)
  //   if (result) {
  //     result = result.salesVolume
  //     //console.log(result)
  //   }
  //   console.log(result)
    // const { dataList = [] } = data;
    // const { result = {} } = dataList[0];
    // console.log(result)
        const datas = [
          { "日期": data.firstDay, "销售额": data.firstSales },
          { "日期": data.secondDay, "销售额": data.secondSales },
          { "日期": data.thirdDay, "销售额": data.thirdSales },
          { "日期": data.fourthDay, "销售额": data.fourthSales },
          { "日期": data.fifthDay, "销售额": data.fifthSales },
          { "日期": data.sixthDay, "销售额": data.sixthSales },
          { "日期": data.seventhDay, "销售额": data.seventhSales },
        ];
        const cols = {
          '销售额': {tickInterval: 20},
        };
    return (
      <div>
        <Title title="数据看板：一周销售额" />
        <Chart height={350} data={datas} scale={cols} width={800} >
            <Axis name="日期" title/>
            <Axis name="销售额" title/>
            <Legend position="top" dy={-20} />
            <Tooltip crosshairs={{type : "y"}}/>
            <Geom size={15} type="interval" position="日期*销售额" color="#00cbd7" style={{ lineWidth: 0, marginLeft: 0 }} />
        </Chart>
      </div>
    );
  }
}














