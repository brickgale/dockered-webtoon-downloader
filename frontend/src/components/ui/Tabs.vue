<script setup>
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'radix-vue'
import { cn } from '@/lib/utils'

defineProps({
  defaultValue: {
    type: String,
    required: true
  }
})
</script>

<template>
  <TabsRoot :default-value="defaultValue">
    <slot />
  </TabsRoot>
</template>
