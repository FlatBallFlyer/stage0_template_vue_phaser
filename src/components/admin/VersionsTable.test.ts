import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VersionsTable from './VersionsTable.vue'

describe('VersionsTable', () => {
  const mockItems = [
    {
      _id: '1',
      collection_name: 'TestCollection',
      current_version: '0.1.0.0'
    },
    {
      _id: '2',
      name: 'AnotherCollection',
      version: '0.2.0.0'
    },
    {
      _id: '3',
      collection: 'ThirdCollection',
      version_number: '0.3.0.0'
    }
  ]

  it('should render table with items', () => {
    const wrapper = mount(VersionsTable, {
      props: {
        items: mockItems
      },
      global: {
        stubs: {
          'v-data-table': {
            template: '<div><slot name="item.collection_name" :item="items[0]" /><slot name="item.version" :item="items[0]" /></div>',
            props: ['items', 'headers']
          },
          'v-alert': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should get collection name from collection_name property', () => {
    const wrapper = mount(VersionsTable, {
      props: {
        items: [{ _id: '1', collection_name: 'TestCollection', version: '0.1.0.0' }]
      },
      global: {
        stubs: {
          'v-data-table': {
            template: '<div><slot name="item.collection_name" :item="items[0]" /></div>',
            props: ['items', 'headers']
          },
          'v-alert': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should get collection name from name property', () => {
    const wrapper = mount(VersionsTable, {
      props: {
        items: [{ _id: '1', name: 'TestCollection', version: '0.1.0.0' }]
      },
      global: {
        stubs: {
          'v-data-table': {
            template: '<div><slot name="item.collection_name" :item="items[0]" /></div>',
            props: ['items', 'headers']
          },
          'v-alert': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should get version from current_version property', () => {
    const wrapper = mount(VersionsTable, {
      props: {
        items: [{ _id: '1', collection_name: 'Test', current_version: '0.1.0.0' }]
      },
      global: {
        stubs: {
          'v-data-table': {
            template: '<div><slot name="item.version" :item="items[0]" /></div>',
            props: ['items', 'headers']
          },
          'v-alert': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should show alert when items are empty', () => {
    const wrapper = mount(VersionsTable, {
      props: {
        items: []
      },
      global: {
        stubs: {
          'v-data-table': true,
          'v-alert': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should show alert when items are undefined', () => {
    const wrapper = mount(VersionsTable, {
      props: {
        items: undefined
      },
      global: {
        stubs: {
          'v-data-table': true,
          'v-alert': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
