import React, { Component } from 'react';

class ReportShippingByDay extends Component {
  render() {
    return (
      <div>
        <iframe src={`http://${location.host}/bi/freight/selectBiFreightByGmtCreate`} width="100%" height="1280" scrolling="yes" />
      </div>
    );
  }
}

export default ReportShippingByDay;
