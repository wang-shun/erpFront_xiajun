import React, { Component } from 'react';

class SaleReportByCategory extends Component {
  render() {
    return (
      <div>
        <iframe src={`http://${location.host}/bi/sale/selectSaleReportByCategoryName`} width="960" height="1280" scrolling="yes" />
      </div>
    );
  }
}

export default SaleReportByCategory;
