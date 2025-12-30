import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Get all downloads (with optional filtering by status)
app.get('/api/downloads', async (req, res) => {
  try {
    const { status } = req.query
    const where = status ? { status } : {}
    
    const downloads = await prisma.download.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
    
    res.json(downloads)
  } catch (error) {
    console.error('Error fetching downloads:', error)
    res.status(500).json({ error: 'Failed to fetch downloads' })
  }
})

// Get a single download by ID
app.get('/api/downloads/:id', async (req, res) => {
  try {
    const { id } = req.params
    const download = await prisma.download.findUnique({
      where: { id: parseInt(id) }
    })
    
    if (!download) {
      return res.status(404).json({ error: 'Download not found' })
    }
    
    res.json(download)
  } catch (error) {
    console.error('Error fetching download:', error)
    res.status(500).json({ error: 'Failed to fetch download' })
  }
})

// Create a new download
app.post('/api/downloads', async (req, res) => {
  try {
    const { url, chapters, startChapter, endChapter } = req.body
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }
    
    const download = await prisma.download.create({
      data: {
        url,
        status: 'queued',
        progress: 0,
        chapters,
        startChapter: startChapter ? parseInt(startChapter) : null,
        endChapter: endChapter ? parseInt(endChapter) : null
      }
    })
    
    res.status(201).json(download)
  } catch (error) {
    console.error('Error creating download:', error)
    res.status(500).json({ error: 'Failed to create download' })
  }
})

// Update a download (status, progress, etc.)
app.patch('/api/downloads/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status, progress, error } = req.body
    
    const updateData = {}
    if (status !== undefined) updateData.status = status
    if (progress !== undefined) updateData.progress = progress
    if (error !== undefined) updateData.error = error
    if (status === 'completed') updateData.completedAt = new Date()
    
    const download = await prisma.download.update({
      where: { id: parseInt(id) },
      data: updateData
    })
    
    res.json(download)
  } catch (error) {
    console.error('Error updating download:', error)
    res.status(500).json({ error: 'Failed to update download' })
  }
})

// Delete a download
app.delete('/api/downloads/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    await prisma.download.delete({
      where: { id: parseInt(id) }
    })
    
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting download:', error)
    res.status(500).json({ error: 'Failed to delete download' })
  }
})

// Get download statistics
app.get('/api/stats', async (req, res) => {
  try {
    const total = await prisma.download.count()
    const completed = await prisma.download.count({ where: { status: 'completed' } })
    const failed = await prisma.download.count({ where: { status: 'failed' } })
    const active = await prisma.download.count({ 
      where: { 
        status: { in: ['queued', 'downloading'] }
      }
    })
    
    res.json({ total, completed, failed, active })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/downloads`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
