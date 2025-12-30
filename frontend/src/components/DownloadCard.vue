<script setup>
import { Clock, CheckCircle2, XCircle, Loader2, Trash2 } from 'lucide-vue-next'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'

const props = defineProps({
  download: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])

const getStatusVariant = (status) => {
  switch (status) {
    case 'completed': return 'default'
    case 'downloading': return 'secondary'
    case 'failed': return 'destructive'
    default: return 'outline'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed': return CheckCircle2
    case 'downloading': return Loader2
    case 'failed': return XCircle
    default: return Clock
  }
}

const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <Card 
    class="group hover:shadow-md transition-all duration-200"
    :class="{
      'border-destructive/50': download.status === 'failed',
      'opacity-90 hover:opacity-100': download.status === 'completed'
    }"
  >
    <CardContent class="pt-6">
      <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0 space-y-3">
            <!-- Status Badge and Time -->
            <div class="flex items-center gap-2 flex-wrap">
              <Badge :variant="getStatusVariant(download.status)" class="gap-1">
                <component 
                  :is="getStatusIcon(download.status)" 
                  class="h-3 w-3"
                  :class="{ 'animate-spin': download.status === 'downloading' }"
                />
                {{ download.status }}
              </Badge>
              <span class="text-xs text-muted-foreground flex items-center gap-1">
                <Clock class="h-3 w-3" />
                {{ formatTime(download.createdAt) }}
              </span>
            </div>
            
            <!-- URL -->
            <div>
              <p class="text-sm font-medium text-foreground break-all line-clamp-2 mb-1">
                {{ download.url }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ download.chapters || 'All chapters' }}
              </p>
            </div>

            <!-- Progress Bar for Active Downloads -->
            <div v-if="download.status === 'downloading' || download.status === 'queued'" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Progress</span>
                <span class="font-medium">{{ Math.round(download.progress) }}%</span>
              </div>
              <Progress :model-value="download.progress" class="h-2" />
            </div>

            <!-- Error Message for Failed Downloads -->
            <div v-if="download.error && download.status === 'failed'" class="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
              <p class="font-medium mb-1">Error:</p>
              <p>{{ download.error }}</p>
            </div>

            <!-- Completion Time -->
            <div v-if="download.completedAt" class="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 class="h-3 w-3" />
              Completed: {{ formatTime(download.completedAt) }}
            </div>
          </div>

          <!-- Delete Button -->
          <Button 
            variant="ghost" 
            size="icon"
            @click="emit('delete', download.id)"
            class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete download"
          >
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
