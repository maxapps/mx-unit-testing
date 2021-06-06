import MxTest, { MxTestMatcher } from './mx-test'
import MxTestReport from '../mx-test-report'


export default class MxTestSuite {
  
  constructor(title: string, func: () => void) {
    this.#title = title
    this.#tests = []
    this.#todos = []
    this.#func =  func
  }

  
  // PUBLIC ============================================================================================================

  addTest(title: string, func: (args?:any[]) => void, argList?: any[][]) {
    if (this.#curTest) this.#curTest.close()

    this.#curTest = new MxTest(title)
    this.#tests.push(this.#curTest)

    if (argList) {
      argList.forEach(args => func(...args))
    } else {
      func()
    }
  }


  addTodo(title: string) {
    this.#todos.push(title)
  }


  close() {
    this.#curTest?.close()
    new MxTestReport().report(this.#title, this.#tests, this.#todos)
  }


  execute() {
    this.#func()
  }


  get inTest(): boolean {
    return this.#curTest !== undefined
  }


  get nextExpectIndex(): number {
    return this.#curTest!.nextExpectIndex
  }


  report(index: number, matcher: MxTestMatcher, success: boolean, args: any[]) {
    this.#curTest?.report({index, matcher, success, args})
  }


  // PRIVATE ===========================================================================================================

  #curTest?: MxTest
  #func: () => void
  #tests: MxTest[]
  #todos: string[]
  #title: string

}
