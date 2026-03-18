<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-title>Game</v-app-bar-title>
      <v-spacer />
      <v-btn
        v-if="hasAdminRole"
        variant="text"
        to="/admin"
        data-automation-id="nav-admin-link"
      >
        Admin
      </v-btn>
      <v-btn
        v-if="isAuthenticated"
        variant="text"
        @click="handleLogout"
        data-automation-id="nav-logout-link"
      >
        Logout
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-0">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useConfig } from '@/composables/useConfig'
import { useRoles } from '@/composables/useRoles'

const router = useRouter()
const { isAuthenticated, logout } = useAuth()
const { loadConfig } = useConfig()
const { hasRole } = useRoles()

const hasAdminRole = hasRole('admin')

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      await loadConfig()
    } catch (error) {
      console.warn('Failed to load config on mount:', error)
    }
  }
})

function handleLogout() {
  logout()
  router.push('/login')
}
</script>
