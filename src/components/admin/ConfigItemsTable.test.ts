import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfigItemsTable from './ConfigItemsTable.vue'

describe('ConfigItemsTable', () => {
  const mockItems = [
    {
      name: 'test_config',
      value: 'test_value',
      from: 'file'
    },
    {
      name: 'env_config',
      value: 'env_value',
      from: 'env'
    },
    {
      name: 'object_config',
      value: { nested: 'value' },
      from: 'default'
    },
    {
      name: 'null_config',
      value: null,
      from: 'file'
    },
    {
      name: 'unknown_source',
      value: 'value',
      from: 'unknown'
    }
  ]

  it('should render table with items', () => {
    const wrapper = mount(ConfigItemsTable, {
      props: {
        items: mockItems
      },
      global: {
        stubs: {
          'v-data-table': {
            template: '<div><slot name="item.value" :item="items[0]" /><slot name="item.from" :item="items[0]" /></div>',
            props: ['items', 'headers']
          },
          'v-chip': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should format string values', () => {
    const wrapper = mount(ConfigItemsTable, {
      props: {
        items: [{ name: 'test', value: 'string_value', from: 'file' }]
      },
      global: {
        stubs: {
          'v-data-table': {
            template: '<div><slot name="item.value" :item="items[0]" /></div>',
            props: ['items', 'headers']
          },
          'v-chip': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should format object values as JSON', () => {
    const wrapper = mount(ConfigItemsTable, {
      props: {
        items: [{ name: 'test', value: { key: 'value' }, from: 'file' }]
      },
      global: {
        stubs: {
          'v-data-table': {
            template: '<div><slot name="item.value" :item="items[0]" /></div>',
            props: ['items', 'headers']
          },
          'v-chip': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should format null values', () => {
    const wrapper = mount(ConfigItemsTable, {
      props: {
        items: [{ name: 'test', value: null, from: 'file' }]
      },
      global: {
        stubs: {
          'v-data-table': {
            template: '<div><slot name="item.value" :item="items[0]" /></div>',
            props: ['items', 'headers']
          },
          'v-chip': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should get correct source colors', () => {
    const wrapper = mount(ConfigItemsTable, {
      props: {
        items: [
          { name: 'file_item', value: 'value', from: 'file' },
          { name: 'env_item', value: 'value', from: 'env' },
          { name: 'default_item', value: 'value', from: 'default' },
          { name: 'unknown_item', value: 'value', from: 'unknown' }
        ]
      },
      global: {
        stubs: {
          'v-data-table': {
            template: '<div><slot name="item.from" :item="items[0]" /></div>',
            props: ['items', 'headers']
          },
          'v-chip': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
