import React from 'react'
import MetaAi from './src/MetaAi'
import { Provider } from 'react-redux'
import { persistor, store } from './src/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MetaAi/>
      </PersistGate>
    </Provider>
  )
}

export default App