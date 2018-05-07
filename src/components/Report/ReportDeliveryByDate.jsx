import React, { Component } from 'react';

class ReportDeliveryByDate extends Component {
  render() {
    return (
      <div>
        <iframe src={`http://${location.host}/bi/ship/selectBiDeliveryReportByGmtCreate`} width="960" height="1280" scrolling="yes" />
      </div>
    );
  }
}

export default ReportDeliveryByDate;
