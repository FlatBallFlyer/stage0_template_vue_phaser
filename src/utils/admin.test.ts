import { describe, it, expect } from 'vitest'
import {
  formatConfigValue,
  getSourceColor,
  getCollectionName,
  getVersionNumber,
  getEnumeratorVersion,
  getEnumeratorItems,
  getEnumeratorItemName,
  getEnumeratorItemValues,
  getValue,
  getValueDescription,
  getTokenValue,
  getTokenRoles,
} from './admin'

describe('admin utilities', () => {
  describe('formatConfigValue', () => {
    it('should format string values', () => {
      expect(formatConfigValue('test')).toBe('test')
    })

    it('should format number values', () => {
      expect(formatConfigValue(123)).toBe('123')
    })

    it('should format null as "null"', () => {
      expect(formatConfigValue(null)).toBe('null')
    })

    it('should format undefined as "null"', () => {
      expect(formatConfigValue(undefined)).toBe('null')
    })

    it('should format objects as JSON', () => {
      expect(formatConfigValue({ key: 'value' })).toBe('{\n  "key": "value"\n}')
    })
  })

  describe('getSourceColor', () => {
    it('should return primary for file', () => {
      expect(getSourceColor('file')).toBe('primary')
    })

    it('should return success for env', () => {
      expect(getSourceColor('env')).toBe('success')
    })

    it('should return default for default', () => {
      expect(getSourceColor('default')).toBe('default')
    })

    it('should return default for unknown source', () => {
      expect(getSourceColor('unknown')).toBe('default')
    })
  })

  describe('getCollectionName', () => {
    it('should return collection_name if present', () => {
      expect(getCollectionName({ collection_name: 'Test' })).toBe('Test')
    })

    it('should return name if collection_name not present', () => {
      expect(getCollectionName({ name: 'Test' })).toBe('Test')
    })

    it('should return collection if neither present', () => {
      expect(getCollectionName({ collection: 'Test' })).toBe('Test')
    })

    it('should return Unknown if none present', () => {
      expect(getCollectionName({})).toBe('Unknown')
    })
  })

  describe('getVersionNumber', () => {
    it('should return current_version if present', () => {
      expect(getVersionNumber({ current_version: '0.1.0.0' })).toBe('0.1.0.0')
    })

    it('should return version if current_version not present', () => {
      expect(getVersionNumber({ version: '0.2.0.0' })).toBe('0.2.0.0')
    })

    it('should return version_number if neither present', () => {
      expect(getVersionNumber({ version_number: '0.3.0.0' })).toBe('0.3.0.0')
    })

    it('should return N/A if none present', () => {
      expect(getVersionNumber({})).toBe('N/A')
    })
  })

  describe('getEnumeratorVersion', () => {
    it('should return version as string', () => {
      expect(getEnumeratorVersion({ version: 0 })).toBe('0')
    })

    it('should return Unknown for null version', () => {
      expect(getEnumeratorVersion({ version: null })).toBe('Unknown')
    })

    it('should return Unknown for missing version', () => {
      expect(getEnumeratorVersion({})).toBe('Unknown')
    })

    it('should return Unknown for non-object', () => {
      expect(getEnumeratorVersion(null)).toBe('Unknown')
    })
  })

  describe('getEnumeratorItems', () => {
    it('should return enumerators array', () => {
      const enumerator = { enumerators: [{ name: 'test' }] }
      expect(getEnumeratorItems(enumerator)).toEqual([{ name: 'test' }])
    })

    it('should return empty array if enumerators not present', () => {
      expect(getEnumeratorItems({})).toEqual([])
    })

    it('should return empty array for non-object', () => {
      expect(getEnumeratorItems(null)).toEqual([])
    })
  })

  describe('getEnumeratorItemName', () => {
    it('should return name', () => {
      expect(getEnumeratorItemName({ name: 'test' })).toBe('test')
    })

    it('should return Unknown if name not present', () => {
      expect(getEnumeratorItemName({})).toBe('Unknown')
    })
  })

  describe('getEnumeratorItemValues', () => {
    it('should return values array', () => {
      expect(getEnumeratorItemValues({ values: [{ value: 'v1' }] })).toEqual([{ value: 'v1' }])
    })

    it('should return empty array if values not present', () => {
      expect(getEnumeratorItemValues({})).toEqual([])
    })
  })

  describe('getValue', () => {
    it('should return value as string', () => {
      expect(getValue({ value: 'test' })).toBe('test')
    })

    it('should return empty string if value not present', () => {
      expect(getValue({})).toBe('')
    })
  })

  describe('getValueDescription', () => {
    it('should return description as string', () => {
      expect(getValueDescription({ description: 'test' })).toBe('test')
    })

    it('should return empty string if description not present', () => {
      expect(getValueDescription({})).toBe('')
    })
  })

  describe('getTokenValue', () => {
    it('should return token value for key', () => {
      const token = { remote_ip: '192.168.1.1' }
      expect(getTokenValue(token, 'remote_ip')).toBe('192.168.1.1')
    })

    it('should return null if key not present', () => {
      const token = { user_id: '123' }
      expect(getTokenValue(token, 'remote_ip')).toBe(null)
    })

    it('should return null if token is undefined', () => {
      expect(getTokenValue(undefined, 'remote_ip')).toBe(null)
    })

    it('should return null if token is not an object', () => {
      expect(getTokenValue(null, 'remote_ip')).toBe(null)
    })
  })

  describe('getTokenRoles', () => {
    it('should return roles array', () => {
      const token = { roles: ['admin', 'user'] }
      expect(getTokenRoles(token)).toEqual(['admin', 'user'])
    })

    it('should return empty array if roles not present', () => {
      expect(getTokenRoles({})).toEqual([])
    })

    it('should return empty array if token is undefined', () => {
      expect(getTokenRoles(undefined)).toEqual([])
    })

    it('should return empty array if token is not an object', () => {
      expect(getTokenRoles(null)).toEqual([])
    })
  })
})
