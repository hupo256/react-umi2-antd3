import React, { Component } from 'react'
import { connect } from 'dva'

import EnterpriseMessage from '../../WebSetting/EnterpriseMessage'
import '../../WebSetting/WebSetting.less'

@connect(({ WebSettingStroe }) => ({
  WebSettingStroe,
}))
class WebSettingOut extends Component {
  render() {
    return <EnterpriseMessage {...this.props} />
  }
}

export default WebSettingOut
