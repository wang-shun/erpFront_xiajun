import React, {Component} from 'react';
import {
  Row,
  Form,
  Table,
  Input,
  Modal
} from 'antd';

const FormItem = Form.Item;

class SkuChannelTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skuChannelPrice : [],
    };
  }

  skuOKs() {
    // const {oldPriceLists} = this.props;
    // console.log("到了这里");
    // console.log(this.props);
    const { skuChannelPrice } = this.state;
    const { skuIndexs } = this.props;
    // console.log(".......")
    // for(var att in oldPriceLists) {
    //   console.log(att+".........."+oldPriceLists[att])
    // }
    // console.log(oldPriceLists==undefined)
    // console.log(".......")
    // console.log("&&&&:"+skuIndexs)
    // console.log(this.props.skuIndex);
    
    this.props.form.validateFieldsAndScroll((err, fieldsSku) => {
      if (err) return;
      // console.log("******************************************");
      // for(var j in fieldsSku) {
      //   console.log(j+":"+fieldsSku[j]);
      // }
      // console.log("******************************************");
      const keys = Object.keys(fieldsSku);
      // for(var j in keys) {
      //   console.log(j+":"+keys[j]);
      // }
      // const skuChannelPrice = [];
      let i = 0;
      let count = this.props.resourceList[i].channelName;
      keys.forEach((key) => {
        // console.log("a");
        if (key === `r_${count}channelName` && fieldsSku[key]) {
          i++;
          // skuChannelPrice.push({
            
          // });
          // console.log("b");
          var newPrice = {
            "channelName": fieldsSku[key],
            "salePrice": parseFloat(fieldsSku[`r_${count}_channelSalePrice`]),
            "skuIndex":this.props.skuIndexs
          };
          // console.log("c");
          // console.log("d:"+fieldsSku[`r_${count}_channelSalePrice`]);
          let oldPrice = skuChannelPrice;
          oldPrice.push(newPrice);
          this.setState({
            skuChannelPrice: oldPrice,
          })
          this.props.resourceList[i] && (count = this.props.resourceList[i].channelName);
        }
      });
      this.props.onOk(skuChannelPrice);
      // console.log("******************************************");
      // for(var att in skuChannelPrice[0]) {
      //   console.log(att+":"+skuChannelPrice[0][att]);
      // }
      // console.log("******************************************");
      // console.log("skuChannelPrice");
      // console.log(skuChannelPrice);
      // console.log(skuChannelPrice.length);
      // console.log("skuChannelPrice");
    });

  }

  render() {
    const {form} = this.props;
    const {oldPriceLists} = this.props;
  
    // console.log("......."+oldPriceLists.length)
    // console.log("))))))"+oldPriceLists[1].salePrice)
    //  for(var att in oldPriceLists[0]) {
    //   console.log(att+".........."+oldPriceLists[0][att])
    // }
   // console.log(oldPriceLists[0].salePrice)
    const {getFieldDecorator} = form;
    const authColumns = {
      columns: [
        {
          title: '分销渠道',
          dataIndex: 'channelName',
          key: 'channelName',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.channelName}channelName`, {initialValue: t || ''})(
                  <Input disabled placeholder="请填写分销渠道"/>)}
              </FormItem>
            );
          },
        },
        {
          title: '分销价格',
          dataIndex: 'salePrice',
          key: 'salePrice',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.channelName}_channelSalePrice`, {initialValue: t || ''})(
                  <Input placeholder="请填写分销价格"/>)}
              </FormItem>
            );
          },
        }
      ]
    };
    console.log(this.props);
    return <Modal visible={this.props.visible} onCancel={() => this.props.onCancel()} onOk={() => this.skuOKs()}>
      <Form>
        <Row>
          <Table
            {...authColumns}
            rowKey={record => record.channelName}
            pagination={false}
            dataSource={this.props.resourceList}
          />
        </Row>
      </Form>
    </Modal>;
  }

}

export default Form.create()(SkuChannelTable);
