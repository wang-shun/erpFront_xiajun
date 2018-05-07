import React, { Component } from 'react';

class ReportSaleRefund extends Component {
  render() {
    return (
      <div>
        <iframe src={`http://${location.host}/bi/sale/selectRefundReport`} width="1024" height="1280" scrolling="yes" />
      </div>
    );
  }
}

export default ReportSaleRefund;
