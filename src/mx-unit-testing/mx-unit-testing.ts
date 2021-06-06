import { _clear, _delayedClear, _skip} from './private/describe-members'
import MxExpect from './private/mx-expect'
import MxTestSuite from "./private/mx-test-suite"

const VERSION = '1.0.0'


/**
 * Creates a block that groups together several related tests. For example, if you have a **myBeverage** object that is 
 * supposed to be delicious but not sour, you could test it with:
 * 
 * ```typescript
 *  const myBeverage = {
 *    delicious: true,
 *    sour: false,
 *  }
 * 
 *  describe('my beverage', () => {
 *    test('is delicious', () => {
 *      expect(myBeverage.delicious).toBeTruthy()
 *    })
 * 
 *    test('is not sour', () => {
 *      expect(myBeverage.sour).toBeFalsy();
 *    });
 *  })
 * ```
 *
 * @param title Title describing the suite of tests.
 * @param func  Function which contains the actual tests.
 */
export function describe(title: string, func: () => void) {
  _suite = new MxTestSuite(title, func)
  _suite.execute()
  _suite.close()
}


// Additional members for the describe function.
describe.clear = _clear
describe.delayedClear = _delayedClear
describe.skip = _skip


/**
 * The expect function is used every time you want to test a value. You will rarely call expect by itself. Instead, you 
 * will use expect along with a "matcher" function to assert something about a value.
 * 
 * It's easier to understand this with an example. Let's say you have a method **bestLaCroixFlavor()** which is 
 * supposed to return the string **'grapefruit'**. Here's how you would test that:
 * 
 * ```typescript
 *  test('the best flavor is grapefruit', () => {
 *    expect(bestLaCroixFlavor()).toBe('grapefruit')
 *  })
 * ```
 * 
 * In this case, [[toBe]] is the matcher function. There are a lot of different matcher functions to help you test 
 * different things.
 * 
 * The argument to **expect** should be the value that your code produces, and any argument to the matcher should be 
 * the correct value.
 *
 * @param value The value to test.
 * @returns An instance of MxEpectation.
 */
 export function expect(value: any): MxExpect {
  if (!_suite) throw new Error(`Function <expect> called outside of suite`)
  if (!_suite.inTest) throw new Error(`Function <expect> called outside of test`)
  return new MxExpect(_suite, value)
}


/**
 * Creates a test which is simply a container for a series of expectations
 *
 * @param title Title for the test.
 * @param func  Function which contains one or more calls to [[expectation]].
 */
export function test(title: string, func: (...args:any[]) => void) {
  if (!_suite) throw new Error(`Test <${title}> created outside of suite`)

  _suite.addTest(title, func)
  // _suite.addTest(title, func, argList)
}

// Additional members for the test function.

test.each = function(table: any[][]): (title: string, func: (...args:any[]) => void) => void {
  return function _testEach(title: string, func: (...args:any[]) => void) {
    _suite.addTest(title, func, table)
  }
}

test.skip = function(title: string, func: (...args:any[]) => void) {
  // do nothing, thus skip
}

test.todo = function(title: string) {
  _suite.addTodo(title)
}


/**
 * Simply returns the version of MxUnitTesting.
 *
 * @returns A string with the version number for this version of the library.
 */
export function version() {
  return VERSION
}


let _suite: MxTestSuite