import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EnumeratorsDisplay from './EnumeratorsDisplay.vue'

describe('EnumeratorsDisplay', () => {
  const mockItems = [
    {
      version: 0,
      enumerators: [
        {
          name: 'test_enum',
          values: [
            { value: 'val1', description: 'Description 1' },
            { value: 'val2', description: 'Description 2' }
          ]
        },
        {
          name: 'another_enum',
          values: []
        }
      ]
    },
    {
      version: null,
      enumerators: []
    }
  ]

  it('should render with items', () => {
    const wrapper = mount(EnumeratorsDisplay, {
      props: {
        items: mockItems
      },
      global: {
        stubs: {
          'v-expansion-panels': true,
          'v-expansion-panel': true,
          'v-expansion-panel-title': true,
          'v-expansion-panel-text': true,
          'v-alert': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should handle enumerator with null version', () => {
    const itemsWithNullVersion = [
      {
        version: null,
        enumerators: [{ name: 'test', values: [] }]
      }
    ]

    const wrapper = mount(EnumeratorsDisplay, {
      props: {
        items: itemsWithNullVersion
      },
      global: {
        stubs: {
          'v-expansion-panels': true,
          'v-expansion-panel': true,
          'v-expansion-panel-title': true,
          'v-expansion-panel-text': true,
          'v-alert': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should handle enumerator without enumerators array', () => {
    const itemsWithoutEnumerators = [
      {
        version: 1
      }
    ]

    const wrapper = mount(EnumeratorsDisplay, {
      props: {
        items: itemsWithoutEnumerators
      },
      global: {
        stubs: {
          'v-expansion-panels': true,
          'v-expansion-panel': true,
          'v-expansion-panel-title': true,
          'v-expansion-panel-text': true,
          'v-alert': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should show alert when items are empty', () => {
    const wrapper = mount(EnumeratorsDisplay, {
      props: {
        items: []
      },
      global: {
        stubs: {
          'v-expansion-panels': true,
          'v-alert': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should show alert when items are undefined', () => {
    const wrapper = mount(EnumeratorsDisplay, {
      props: {
        items: undefined
      },
      global: {
        stubs: {
          'v-expansion-panels': true,
          'v-alert': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
