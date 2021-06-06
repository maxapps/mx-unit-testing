import { expect } from "../mx-unit-testing"
import { MxTestMatcher } from "./mx-test"
import MxTestSuite from "./mx-test-suite"


export default class MxExpect {

  constructor(suite: MxTestSuite, value: any, not: boolean = false, index?: number) {
    this.#suite = suite
    this.#received = value
    this.#not = not
    this.#index = index === undefined ?  suite.nextExpectIndex : index

    if (typeof value === 'function') {
      try {
        value()
      } catch (error) {
        this.#error = error
      }
    }
  }

  // PUBLIC ============================================================================================================

  get not(): MxExpect {
    return new MxExpect(this.#suite, this.#received, true, this.#index)
  }


  // MATCHERS ==========================================================================================================

  /**
   * Use **toBe** to compare primitive values or to check referential identity of object instances. It calls 
   * **Object.is** to compare values, which is even better for testing than === strict equality operator.
   * 
   * **NOTE**: Don't use **toBe** with floating-point numbers. For example, due to rounding, in JavaScript 0.2 + 0.1 is 
   * not strictly equal to 0.3. If you have floating point numbers, try [[toBeCloseTo]] instead.
   * 
   * @param value Expected value,
   * 
   * @example
   * ```typescript
   *  describe.('My Tests', () => {
   *    test('.toBe test', () => {
   *      expect(2 + 3).toBe(5)
   *      expect(0.2 + 0.1).not.toBe(3)
   *      expect('Hello World'.substr(0, 5)).toBe('Hello')
   *    })
   * })
   * ```
   */
  toBe(value: any) {
    this._report('toBe', Object.is(this.#received, value), [this.#received, value])
  }


  /**
   * Use **toBeCloseTo** to compare floating point numbers for approximate equality.
   * 
   * The optional **digits** argument limits the number of digits to check after the decimal point. For the default 
   * value 2, the test criterion is Math.abs(expected - received) < 0.005 (that is, 10 ** -2 / 2).
   * 
   * Intuitive equality comparisons often fail, because arithmetic on decimal (base 10) values often have rounding 
   * errors in limited precision binary (base 2) representation. For example, this test fails:
   * ```typescript
   *  test('adding works sanely with decimals', () => {
   *    expect(0.2 + 0.1).toBe(0.3)   // Fails!
   *  })
   * ```
   * 
   * It fails because in Javascript, **0.2 + 0.1** is actually **0.30000000000000004**.
   * 
   * For example, this test passes with a precision of 5 digits:
   * ```typewscript
   *  test('adding works sanely with decimals', () => {
   *    expect(0.2 + 0.1).toBeCloseTo(0.3, 5)
   *  })
   * ```
   *
   * @param value Expected value.
   * @param digits  The number of digits to check **after** the decimal point.
   */
  toBeCloseTo(value: any, digits = 2) {
    const prec = 10 ** (digits * -1) / 2
    this._report('toBeCloseTo', Math.abs(this.#received - value) < prec, [this.#received, value])
  }


  /**
   * Use **toBeDefined** to check that a variable is not undefined. For example, if you want to check that a function 
   * **fetchNewFlavorIdea()** returns something, you can write:
   * ```typescript
   *  test('there is a new flavor idea', () => {
   *    expect(fetchNewFlavorIdea()).toBeDefined()
   *  })
   * ```
   * You could write **expect(fetchNewFlavorIdea()).not.toBe(undefined)**, but it's better practice to avoid referring 
   * to undefined directly in your code.
   */
  toBeDefined() {
    this._report('toBeDefined', this.#received !== undefined, [this.#received])
  }


  /**
   * Use **toBeFalsy** when you don't care what a value is and you want to ensure a value is false in a boolean 
   * context. For example, let's say you have some application code that looks like:
   * '''typescript
   *  drinkSomeLaCroix()
   *  if (!getErrors()) {
   *    drinkMoreLaCroix()
   *  }
   * ```
   * You may not care what **getErrors** returns, specifically - it might return false, null, or 0, and your code would 
   * still work. So if you want to test there are no errors after drinking some La Croix, you could write:
   * ```typescript
   *  test('drinking La Croix does not lead to errors', () => {
   *    drinkSomeLaCroix()
   *    expect(getErrors()).toBeFalsy()
   *  })
   * ```
   * In JavaScript, there are six falsy values: false, 0, '', null, undefined, and NaN. Everything else is truthy.
   */
  toBeFalsy() {
    this._report('toBeFalsy', !this.#received, [this.#received])
  }


  /**
   * Use **toBeGreaterThan** to compare **received > expected** for number values. For example, test that 
   * **ouncesPerCan()** returns a value of more than 10 ounces:
   * ```typescript
   *  test('ounces per can is more than 10', () => {
   *    expect(ouncesPerCan()).toBeGreaterThan(10)
   *  })
   *```

   * @param value Value that the received value is greater than.
   */
  toBeGreaterThan(value: any) {
    this._report('toBeGreaterThan', this.#received > value, [this.#received, value])
  }


  /**
   * Use **toBeGreaterThanOrEqual** to compare **received >= expected** for number values. For example, test that 
   * **ouncesPerCan()** returns a value of at least 12 ounces:
   * ```typescript
   *  test('ounces per can is at least 12', () => {
   *    expect(ouncesPerCan()).toBeGreaterThanOrEqual(12)
   *  })
   * ```
   *
   * @param value Value that the received value is greater than or equal to.
   */
  toBeGreaterThanOrEqual(value: any) {
    this._report('toBeGreaterThanOrEqual', this.#received >= value, [this.#received, value])
  }


  /**
   * Use **toBeLessThan** to compare **received < expected** for number values. For example, test that 
   * **ouncesPerCan()** returns a value of less than 20 ounces:
   * ```typescript
   *  test('ounces per can is less than 20', () => {
   *    expect(ouncesPerCan()).toBeLessThan(20)
   *  })
   * ```
   *
   * @param value Value that the received value is less than.
   */
  toBeLessThan(value: any) {
    this._report('toBeLessThan', this.#received < value, [this.#received, value])
  }


  /**
   * Use **toBeLessThanOrEqual** to compare **received < expected** for number values. For example, test that 
   * **ouncesPerCan()** returns at most 12 ounces.
   * ```typescript
   *  test('ounces per can is less than 20', () => {
   *    expect(ouncesPerCan()).toBeLessThanOrEqual(12)
   *  })
   * ```
   *
   * @param value Value that the received value is less than or equal to.
   */
   toBeLessThanOrEqual(value: any) {
    this._report('toBeLessThanOrEqual', this.#received <= value, [this.#received, value])
  }


  /**
   * Use **toBeInstanceOf** to check that an object is an instance of a class. This matcher uses instanceof underneath.
   * ```typescript
   *  class A {}
   * 
   *  expect(new A()).toBeInstanceOf(A)
   *  expect(() => {}).toBeInstanceOf(Function)
   *  expect(new A()).toBeInstanceOf(Function)   // throws
   * ```
   *
   * @param value The class to check for.
   */
  toBeInstanceOf(value: any) {
    this._report('toBeInstanceOf', this.#received instanceof value, [this.#received, value])
  }


  /**
   * Use **toBeNaN** when checking a value is **NaN**.
   * ```typescript
   *  test('passes when value is NaN', () => {
   *    expect(NaN).toBeNaN()
   *    expect(1).not.toBeNaN()
   *  })
   * ```
   */
  toBeNaN() {
    this._report('toBeNaN', Number.isNaN(this.#received), [this.#received])
  }


  /**
   * **toBeNull** is the same as **.toBe(null)** but the error messages are a bit nicer. So use **.toBeNull()** when 
   * you want to check that something is null.
   */
  toBeNull() {
    this._report('toBeNull', this.#received === null, [this.#received])
  }


  /**
   * Use **toBeTruthy** when you don't care what a value is and you want to ensure a value is true in a boolean 
   * context. For example, let's say you have some application code that looks like:
   * ```typescript
   *  drinkSomeLaCroix()
   *  if (thirstInfo()) {
   *    drinkMoreLaCroix()
   *  }
   * ```
   * You may not care what **thirstInfo** returns, specifically - it might return true or a complex object, and your 
   * code would still work. So if you want to test that **thirstInfo** will be truthy after drinking some La Croix, 
   * you could write:
   * ```typescript
   *  test('drinking La Croix leads to having thirst info', () => {
   *    drinkSomeLaCroix()
   *    expect(thirstInfo()).toBeTruthy()
   *  })
   * ```
   * In JavaScript, there are six falsy values: false, 0, '', null, undefined, and NaN. Everything else is truthy.
   *
   */
  toBeTruthy() {
    this._report('toBeTruthy', this.#received, [this.#received])
  }


  /**
   * Use **toBeUndefined** to check that a variable is undefined.
   */
  toBeUndefined() {
    this._report('toBeUndefined', this.#received === undefined, [this.#received])
  }


  /**
   * Use **toContain** when you want to check that an item is in an array. For testing the items in the array, this 
   * uses ===, a strict equality check. **toContain** can also check whether a string is a substring of another string. 
   * For example, if **getAllFlavors()** returns an array of flavors and you want to be sure that lime is in there, you 
   * can write:
   * ```typescript
   *  test('the flavor list contains lime', () => {
   *    expect(getAllFlavors()).toContain('lime')
   *  })
   * ```
   *
   * @param value The value which should be contained in the array.
   */
  toContain(value: any) {
    if (Array.isArray(this.#received)) {
      this._report('toContain', this.#received.includes(value), [this.#received, value])
    } else {
      this._report('toContain', false, [undefined])
    }
  }


  /**
   * Use **toContainEqual** when you want to check that an item with a specific structure and values is contained in an 
   * array. For testing the items in the array, this matcher recursively checks the equality of all fields, rather than 
   * checking for object identity.
   * ```typescript
   *  describe('my beverage', () => {
   *    test('is delicious and not sour', () => {
   *      const myBeverage = {delicious: true, sour: false}
   *      expect(myBeverages()).toContainEqual(myBeverage)
   *    })
   *  })
   * ```
   *
   * @param value The object which should be contained in the array.
   */
  toContainEqual(value: any) {
    if (Array.isArray(this.#received)) {
      const index = this.#received.findIndex(item => this._deepEqual(item, value))
      this._report('toContainEqual', index >= 0, [this.#received, value])
    } else {
      this._report('toContainEqual', false, [undefined])
    }
  }


  /**
   * Use **toEqual** to compare recursively all properties of object instances (also known as "deep" equality). It 
   * calls **Object.is()** to compare primitive values, which is even better for testing than === strict equality 
   * operator.
   * 
   * For example, **toEqual** and [[toBe]] behave differently in this test suite, so all the tests pass:
   * ```typescript
   *  const can1 = {flavor: 'grapefruit', ounces: 12}
   *  const can2 = {flavor: 'grapefruit', ounces: 12}
   * 
   *  describe('the La Croix cans on my desk', () => {
   *    test('have all the same properties', () => {
   *      expect(can1).toEqual(can2)
   *    })
   *    test('are not the exact same can', () => {
   *      expect(can1).not.toBe(can2)
   *    })
   *  })
   * ```
   *
   * @param value The object to check for equality against.
   */
  toEqual(value: any) {
    this._report('toEqual', this._deepEqual(this.#received, value), [this.#received, value])
  }


  /**
   * Use **toHaveLength** to check that an object has a **.length** property and it is set to a certain numeric value.
   * 
   * This is especially useful for checking arrays or strings size.
   * ```typescript
   * expect([1, 2, 3]).toHaveLength(3)
   * expect('abc').toHaveLength(3)
   * expect('').not.toHaveLength(5)
   * ```
   *
   * @param length  Length to check for.
   */
  toHaveLength(length: number) {
    this._report('toHaveLength', 
        this.#received.hasOwnProperty('length') && this.#received.length === length, [this.#received, length])
  }


  /**
   * Use **toHaveProperty** to check if property at provided reference **path** exists for an object. For checking 
   * deeply nested properties in an object you may use dot notation or an array containing the keyPath for deep 
   * references.
   * 
   * You can provide an optional **propVal** argument to compare the received property value (recursively for all 
   * properties of object instances, also known as deep equality, like the toEqual matcher).
   * 
   * The following example contains a **houseForSale** object with nested properties. We are using **toHaveProperty** 
   * to check for the existence and values of various properties in the object.
   * ```typescript
   *  const houseForSale = {
   *    bath: true,
   *    bedrooms: 4,
   *    kitchen: {
   *      amenities: ['oven', 'stove', 'washer'],
   *      area: 20,
   *      wallColor: 'white',
   *    }
   *  }
   * 
   *  test('this house has my desired features', () => {
   *    expect(houseForSale).toHaveProperty('bath')
   *    expect(houseForSale).toHaveProperty('bedrooms', 4)
   *    expect(houseForSale).not.toHaveProperty('pool')
   *    expect(houseForSale).toHaveProperty('kitchen.area', 20)
   *    expect(houseForSale).toHaveProperty('kitchen.amenities', ['oven', 'stove', 'washer']
   *  )
   * ```
   *
   * @param path  Name of the property to check for. May also be a dot-delimited string providing the path for a deeply 
   * nested property.
   * @param propVal An optional value to to check for on the property specified by **path**.
   */
  toHaveProperty(path: string, propVal?: any) {
    const {exists, value} = this._getNestedValue(this.#received, path)
    if (!exists || arguments.length === 1) {
      this._report('tohaveProperty', exists, [this.#received, path])
    } else {
      this._report('tohaveProperty', exists && Object.is(value, propVal), [this.#received, path, propVal])
    }
  }

  /**
   * Use **toMatch** to check that a string matches a regular expression.
   * 
   * For example, you might not know what exactly **essayOnTheBestFlavor()** returns, but you know it's a really long 
   * string, and the substring grapefruit should be in there somewhere. You can test this with:
   * ```typescript
   *  describe('an essay on the best flavor', () => {
   *    test('mentions grapefruit', () => {
   *      expect(essayOnTheBestFlavor()).toMatch(/grapefruit/)
   *    })
   *  })
   * ```
   * This matcher also accepts a string, which it will try to match:
   * ```typescript
   *  describe('grapefruits are healthy', () => {
   *    test('grapefruits are a fruit', () => {
   *      expect('grapefruits').toMatch('fruit')
   *    })
   *  })
   *```

   * @param value RegExp or string to match against.
   */
  toMatch(value: string|RegExp) {
    const regex = value instanceof RegExp ? value : new RegExp(value)
    this._report('toMatch', regex.test(this.#received), [this.#received, regex.toString()])
  }


  /**
   * Use **toMatchArray** to check that an every element of the received array matches the elements of the expected 
   * array. 
   * 
   * For items in the array which are objects, **toEqual** is used to determine if the items match. This means the 
   * items must contain the same properties and values **NOT** that they must actually contain a reference to the same 
   * object.
   * 
   * For items which are arrays, **toMatchArray** is called recursively to check for matches.
   * 
   * **NOTE**: Not part of Jest.
   *
   * @param expected
   * @example
   * ```typescript
   *  const array = [a: 1, b: 2, c: {one: 'uno', two: 'dos}, [100, 200, 300]]
   * 
   *  test('check toMatchArray', () => {
   *    expect(array).toMatchArray()
   *  })
   * ```
   */
  toMatchArray(expected: any[]) {
    if (Array.isArray(this.#received)) {
      const match = this._matchArrays(this.#received, expected)
      this._report('toMatchArray', match, [this.#received, expected])
    } else {
      this._report('toMatchArray', false, [])
    }
  }


  toMatchDate(expected: Date) {
    if (this.#received instanceof Date) {
      const match = this.#received.toISOString().substr(0, 10) === expected.toISOString().substr(0, 10)
      this._report('toMatchDate', match, [this.#received, expected])
    } else {
      this._report('toMatchDate', false, [])
    }
  }


  /**
   * Use **toMatchObject** to check that a JavaScript object matches a subset of the properties of an object. It will 
   * match received objects with properties that are **not** in the expected object.
   * 
   * ```typescript
   *  const houseForSale = {
   *    bath: true,
   *    bedrooms: 4,
   *    kitchen: {
   *      amenities: ['oven', 'stove', 'washer'],
   *      area: 20,
   *      wallColor: 'white'
   *    }
   *  }
   *  const desiredHouse = {
   *    bath: true,
   *    kitchen: {
   *      amenities: ['oven', 'stove', 'washer'],
   *      wallColor: 'white'
   *    }
   *  }
   * 
   *  test('the house has my desired features', () => {
   *    expect(houseForSale).toMatchObject(desiredHouse)
   *  })
   * ```
   *
   * @param expected The object to match against. Note that the received object does not have to match the expected 
   * object exactlty. It can have additional properties but it has to have at least the properties provided by the 
   * expected object and the properties must have the same values.
   */
  toMatchObject(expected: any) {
    this._report('toMatchObject', this._matchObjects(this.#received, expected), [])
  }


  /**
   * Use **toThrow** to test that a function throws when it is called. For example, if we want to test that 
   * **drinkFlavor('octopus')** throws, because octopus flavor is too disgusting to drink, we could write:
   * ```typescript
   *  test('throws on octopus', () => {
   *    expect(() => {
   *      drinkFlavor('octopus')
   *    }).toThrow()
   *  })
   * ```
   * 
   * > **_NOTE:__**  Note: You must wrap the code in a function, otherwise the error will not be caught and the 
   * > assertion will fail.
   * 
   * You can provide an optional argument to test that a specific error is thrown:
   * + regular expression: error message **matches** the pattern
   * + string: error message **includes** the substring
   * + error object: error message is **equal to** the message property of the object
   * 
   * @param value Optional value when checking for specific types of errors.
   */
  toThrow(value?: string|RegExp|Error) {
    const success = this.#error !== undefined &&
        (value === undefined
        || (typeof value === 'string' && this.#error.message.indexOf(value) >= 0)
        || (value instanceof RegExp && value.test(this.#error.message))
        || (value instanceof Error && value.message === this.#error.message))
    this._report('toThrow', success, [])
  }


  // PRIVATE ===========================================================================================================

  #error?: Error
  #index: number
  #not: boolean
  #received: any
  #suite: MxTestSuite


  // _deepEqual(v1, v2)
  private _deepEqual(v1: any, v2: any): boolean {
    const type1 = typeof v1, type2 = typeof v2

    if (type1 !== type2) return false
    if (type1 !== 'object') return Object.is(v1, v2)

    const keys1 = Object.keys(v1), keys2 = Object.keys(v2)

    if (keys1.length !== keys2.length) return false
    if (keys1.length === 0) return true

    return keys1.every(key => {
      return Object.is(v1[key], v2[key])
    })
  }


  // _curType
  private get _curType(): string {
    return typeof this.#received
  }


  // _getNestedValue(source, path)
  private _getNestedValue(source: any, path: string): {exists: boolean, value?: any} {
    const props = path.split('.')
    const len = props.length
    let index: number = 0
    let value: any = source
  
    while (index < len) {
      if (!(props[index] in value)) return {exists: false}
      value = value[props[index++]]
    }
  
    return {exists: true, value}
  }
  
  
  // _matchArrays(received, expected)
  private _matchArrays(received: any[], expected: any[]): boolean {
    if (!Array.isArray(expected)) return false

    return received.every((recVal, ndx) => {
      const expVal = expected[ndx]

      if (Array.isArray(recVal)) return this._matchArrays(recVal, expVal)
      else return this._deepEqual(recVal, expVal)
    })
  }


 // _matchObjects(rec, exp)
  private _matchObjects(received: any, expected: any): boolean {
    return Object.keys(expected).every(key => {
      const recVal = received[key]
      const expVal = expected[key]

      if (Array.isArray(recVal)) {
        return this._matchArrays(recVal, expVal)
      } else if (typeof expVal === 'object') {
        return this._matchObjects(recVal, expVal)
      } else {
        return Object.is(recVal, expVal)
      }
    })
  }


  // _report(matcher, success, args)
  private _report(matcher: MxTestMatcher, success: boolean, args: any[]) {
    this.#suite.report(this.#index, matcher, this.#not ? !success : success, args)
  }


}