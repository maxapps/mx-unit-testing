export default class MxTest {
  
  constructor(title: string) {
    this.#title = title
    this.#expectationsCount = 0
    this.#results = []
  }


  // PUBLIC ============================================================================================================

  close() {
    const failures: MxTestResult[] = []
    const successes: MxTestResult[] = []

    this.#results.forEach(res => {
      if (res.success) successes.push(res)
      else failures?.push(res)
    })

    this.#failures = failures
    this.#successes = successes
  }


  get failureCount(): number {
    return this.failures.length
  }


  get failures(): MxTestResult[] {
    return this.#failures ?? this.#results.filter(res => !res.success)
  }


  get nextExpectIndex(): number {
    ++this.#expectationsCount
    return this.#expectationsCount
  }


  report(result: MxTestResult) {
    this.#results.push(result)
  }


  get successes(): MxTestResult[] {
    return this.#successes ?? this.#results.filter(res => res.success)
  }


  get successCount(): number {
    return this.successes.length
  }


  get title(): string {
    return this.#title
  }


  get totalCount(): number {
    return this.#results.length
  }


  // PRIVATE ===========================================================================================================

  #expectationsCount: number
  #failures?: MxTestResult[]
  #results: MxTestResult[]
  #successes?: MxTestResult[]
  #title: string

  // STATIC ============================================================================================================

  static errorMessasges: {[key: string]: (args: any[]) => string} = {
    toBe: (args: any[]) => `${args[0]} not the same as ${args[1]}`,
    toBeCloseTo: (args: any[]) => `${args[0]} is not close to ${args[1]}`,
    toBeDefined: () => `Variable has not been defined`,
    toBeFalsy: (args: any[]) => `${args[0]} is not falsy`,
    toBeGreaterThan: (args: any[]) => `${args[0]} is not greater than ${args[1]}`,
    toBeGreaterThanOrEqual: (args: any[]) => `${args[0]} is not greater than or equal to ${args[1]}`,
    toBeLessThan: (args: any[]) => `${args[0]} is not less than ${args[1]}`,
    toBeLessThanOrEqual: (args: any[]) => `${args[0]} is not less than or equal to ${args[1]}`,
    toBeInstanceOf: (args: any[]) => `${args[0]} is not an instance of ${args[1]}`,
    toBeNaN: (args: any[]) => `${args[0]} is not NaN`,
    toBeNull: (args: any[]) => `${args[0]} is not null`,
    toBeTruthy: (args: any[]) => `${args[0]} is not truthy`,
    toBeUndefined: (args: any[]) => `${args[0]} is not undefined`,
    toContain: (args: any[]) => {
      if (args.length === 2) return `Array does not contain ${args[1]}`
      else return 'Matched value is not an array'
    },
    toContainEqual: (args: any[]) => {
      if (args.length === 2) return `Array does not contain item equal to ${args[1]}`
      else return 'Matched value is not an array'
    },
    toEqual: () => `Objects are not equal`,
    toHaveLength: (args: any[]) => `${args[0]} does not have a length of ${args[1]}`,
    tohaveProperty: (args: any[]) => {
      if (args.length === 2) return `${args[0]} does not have property ${args[1]}`
      else return `${args[0]}[${args[1]}] does not equal ${args[2]}`
    },
    toMatch: (args: any[]) => `${args[0]} does not match ${args[1]}`,
    toMatchArray: (args: any[]) => {
      if (args.length === 2) return `${args[0]} does not match ${args[1]}`
      else return 'Matched value is not an array'
    },
    toMatchDate: (args: any[]) => {
      if (args.length === 2) return `${args[0]} does not match ${args[1]}`
      else return 'Received value is not an array'
    },
    toMatchObject: () => `Objects do not match`,
    toThrow: () => `No error was thrown`
  }

}


export type MxTestMatcher = 'toBe'|'toBeCloseTo'|'toBeDefined'|'toBeFalsy'|'toBeGreaterThan'|'toBeGreaterThanOrEqual'
  |'toBeInstanceOf'|'toBeLessThan'|'toBeLessThanOrEqual'|'toBeNaN'|'toBeNull'|'toBeTruthy'|'toBeUndefined'
  |'toContain'|'toContainEqual'|'toEqual'|'toHaveLength'|'tohaveProperty'
  |'toMatch'|'toMatchArray'|'toMatchDate'|'toMatchObject'|'toThrow'


export interface MxTestResult {
  args: any[]
  index: number
  matcher: MxTestMatcher
  success: boolean
}