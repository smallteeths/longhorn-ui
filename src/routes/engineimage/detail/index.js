import React, { PropTypes } from 'react'
import { Row, Col, Card } from 'antd'
import EngineImageInfo from './EngineImageInfo'
import { connect } from 'dva'

function EngineImageDetail({ engineimage, engineimageId }) {
  const selectedEngineImage = engineimage.data.find(item => item.id === engineimageId)
  if (!selectedEngineImage) {
    return (<div></div>)
  }
  const engineImageProps = {
    selectedEngineImage,
  }
  const bodyStyle = {
    bodyStyle: {
      height: 360,
      background: '#fff',
    },
  }
  return (
    <div>
      <Row gutter={24}>
        <Col md={24} xs={24}>
          <Card title="Enging Image Detail" bordered={false} {...bodyStyle}>
            <EngineImageInfo {...engineImageProps} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

EngineImageDetail.propTypes = {
  engineimage: PropTypes.object,
  engineimageId: PropTypes.string,
}

export default connect(({ engineimage }, { params }) => ({ engineimage, engineimageId: params.id }))(EngineImageDetail)
