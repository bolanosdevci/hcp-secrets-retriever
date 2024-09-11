import * as core from '@actions/core'

import { validate_entry, mask_entry } from '../src/utils'
interface TError {
  message: string
}

describe('tests for utils', () => {
  it('should validate_entry (undefined)', () => {
    try {
      expect(validate_entry('foo', undefined)).toBe(
        'entry: foo value is undefined'
      )
    } catch (ex: unknown) {
      core.error((ex as TError).message)
    }
  })

  it('should validate_entry (null)', () => {
    try {
      expect(validate_entry('foo', null)).toBe('entry: foo value is null')
    } catch (ex: unknown) {
      core.error((ex as TError).message)
    }
  })

  it('should validate_entry (empty)', () => {
    try {
      expect(validate_entry('foo', '')).toThrow('entry: foo value is empty')
    } catch (ex: unknown) {
      core.error((ex as TError).message)
    }
  })

  it('should validate_entry (valid)', () => {
    try {
      expect(validate_entry('foo', '123465798')).not.toThrow()
    } catch (ex: unknown) {
      core.error((ex as TError).message)
    }
  })

  it('should mask_entry', () => {
    expect(mask_entry('123456789')).toEqual('****6789')
    expect(mask_entry('1234')).toEqual('****')
  })
})
