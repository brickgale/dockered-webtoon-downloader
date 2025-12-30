<script setup>
import { AlertDialogTrigger } from 'radix-vue'
</script>

<template>
  <AlertDialogTrigger as-child>
    <slot />
  </AlertDialogTrigger>
</template>
