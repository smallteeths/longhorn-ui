import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Tooltip } from 'antd'
import styles from './Footer.less'
import { config } from '../../utils'
import { getStatusIcon } from '../../utils/websocket'
import upgradeIcon from '../../assets/images/upgrade.svg'
import semver from 'semver'
import BundlesModel from './BundlesModel'

function Footer({ app, host, volume, setting, engineimage, eventlog, backingImage, dispatch }) {
  const { bundlesropsVisible, bundlesropsKey, okText, modalButtonDisabled, progressPercentage } = app
  const currentVersion = config.version === '${VERSION}' ? 'dev' : config.version // eslint-disable-line no-template-curly-in-string
  const issueHref = 'https://github.com/longhorn/longhorn/issues/new/choose'

  const { data } = setting
  let checkUpgrade = false
  let latestVersion = ''
  data.forEach(option => {
    switch (option.id) {
      case 'upgrade-checker':
        checkUpgrade = option.value === 'true'
        break
      case 'latest-longhorn-version':
        latestVersion = option.value
        break
      default:
        break
    }
  })
  let versionTag = false
  semver.valid(currentVersion) && semver.valid(latestVersion) ? versionTag = semver.lt(currentVersion, latestVersion) : versionTag = false
  let upgrade = ''
  if (checkUpgrade && currentVersion !== 'dev' && latestVersion !== '' && versionTag) {
    const upgradeTooltip = `Longhorn ${latestVersion} is now available!`
    upgrade = (
      <Tooltip placement="topLeft" title={upgradeTooltip}>
        <img src={upgradeIcon} alt="Upgrade"></img>
      </Tooltip>
    )
  }

  const createBundlesrops = {
    item: {},
    visible: bundlesropsVisible,
    okText,
    modalButtonDisabled,
    progressPercentage,
    onOk(datas) {
      dispatch({
        type: 'app/changeOkText',
        payload: datas,
      })
      dispatch({
        type: 'app/supportbundles',
        payload: datas,
      })
    },
    onCancel() {
      dispatch({
        type: 'app/hideBundlesModel',
      })
    },
  }

  const showBundlesModel = () => {
    dispatch({
      type: 'app/showBundlesModel',
    })
  }

  return (
    <div className={styles.footer}>
      <Row type="flex" justify="space-between">
        <Col>
          {upgrade}
          <a>{currentVersion}</a>
          <a target="blank" href="https://longhorn.io/docs">Documentation</a>
          <a target="blank" onClick={showBundlesModel}>Generate Support Bundle</a>
          <a target="blank" href={issueHref}>File an Issue</a>
          <a target="blank" href="https://slack.cncf.io/">Slack</a>
        </Col>
        <Col>
          {getStatusIcon(volume)}
          {getStatusIcon(host)}
          {getStatusIcon(setting)}
          {getStatusIcon(engineimage)}
          {getStatusIcon(eventlog)}
          {getStatusIcon(backingImage)}
        </Col>
        <BundlesModel key={bundlesropsKey} {...createBundlesrops} />
      </Row>
    </div>
  )
}

Footer.propTypes = {
  host: PropTypes.object,
  volume: PropTypes.object,
  setting: PropTypes.object,
  engineimage: PropTypes.object,
  eventlog: PropTypes.object,
  backingImage: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ app, host, volume, setting, engineimage, eventlog, backingImage }) => ({ app, host, volume, setting, engineimage, eventlog, backingImage }))(Footer)
