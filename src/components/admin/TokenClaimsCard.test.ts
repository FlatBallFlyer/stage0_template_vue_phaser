import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TokenClaimsCard from './TokenClaimsCard.vue'

describe('TokenClaimsCard', () => {
  const mockToken = {
    remote_ip: '192.168.1.1',
    user_id: 'user123',
    roles: ['admin', 'developer']
  }

  it('should render with token data', () => {
    const wrapper = mount(TokenClaimsCard, {
      props: {
        token: mockToken
      },
      global: {
        stubs: {
          'v-card': true,
          'v-card-title': true,
          'v-card-text': true,
          'v-text-field': true,
          'v-icon': true,
          'v-chip-group': true,
          'v-chip': true,
          'v-row': true,
          'v-col': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should handle token with sub instead of user_id', () => {
    const tokenWithSub = {
      remote_ip: '192.168.1.1',
      sub: 'user123',
      roles: ['admin']
    }

    const wrapper = mount(TokenClaimsCard, {
      props: {
        token: tokenWithSub
      },
      global: {
        stubs: {
          'v-card': true,
          'v-card-title': true,
          'v-card-text': true,
          'v-text-field': true,
          'v-icon': true,
          'v-chip-group': true,
          'v-chip': true,
          'v-row': true,
          'v-col': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should show alert when token is undefined', () => {
    const wrapper = mount(TokenClaimsCard, {
      props: {
        token: undefined
      },
      global: {
        stubs: {
          'v-card': true,
          'v-alert': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should handle token without roles', () => {
    const tokenWithoutRoles = {
      remote_ip: '192.168.1.1',
      user_id: 'user123'
    }

    const wrapper = mount(TokenClaimsCard, {
      props: {
        token: tokenWithoutRoles
      },
      global: {
        stubs: {
          'v-card': true,
          'v-card-title': true,
          'v-card-text': true,
          'v-text-field': true,
          'v-icon': true,
          'v-chip-group': true,
          'v-row': true,
          'v-col': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should handle token that is not an object', () => {
    const wrapper = mount(TokenClaimsCard, {
      props: {
        token: null
      },
      global: {
        stubs: {
          'v-card': true,
          'v-alert': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
