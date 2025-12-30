<script setup>
import { ProgressRoot, ProgressIndicator } from 'radix-vue'
import { cn } from '@/lib/utils'
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <ProgressRoot 
    :model-value="modelValue"
    :class="cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', props.class)"
  >
    <ProgressIndicator
      class="h-full w-full flex-1 bg-primary transition-all"
      :style="`transform: translateX(-${100 - (modelValue ?? 0)}%)`"
    />
  </ProgressRoot>
</template>
