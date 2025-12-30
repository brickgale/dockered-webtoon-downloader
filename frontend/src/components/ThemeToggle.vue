<script setup>
import { ref, onMounted } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from './ui/button'

const isDark = ref(false)

onMounted(() => {
  // Check for saved theme preference or default to light
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  updateTheme()
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  updateTheme()
}

const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>

<template>
  <Button 
    variant="outline" 
    size="icon"
    @click="toggleTheme"
    class="rounded-full"
    title="Toggle theme"
  >
    <Sun v-if="isDark" class="h-5 w-5" />
    <Moon v-else class="h-5 w-5" />
  </Button>
</template>
