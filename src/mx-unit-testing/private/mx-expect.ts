import { MxTestMatcher } from "./mx-test"
import MxTestSuite from "./mx-test-suite"


export default class MxExpect {

  constructor(suite: MxTestSuite, value: any, not: boolean = false, index?: number) {
    this.#suite = suite
    this.#curVal = value
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
    return new MxExpect(this.#suite, this.#curVal, true, this.#index)
  }


  // MATCHERS ==========================================================================================================

  toBe(value: any) {
    this._report('toBe', Object.is(this.#curVal, value), [this.#curVal, value])
  }


  toBeCloseTo(value: any, digits = 2) {
    const prec = 10 ** (digits * -1) / 2
    this._report('toBeCloseTo', Math.abs(this.#curVal - value) < prec, [this.#curVal, value])
  }


  toBeDefined() {
    this._report('toBeDefined', this.#curVal !== undefined, [this.#curVal])
  }


  toBeFalsy() {
    this._report('toBeFalsy', !this.#curVal, [this.#curVal])
  }


  toBeGreaterThan(value: any) {
    this._report('toBeGreaterThan', this.#curVal > value, [this.#curVal, value])
  }


  toBeGreaterThanOrEqual(value: any) {
    this._report('toBeGreaterThanOrEqual', this.#curVal >= value, [this.#curVal, value])
  }


  toBeLessThan(value: any) {
    this._report('toBeLessThan', this.#curVal < value, [this.#curVal, value])
  }


  toBeLessThanOrEqual(value: any) {
    this._report('toBeLessThanOrEqual', this.#curVal <= value, [this.#curVal, value])
  }


  toBeInstanceOf(value: any) {
    this._report('toBeInstanceOf', this.#curVal instanceof value, [this.#curVal, value])
  }


  toBeNaN() {
    this._report('toBeNaN', Number.isNaN(this.#curVal), [this.#curVal])
  }


  toBeNull() {
    this._report('toBeNull', this.#curVal === null, [this.#curVal])
  }


  toBeTruthy() {
    this._report('toBeTruthy', this.#curVal, [this.#curVal])
  }


  toBeUndefined() {
    this._report('toBeUndefined', this.#curVal === undefined, [this.#curVal])
  }


  toContain(value: any) {
    if (Array.isArray(this.#curVal)) {
      this._report('toContain', this.#curVal.includes(value), [this.#curVal, value])
    } else {
      this._report('toContain', false, [undefined])
    }
  }


  toContainEqual(value: any) {
    if (Array.isArray(this.#curVal)) {
      const index = this.#curVal.findIndex(item => this._deepEqual(item, value))
      this._report('toContainEqual', index >= 0, [this.#curVal, value])
    } else {
      this._report('toContainEqual', false, [undefined])
    }
  }


  toEqual(value: any) {
    this._report('toEqual', this._deepEqual(this.#curVal, value), [this.#curVal, value])
  }


  toHaveLength(length: number) {
    this._report('toHaveLength', 
        this.#curVal.hasOwnProperty('length') && this.#curVal.length === length, [this.#curVal, length])
  }


  toHaveProperty(path: string, propVal?: any) {
    const {exists, value} = this._getNestedValue(this.#curVal, path)
    if (!exists || arguments.length === 1) {
      this._report('tohaveProperty', exists, [this.#curVal, path])
    } else {
      this._report('tohaveProperty', exists && Object.is(value, propVal), [this.#curVal, path, propVal])
    }
  }

  toMatch(value: string|RegExp) {
    const regex = value instanceof RegExp ? value : new RegExp(value)
    this._report('toMatch', regex.test(this.#curVal), [this.#curVal, regex.toString()])
  }


  toMatchObject(obj: any) {
    const success = typeof this.#curVal === 'object' 
        && Object.keys(obj).every(key => Object.is(this.#curVal[key], obj[key]))
    this._report('toMatchObject', success, [])
  }


  toThrow(value?: string|RegExp|Error) {
    const success = this.#error !== undefined &&
        (value === undefined
        || (typeof value === 'string' && this.#error.message.indexOf(value) >= 0)
        || (value instanceof RegExp && value.test(this.#error.message))
        || (value instanceof Error && value.message === this.#error.message))
    this._report('toThrow', success, [])
  }


  // PRIVATE ===========================================================================================================

  #curVal: any
  #error?: Error
  #index: number
  #not: boolean
  #suite: MxTestSuite


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


  private get _curType(): string {
    return typeof this.#curVal
  }


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
  
  
  private _report(matcher: MxTestMatcher, success: boolean, args: any[]) {
    this.#suite.report(this.#index, matcher, this.#not ? !success : success, args)
  }


}