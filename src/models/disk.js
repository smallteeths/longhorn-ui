import { query, disconnectNode, connectNode, createDisk, deleteDisk, updateDisk } from '../services/disk'
import { wsChanges } from '../utils/websocket'

export default {
  namespace: 'disk',
  state: {
    data: [],
    selectedDisk: {},
    addDiskModalVisible: false,
    connectNodeModalVisible: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        dispatch({
          type: 'query',
          payload: {},
        })
      })
      wsChanges(dispatch, 'disks', '1s')
    },
  },
  effects: {
    *query({
      payload,
    }, { call, put }) {
      const data = yield call(query, payload)

      yield put({ type: 'queryDisk', payload: { ...data } })
    },
    // disk actions
    *disconnectNode({
      payload,
    }, { call, put }) {
      yield call(disconnectNode, { url: payload.actions.disconnect })
      yield put({ type: 'query' })
    },
    *connectNode({
      payload,
    }, { call, put }) {
      yield put({ type: 'hideConnectNodeModal' })
      yield call(connectNode, { url: payload.url, name: payload.name, path: payload.path })
      yield put({ type: 'query' })
    },
    *createDisk({
      payload,
    }, { call, put }) {
      yield put({ type: 'hideAddDiksModal' })
      yield call(createDisk, payload)
      yield put({ type: 'query' })
    },
    *updateDisk({
      payload,
    }, { call, put }) {
      yield put({ type: 'hideEditDiskModal' })
      yield call(updateDisk, payload)
      yield put({ type: 'query' })
    },
    *deleteDisk({
      payload,
    }, { call, put }) {
      yield call(deleteDisk, payload)
      yield put({ type: 'query' })
    },
  },
  reducers: {
    queryDisk(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    updateBackground(state, action) {
      const data = action.payload
      data.data = data.data || []
      return {
        ...state,
        ...data,
      }
    },
    showAddDiksModal(state) {
      return { ...state, addDiskModalVisible: true }
    },
    hideAddDiksModal(state) {
      return { ...state, addDiskModalVisible: false }
    },
    showConnectNodeModal(state, action) {
      return { ...state, ...action.payload, connectNodeModalVisible: true }
    },
    hideConnectNodeModal(state) {
      return { ...state, connectNodeModalVisible: false }
    },
    showEditDiskModal(state, action) {
      return { ...state, ...action.payload, editDiskModalVisible: true }
    },
    hideEditDiskModal(state) {
      return { ...state, editDiskModalVisible: false }
    },
  },
}
