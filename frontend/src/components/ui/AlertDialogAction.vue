<script setup>
import { AlertDialogAction } from 'radix-vue'
import Button from './Button.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  }
})
</script>

<template>
  <AlertDialogAction as-child>
    <Button :variant="variant">
      <slot />
    </Button>
  </AlertDialogAction>
</template>
