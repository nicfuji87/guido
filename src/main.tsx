import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import '@/styles/index.css'
import Routes from '@/app/routes'

ReactDOM.render(
  <StrictMode>
    <Routes />
  </StrictMode>,
  document.getElementById('root')
)


