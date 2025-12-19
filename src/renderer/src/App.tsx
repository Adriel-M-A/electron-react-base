import { HashRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'

function App(): React.ReactElement {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="*" element={<div className="p-10">Página no encontrada</div>} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
