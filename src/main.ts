import './style.css'
import { runTests } from './tests/tests'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>MxUnitTesting</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`

runTests()