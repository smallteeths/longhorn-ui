import React from 'react'
import PropTypes from 'prop-types'
import { Router, Switch, Route, Redirect } from 'dva/router'
import dynamic from 'dva/dynamic'
import appComponent from './routes/app.js'
import dashboardComponent from './routes/dashboard/'
import volumeComponent from './routes/volume/'
import nodeComponent from './routes/host/'
import volumeDetailComponent from './routes/volume/detail'
import backupComponent from './routes/backup/'
import backupDetailComponent from './routes/backup/BackupDetail'
import settingComponent from './routes/setting/'
import engineimageComponent from './routes/engineimage/'
import engineimageDetailComponent from './routes/engineimage/detail'

const Routers = function ({ history, app }) {
  const App = dynamic({
    app,
    component: () => appComponent,
  })

  const dashboard = dynamic({
    app,
    component: () => dashboardComponent,
  })

  const node = dynamic({
    app,
    component: () => nodeComponent,
  })

  const volume = dynamic({
    app,
    component: () => volumeComponent,
  })

  const volumeDetail = dynamic({
    app,
    component: () => volumeDetailComponent,
  })

  const backup = dynamic({
    app,
    component: () => backupComponent,
  })

  const backupDetail = dynamic({
    app,
    component: () => backupDetailComponent,
  })

  const setting = dynamic({
    app,
    component: () => settingComponent,
  })

  const engineimage = dynamic({
    app,
    component: () => engineimageComponent,
  })

  const engineimageDetail = dynamic({
    app,
    component: () => engineimageDetailComponent,
  })

  const path = '/'

  return (
    <Router history={history}>
      <Switch>
        <App path={path} component={App}>
          <Route exact path={path} render={() => <Redirect to={`${path}dashboard`} />} />
          <Route path={`${path}dashboard`} component={dashboard} />
          <Route path={`${path}node`} component={node} />
          <Route path={`${path}volume`} component={volume} />
          <Route path={`${path}volume/:id`} component={volumeDetail} />
          <Route path={`${path}backup`} component={backup} />
          <Route path={`${path}backup/:id`} component={backupDetail} />
          <Route path={`${path}setting`} component={setting} />
          <Route path={`${path}engineimage`} component={engineimage} />
          <Route path={`${path}engineimage/:id`} component={engineimageDetail} />
        </App>
      </Switch>
    </Router>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
