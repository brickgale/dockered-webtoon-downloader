<script setup>
import { computed, ref } from 'vue'
import { Clock, CheckCircle2, XCircle, Loader2, Download as DownloadIcon } from 'lucide-vue-next'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction
} from './ui/alert-dialog'
import DownloadCard from './DownloadCard.vue'

const props = defineProps({
  downloads: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['remove-download'])

const deleteDialogOpen = ref(false)
const selectedDownloadId = ref(null)

const activeDownloads = computed(() => 
  props.downloads.filter(d => d.status === 'downloading' || d.status === 'queued')
)

const completedDownloads = computed(() => 
  props.downloads.filter(d => d.status === 'completed')
)

const failedDownloads = computed(() => 
  props.downloads.filter(d => d.status === 'failed')
)

const stats = computed(() => ({
  total: props.downloads.length,
  active: activeDownloads.value.length,
  completed: completedDownloads.value.length,
  failed: failedDownloads.value.length
}))

const confirmDelete = (id) => {
  selectedDownloadId.value = id
  deleteDialogOpen.value = true
}

const handleDelete = () => {
  if (selectedDownloadId.value) {
    emit('remove-download', selectedDownloadId.value)
    deleteDialogOpen.value = false
    selectedDownloadId.value = null
  }
}
</script>

<template>
  <div class="flex-[1_1_60%] space-y-6">

    <!-- Header with Stats -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-foreground">Downloads</h2>
        <p class="text-sm text-muted-foreground mt-1">
          Manage and monitor your webtoon downloads
        </p>
      </div>
      
      <div class="flex gap-2">
        <Card class="px-4 py-2">
          <div class="text-center">
            <div class="text-2xl font-bold text-primary">{{ stats.total }}</div>
            <div class="text-xs text-muted-foreground">Total</div>
          </div>
        </Card>
        <Card class="px-4 py-2">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-500">{{ stats.active }}</div>
            <div class="text-xs text-muted-foreground">Active</div>
          </div>
        </Card>
        <Card class="px-4 py-2">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-500">{{ stats.completed }}</div>
            <div class="text-xs text-muted-foreground">Done</div>
          </div>
        </Card>
      </div>
    </div>

    <Separator />

    <!-- Error message -->
    <div v-if="error" class="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <Loader2 class="mx-auto h-8 w-8 animate-spin text-primary mb-3" />
      <p class="text-muted-foreground">Loading downloads...</p>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="downloads.length === 0" class="text-center">
      <Card class="border-dashed">
        <CardContent class="pt-6 pb-6">
          <DownloadIcon class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 class="text-lg font-semibold mb-2">No downloads yet</h3>
          <p class="text-muted-foreground">
            Add a webtoon URL above to start downloading
          </p>
        </CardContent>
      </Card>
    </div>
    
    <!-- Tabs for Different Statuses -->
    <Tabs v-else default-value="all" class="w-full">
      <TabsList class="grid w-full grid-cols-4">
        <TabsTrigger value="all">
          All <Badge variant="secondary" class="ml-2">{{ stats.total }}</Badge>
        </TabsTrigger>
        <TabsTrigger value="active">
          Active <Badge v-if="stats.active > 0" variant="secondary" class="ml-2">{{ stats.active }}</Badge>
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed <Badge v-if="stats.completed > 0" variant="secondary" class="ml-2">{{ stats.completed }}</Badge>
        </TabsTrigger>
        <TabsTrigger value="failed">
          Failed <Badge v-if="stats.failed > 0" variant="destructive" class="ml-2">{{ stats.failed }}</Badge>
        </TabsTrigger>
      </TabsList>

      <!-- All Downloads -->
      <TabsContent value="all" class="mt-6">
        <ScrollArea class="h-[600px] pr-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
            <DownloadCard
              v-for="download in downloads"
              :key="download.id"
              :download="download"
              @delete="confirmDelete"
            />
          </div>
        </ScrollArea>
      </TabsContent>

      <!-- Active Downloads -->
      <TabsContent value="active" class="mt-6">
        <div v-if="activeDownloads.length === 0" class="text-center py-12">
          <Loader2 class="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <p class="text-muted-foreground">No active downloads</p>
        </div>
        <ScrollArea v-else class="h-[600px] pr-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
            <DownloadCard
              v-for="download in activeDownloads"
              :key="download.id"
              :download="download"
              @delete="confirmDelete"
            />
          </div>
        </ScrollArea>
      </TabsContent>

      <!-- Completed Downloads -->
      <TabsContent value="completed" class="mt-6">
        <div v-if="completedDownloads.length === 0" class="text-center py-12">
          <CheckCircle2 class="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <p class="text-muted-foreground">No completed downloads</p>
        </div>
        <ScrollArea v-else class="h-[600px] pr-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
            <DownloadCard
              v-for="download in completedDownloads"
              :key="download.id"
              :download="download"
              @delete="confirmDelete"
            />
          </div>
        </ScrollArea>
      </TabsContent>

      <!-- Failed Downloads -->
      <TabsContent value="failed" class="mt-6">
        <div v-if="failedDownloads.length === 0" class="text-center py-12">
          <XCircle class="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <p class="text-muted-foreground">No failed downloads</p>
        </div>
        <ScrollArea v-else class="h-[600px] pr-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
            <DownloadCard
              v-for="download in failedDownloads"
              :key="download.id"
              :download="download"
              @delete="confirmDelete"
            />
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="deleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogTitle>Delete Download</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this download? This action cannot be undone.
        </AlertDialogDescription>
        <div class="flex justify-end gap-3 mt-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" @click="handleDelete">
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
