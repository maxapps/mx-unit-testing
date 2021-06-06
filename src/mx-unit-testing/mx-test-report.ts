import MxTest from './private/mx-test'


export default class MxTestReport {

  constructor(config: MxTestReportConfig = {}) {
    if (config.styles) {
      config.styles.forEach(styleDef => this.#styles[styleDef[0]] = styleDef[1])
    }
  }


  // PUBLIC ============================================================================================================

  // report(title: string, tests: MxTest[]) {
  report(title: string, tests: MxTest[], todos: string[]) {
    const s = this.#styles
    let success = 0, total = 0

    tests.forEach(test => {
      success += test.successCount
      total += test.totalCount
    })

    this._out(`%c${title}`, s.Suite)

    tests.forEach(test => {
      this._grp(`%c${test.title}`, test.successCount === test.totalCount ? s.Test : `${s.Test};${s.colorFailure}`)
      this._out(`%cTests: %c${test.successCount} passed, %c${test.totalCount} total`,
          s.TestResults, test.successCount === test.totalCount ? '~' : `~${s.colorFailure}`, '~')
      test.failures.forEach(failure => {
        this._out(`%c${failure.matcher}[${failure.index}]: ${MxTest.errorMessasges[failure.matcher](failure.args)}`,
            s.Failure)
      })
      console.groupEnd()
    })

    this._out(`%cTests: %c${success} passed, %c${total} total`,
        s.SuiteResults, success === total ? '~' : `~${s.colorFailure}`, '~')

        if (todos.length > 0) {
      this._grp('%cToDo:', `${this.#styles.colorTodo};${this.#styles.Todo}`)
      todos.forEach(todo => this._out(`%c${todo}`, this.#styles.colorTodo))
    }
  }


  // PRIVATE ===========================================================================================================

  #styles = {
    Failure: 'color:red',
    Suite: 'font-size:20px;margin-top:16px',
    SuiteResults: 'font-size:16px;margin-top:16px',
    Test: 'color:gray;font-size:16px',
    TestResults: 'font-size:14px',
    Todo: 'font-size:16px',
    colorFailure: 'color:red',
    colorSuccess: 'color:green',
    colorTodo: 'color:orange'
  }


  _grp(title: string, ...args: string[]) {
    console.group(title, ...this._parseStyles(...args))
  }


  _out(msg: string, ...args: string[]) {
    console.log(msg, ...this._parseStyles(...args))
  }


  _parseStyles(...args: string[]): string[] {
    return args.map(style => {
      if (style.charAt(0) === '~') style = `${args[0]};${style.substr(1)}`
      return style
    })
  }


  // STATIC ============================================================================================================


}


export interface MxTestReportConfig {
  styles?: [MxTestReportUnit, string][]
}


export type MxTestReportUnit = 'Suite' | 'Test'