<script setup>
import { 
  AlertDialogRoot, 
  AlertDialogTrigger, 
  AlertDialogPortal, 
  AlertDialogOverlay, 
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction
} from 'radix-vue'
import { cn } from '@/lib/utils'

const open = defineModel('open', { type: Boolean })
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <slot />
  </AlertDialogRoot>
</template>
