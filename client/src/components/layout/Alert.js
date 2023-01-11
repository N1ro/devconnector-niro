import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//'alerts' destructured from 'mapStateToProps'
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.prototype = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  // 'alerts' - is the key will be used in react component (ie. here)
  // 'state.alert' is extracted from root reducer, see /src/reduces/index.js
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
