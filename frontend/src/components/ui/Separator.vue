<script setup>
import { Separator as SeparatorPrimitive } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  decorative: {
    type: Boolean,
    default: true
  },
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <SeparatorPrimitive
    :decorative="decorative"
    :orientation="orientation"
    :class="cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      props.class
    )"
  />
</template>
