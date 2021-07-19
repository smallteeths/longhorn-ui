import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Progress, Tooltip, Card } from 'antd'
import DiskStateMapActions from './DiskStateMapActions'
import { ModalBlur, DropOption } from '../../components'
import style from './BackingImage.less'
const confirm = Modal.confirm

// As the back-end field changes from diskStateMap to diskFileStatusMap
// The data has been changed to be taken from diskFileStatusMap.
// Many methods and components are named using the diskStateMap naming style, If changing this requires a lot of work.
// So the naming of some components and methods have not been changed to diskFileStatusMap

const modal = ({
  visible,
  selected,
  backingImages,
  onCancel,
  deleteDisksOnBackingImage,
  selectedRows,
  rowSelection,
  diskStateMapDeleteDisabled,
  diskStateMapDeleteLoading,
}) => {
  const modalOpts = {
    title: 'Check details & Operate files in disks',
    visible,
    onCancel,
    hasOnCancel: true,
    width: 680,
    maxHeight: 800,
    style: {
      top: 0,
    },
    okText: 'Close',
    footer: null,
    bodyStyle: { padding: '0px' },
  }

  const handleMenuClick = (record, event) => {
    switch (event.key) {
      case 'delete':
        confirm({
          title: `Are you sure to delete the images image file from the disk ${record.disk} ?`,
          onOk() {
            deleteDisksOnBackingImage([record])
          },
        })
        break
      default:
    }
  }

  // update detail list
  let currentData = backingImages.find((item) => {
    return item.id === selected.id
  })

  const dataSource = currentData && currentData.diskFileStatusMap ? Object.keys(currentData.diskFileStatusMap).map((key) => {
    let diskFileStatusMap = currentData.diskFileStatusMap[key]

    return {
      status: diskFileStatusMap.state,
      disk: key,
      progress: currentData.diskFileStatusMap[key] && currentData.diskFileStatusMap[key].progress ? parseInt(currentData.diskFileStatusMap[key].progress, 10) : 0,
    }
  }) : []

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      className: 'active',
      render: (text, record) => {
        return (
          <div>
            { text === 'downloading' ? <Tooltip title={`${record.progress}%`}><div><Progress showInfo={false} percent={record.progress} /></div></Tooltip> : ''}
            <div>{text}</div>
          </div>
        )
      },
    }, {
      title: 'Disk',
      dataIndex: 'disk',
      key: 'disk',
      render: (text) => {
        return (
          <div>{text}</div>
        )
      },
    }, {
      title: 'Operation',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return (
          <DropOption menuOptions={[
            { key: 'delete', name: 'Delete' },
          ]}
            onMenuClick={e => handleMenuClick(record, e)}
          />
        )
      },
    },
  ]

  const diskStateMapProps = {
    selectedRows,
    deleteButtonDisabled: diskStateMapDeleteDisabled,
    deleteButtonLoading: diskStateMapDeleteLoading,
    deleteDisksOnBackingImage,
  }

  const pagination = true

  return (
    <ModalBlur {...modalOpts}>
      <div style={{ width: '100%', overflow: 'auto', padding: '10px 20px 10px' }}>
        <div className={style.backingImageModalContainer}>
          <Card>
            <div className={style.parametersContainer} style={{ marginBottom: 0 }}>
              <div>Created From: </div>
              <span>{currentData.sourceType ? currentData.sourceType.toUpperCase() : currentData.sourceType}</span>
              <div style={{ textAlign: 'left' }}>Parameters During Creation:</div>
            </div>
            <div style={{ width: '90%', marginLeft: 20 }}>
              {currentData.parameters ? Object.keys(currentData.parameters).map((key) => {
                return <div style={{ display: 'flex', padding: 5 }} key={key}>
                  <div style={{ width: 60 }}>{key ? key.toUpperCase() : key }:</div>
                  <div style={{ marginLeft: 10 }}>{currentData.parameters[key]}</div>
                </div>
              }) : ''}
            </div>
          </Card>
          <Card>
            <div className={style.parametersContainer}>
              <div style={{ textAlign: 'left' }}>Expected SHA512 Checksum:</div>
              <span>{currentData.expectedChecksum ? currentData.expectedChecksum : ''}</span>
              <div style={{ textAlign: 'left' }}>Current SHA512 Checksum:</div>
              <span>{currentData.currentChecksum ? currentData.currentChecksum : ''}</span>
            </div>
          </Card>
        </div>
        <div style={{ marginBottom: 12 }}>
          <DiskStateMapActions {...diskStateMapProps} />
        </div>
        <Table
          bordered={false}
          columns={columns}
          dataSource={dataSource}
          simple
          size="small"
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey={record => record.disk}
        />
      </div>
    </ModalBlur>
  )
}

modal.propTypes = {
  visible: PropTypes.bool,
  diskStateMapDeleteDisabled: PropTypes.bool,
  diskStateMapDeleteLoading: PropTypes.bool,
  selected: PropTypes.object,
  backingImages: PropTypes.array,
  onCancel: PropTypes.func,
  selectedRows: PropTypes.array,
  deleteDisksOnBackingImage: PropTypes.func,
  rowSelection: PropTypes.object,
}

export default modal
