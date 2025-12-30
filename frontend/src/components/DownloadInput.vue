<script setup>
import { ref } from 'vue'
import { Download } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

const emit = defineEmits(['add-download'])

const url = ref('')
const startChapter = ref('')
const endChapter = ref('')

const handleSubmit = () => {
  if (!url.value.trim()) {
    alert('Please enter a URL')
    return
  }
  
  const downloadUrl = url.value.trim()
  const chapters = startChapter.value && endChapter.value 
    ? `Ch. ${startChapter.value}-${endChapter.value}` 
    : 'All chapters'
  
  emit('add-download', {
    url: downloadUrl,
    startChapter: startChapter.value || null,
    endChapter: endChapter.value || null,
    chapters
  })
  
  // Reset form
  url.value = ''
  startChapter.value = ''
  endChapter.value = ''
}
</script>

<template>
  <Card class="flex-[0_0_35%] min-w-[320px] self-start sticky top-8">
    <CardHeader>
      <CardTitle>Add New Download</CardTitle>
      <CardDescription>
        Enter a webtoon URL and optional chapter range to start downloading
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="url">Webtoon URL</Label>
          <Input
            id="url"
            v-model="url"
            type="text"
            placeholder="https://www.webtoons.com/en/fantasy/tower-of-god/list?title_no=95"
            required
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="start">Start Chapter (optional)</Label>
            <Input
              id="start"
              v-model="startChapter"
              type="number"
              placeholder="1"
              min="1"
            />
          </div>
          
          <div class="space-y-2">
            <Label for="end">End Chapter (optional)</Label>
            <Input
              id="end"
              v-model="endChapter"
              type="number"
              placeholder="10"
              min="1"
            />
          </div>
        </div>
        
        <Button type="submit" class="w-full">
          <Download class="mr-2 h-4 w-4" />
          Start Download
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
