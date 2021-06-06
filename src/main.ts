import { version } from './mx-unit-testing/mx-unit-testing'
import './style.css'
import { runTests } from './tests/tests'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
<h1>MxUnitTesting</h1>
<span style="font-size:smaller">version ${version()}
  
<p>Unit tests run automatically.
<br/><br/>
Open <b>Dev Tools</b> to see test results.</p>
`

runTests()