import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Tooltip } from 'antd'
import style from './HostBulkActions.less'

const confirm = Modal.confirm

function bulkActions({ selectedRows, bulkDeleteHost }) {
  const handleClick = (action) => {
    switch (action) {
      case 'delete':
        confirm({
          title: `Are you sure you want to delete node(s) ${selectedRows.map(item => item.name).join(', ')} ?`,
          onOk() {
            bulkDeleteHost(selectedRows)
          },
        })
        break
      default:
    }
  }

  const allActions = [
    { key: 'delete',
      name: 'Delete',
      disabled() {
        return (selectedRows.length === 0 || selectedRows.some((item) => {
          if (item && item.status && item.status.key !== 'down') {
            return true
          }
          return false
        }))
      },
    },
  ]

  const message = selectedRows.length === 0 || selectedRows.some((item) => {
    if (item && item.status && item.status.key !== 'down') {
      return true
    }
    return false
  }) ? 'Kubernetes node must be deleted first' : ''

  return (
    <div className={style.bulkActions}>
      { allActions.map(item => {
        return (
          <div key={item.key}>
            &nbsp;
            <Tooltip title={`${message}`}>
              <Button size="large" type="primary" disabled={item.disabled()} onClick={() => handleClick(item.key)}>{ item.name }</Button>
            </Tooltip>
          </div>
        )
      }) }
    </div>
  )
}

bulkActions.propTypes = {
  selectedRows: PropTypes.array,
  bulkDeleteHost: PropTypes.func,
}

export default bulkActions
