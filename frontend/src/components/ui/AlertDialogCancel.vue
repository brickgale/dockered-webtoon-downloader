<script setup>
import { AlertDialogCancel } from 'radix-vue'
import Button from './Button.vue'
</script>

<template>
  <AlertDialogCancel as-child>
    <Button variant="outline">
      <slot />
    </Button>
  </AlertDialogCancel>
</template>
