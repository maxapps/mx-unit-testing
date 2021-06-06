import {describe, expect, test } from '../mx-unit-testing/mx-unit-testing'


export function runTests() {

  // describe('describe', () => {
  // describe.clear('describe.clear', () => {
  // describe.skip('describe.skip', () => {
    describe.delayedClear(500, 'describe.delayedClear', () => {

    // test.skip('toBe / toBeCloseTo / toEqual', () => {
      test('toBe / toBeCloseTo / toEqual', () => {
      const obj = {a:1, b:2}
      const objRef = obj
      expect(1 + 2).toBe(3)
      expect('hello').toEqual('hello')
      expect(obj).toBe(objRef)
      expect(obj).not.toBe({a:1, b:2})        // properties the same but not actually the same object1
      expect(0.2 + 0.1).not.toBe(0.3)         // fails because in JavaScript, 0.2 + 0.1 is actually 0.30000000000000004.
      expect(0.214).toBeCloseTo(0.21)         // must be within 0.005
      expect(0.215).not.toBeCloseTo(0.21, 4)  // must be within 0.005
      expect(0.215).toBeCloseTo(0.21, 1)      // must be within 0.05
      expect(0.2 + 0.1).toBeCloseTo(0.3)
      expect(obj).toEqual({a:1, b:2})
      expect(obj).not.toEqual({a:1, b:2, c:3})
      expect(parseInt('42')).toEqual(42)
      expect(parseInt('42')).not.toEqual('42')
    })

    test('toBeDefined', () => {
      let tmp
      expect(tmp).not.toBeDefined()
      tmp = 42
      expect(tmp).toBeDefined()
    })
    
    test('toBeFalsy', () => {
      expect(false).toBeFalsy()
      expect(0).toBeFalsy()
      expect('').toBeFalsy()
      expect(null).toBeFalsy()
      expect(undefined).toBeFalsy()
      expect(NaN).toBeFalsy()
      expect('false').not.toBeFalsy()
    })
    
    test('toBeTruthy', () => {
      expect(1).toBeTruthy()
      expect('a').toBeTruthy()
      expect(window).toBeTruthy()
      expect('false').toBeTruthy()
      expect('').not.toBeTruthy()
    })
    
    test('toBeGreaterThan/...OrEqual / toLessThan/..OrEqual', () => {
      expect(1).toBeGreaterThan(0)
      expect(1.0000001).toBeGreaterThan(1)
      expect(1).toBeGreaterThanOrEqual(1)
      expect(1).not.toBeGreaterThan(1)
      expect(1).toBeLessThan(2)
      expect(2).toBeLessThanOrEqual(2)
      expect(1.0000001).toBeLessThan(2)
      expect(1).not.toBeLessThan(1)
    })

    test('toBeInstanceOf / toBeNull / toBeUndefined / toBeNaN', () => {
      let isNull = null
      let isUndefined
      const date = new Date()
      expect(date).toBeInstanceOf(Date)
      expect(isNull).toBeNull()
      expect(isUndefined).not.toBeNull()
      expect(isUndefined).toBeUndefined()
      expect(isNull).not.toBeUndefined()
      expect(parseInt('hello')).toBeNaN()
      expect(parseInt('12Days')).not.toBeNaN()
    })

    test('toMatch', () => {
      expect('football games').toMatch(/gam/)
      expect('football games').not.toMatch(/^gam/)
      expect('football games').toMatch('ball')
    })

    test('toContain / toContainEqual', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [{a:1, b:2}, {c:3, d:4}]
      expect(arr1).toContain(2)
      expect(arr1).not.toContain(4)
      expect(arr2).toContainEqual({c:3, d:4})
      expect(arr2).not.toContainEqual({c:3, d:5})
    })

    test('toHaveLength / toHaveProperty', () => {
      const tmp = {c:3, d:4}
      expect([1, 2, 3, 4]).toHaveLength(4)
      expect({a:1, b:2}).toHaveProperty('a')
      expect({a:1, b:2}).toHaveProperty('b', 2)
      expect({a:1, b:2}).not.toHaveProperty('c')
      expect({a:1, b:2}).not.toHaveProperty('a', 2)
      expect({a:1, b:2, z:tmp}).toHaveProperty('z', tmp)
      expect({a:1, b:2, z:tmp}).not.toHaveProperty('z', {c:3, d:4})
      expect({a:1, b:2, z:tmp}).toHaveProperty('z.c')
      expect({a:1, b:2, z:tmp}).toHaveProperty('z.c', 3)
      expect({a:1, b:2, z:tmp}).not.toHaveProperty('z.c', 4)
      expect({a:1, b:2, c:{d:4, e:{f:6, g:7}}}).toHaveProperty('c.e.g', 7)
    })

    test('toThrow', () => {
      expect(() => {
        a = 0
      }).toThrow()
      expect(() => {
        const a = 0
      }).not.toThrow()
      expect(() => {
        throw new Error('Whoops')
      }).toThrow('oops')
      expect(() => {
        throw new Error('Whoops')
      }).not.toThrow('Bad')
    })

    test.each([
      [1, 1, 2],
      [1, 2, 3],
      [2, 1, 3]
    ])('arguments table', (a: number, b: number, expected: number) => {
      expect(a + b).toBe(expected)
    })

    test.todo('toMatchArray()')
    test.todo('toMatchDate()')
    test.todo('toMatchObject()')

  })

}
