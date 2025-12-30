# Webtoon Downloader Docker Setup

A Docker containerized version of the [Webtoon Downloader](https://github.com/Zehina/Webtoon-Downloader) for downloading comics from webtoons.com.

✅ **Successfully tested** - Downloads Tower of God Chapter 1 (8 images)  
🐍 **Uses pipx** - Isolated Python environment for clean installations  
📦 **Ready to use** - Pre-built Docker container with all dependencies  
🖥️ **Web Monitor** - Vue 3 + Vite frontend for monitoring downloads  

## Prerequisites

- Docker installed on your system
- Internet connection
- Node.js and npm (for running the web monitor)

## Setup Commands

### 1. Build the Docker Image

```bash
docker build -t webtoon-downloader .
```

### 2. Verify the Build

```bash
docker images | grep webtoon-downloader
```

### 3. Test the Installation

```bash
docker run --rm webtoon-downloader --version
```

Expected output: `webtoon-downloader, version 1.9.4`

```bash
docker run --rm webtoon-downloader --help
```

## Usage

### Quick Start - Download Sample Chapter

```bash
# Create downloads directory
mkdir -p downloads

# Download Tower of God Chapter 1 (tested and working)
docker run --rm -v $(pwd)/downloads:/app/downloads webtoon-downloader -o /app/downloads --start 1 --end 1 "https://www.webtoons.com/en/fantasy/tower-of-god/list?title_no=95"
```

### Basic Download Commands

**Download all chapters of a webtoon series:**
```bash
docker run --rm -v $(pwd)/downloads:/app/downloads webtoon-downloader -o /app/downloads "https://www.webtoons.com/en/[genre]/[series-name]/list?title_no=[number]"
```

**Download specific chapter range:**
```bash
docker run --rm -v $(pwd)/downloads:/app/downloads webtoon-downloader -o /app/downloads --start 1 --end 10 "[webtoons-url]"
```

**Download only the latest chapter:**
```bash
docker run --rm -v $(pwd)/downloads:/app/downloads webtoon-downloader -o /app/downloads --latest "[webtoons-url]"
```

**Download with different formats:**
```bash
# Save as PDF
docker run --rm -v $(pwd)/downloads:/app/downloads webtoon-downloader -o /app/downloads --save-as pdf "[webtoons-url]"

# Save as CBZ (comic book format)
docker run --rm -v $(pwd)/downloads:/app/downloads webtoon-downloader -o /app/downloads --save-as cbz "[webtoons-url]"

# Save as ZIP
docker run --rm -v $(pwd)/downloads:/app/downloads webtoon-downloader -o /app/downloads --save-as zip "[webtoons-url]"
```

## Available Options

| Option | Short | Description |
|--------|-------|-------------|
| `--start` | `-s` | Start chapter (INTEGER) |
| `--end` | `-e` | End chapter (INTEGER) |
| `--latest` | `-l` | Download only the latest chapter |
| `--export-metadata` | `-em` | Export texts like series summary, chapter name, or author notes |
| `--export-format` | `-ef` | Format to store exported texts in (all\|json\|text) |
| `--image-format` | `-f` | Image format of downloaded images (jpg\|png) |
| `--out` | `-o` | Download parent folder path |
| `--save-as` | `-sa` | Choose format to save chapters (images\|zip\|cbz\|pdf) |
| `--separate` | | Download each chapter in separate folders |
| `--concurrent-chapters` | | Number of workers for concurrent chapter downloads |
| `--concurrent-pages` | | Number of workers for concurrent image downloads |
| `--proxy` | | Proxy address to use for requests |
| `--quality` | | Image quality (40-100, divisible by 10) |
| `--debug` | | Enable debug mode |

## Examples

### Example 1: Download Tower of God
```bash
docker run --rm -v $(pwd)/downloads:/app/downloads webtoon-downloader -o /app/downloads "https://www.webtoons.com/en/fantasy/tower-of-god/list?title_no=95"
```

### Example 2: Download specific chapters with high quality
```bash
docker run --rm -v $(pwd)/downloads:/app/downloads webtoon-downloader -o /app/downloads --start 1 --end 5 --quality 100 --save-as pdf "https://www.webtoons.com/en/fantasy/tower-of-god/list?title_no=95"
```

### Example 3: Download with metadata export
```bash
docker run --rm -v $(pwd)/downloads:/app/downloads webtoon-downloader -o /app/downloads --export-metadata --export-format json "https://www.webtoons.com/en/fantasy/tower-of-god/list?title_no=95"
```

## Web Monitor

A Vue 3 + Vite web interface with Node.js + Prisma backend for monitoring downloads in real-time and tracking download history.

### 🐳 Docker Setup (Recommended)

**Production:**
```bash
docker-compose up -d
```

Access the app at http://localhost:8080

**Development (with hot reload):**
```bash
docker-compose -f docker-compose.dev.yml up
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

**Stop services:**
```bash
docker-compose down
```

### 💻 Local Setup (Alternative)

**Backend:**
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Features

- 📥 Add download URLs with optional chapter ranges
- 📊 Real-time download progress monitoring
- ✅ Track completed downloads
- ❌ Monitor failed downloads
- 🗑️ Remove downloads from queue
- 💾 Persistent download history with SQLite database
- 📈 Download statistics
- 🌓 Dark/Light mode with theme persistence

For more details:
- Frontend: [frontend/README.md](frontend/README.md)
- Backend: [backend/README.md](backend/README.md)

## Directory Structure

```
webtoon-downloader/
├── Dockerfile          # Uses pipx for isolated installation
├── README.md
├── .gitignore          # Excludes downloads/ from version control
├── backend/            # Node.js + Express + Prisma API
│   ├── prisma/
│   │   └── schema.prisma
│   ├── server.js
│   ├── package.json
│   └── README.md
├── frontend/           # Vue 3 + Vite web monitor
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # shadcn-vue components
│   │   │   ├── DownloadInput.vue
│   │   │   ├── DownloadMonitor.vue
│   │   │   └── ThemeToggle.vue
│   │   ├── services/
│   │   │   └── api.js         # API service layer
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── downloads/          # Your downloaded comics appear here (git-ignored)
    ├── 001_1.jpg       # Chapter images (if no --separate flag)
    ├── 001_2.jpg
    └── ...
    # OR with --separate flag:
    └── [Series Name]/
        ├── Chapter 1/
        ├── Chapter 2/
        └── ...
```

## Supported Sites

- ✅ **webtoons.com** - Official Webtoons platform
- ❌ **Other comic sites** - Not supported by this downloader

## Troubleshooting

### Container Won't Start
```bash
# Check if image exists
docker images | grep webtoon-downloader

# Rebuild if needed
docker build -t webtoon-downloader .
```

### No Output Files
- Ensure the `downloads` directory exists: `mkdir -p downloads`
- Check volume mounting: Make sure the path before `:` in `-v` is correct
- Verify the webtoons.com URL is valid and accessible

### Permission Issues
```bash
# Fix permissions on downloads directory
sudo chown -R $USER:$USER downloads/
chmod -R 755 downloads/
```

### Interactive Mode for Debugging
```bash
docker run -it --rm -v $(pwd)/downloads:/app/downloads --entrypoint /bin/bash webtoon-downloader
```

## Technical Details

### Installation Method
- **pipx**: Uses isolated Python environments (cleaner than system pip)
- **Dependencies**: Automatically handles all required packages
- **Version**: Currently installs webtoon-downloader v1.9.4

### File Organization
- **Default**: Images saved directly to downloads/ (001_1.jpg, 001_2.jpg, etc.)
- **With --separate**: Creates organized folder structure by series/chapter
- **Git ignored**: downloads/ folder excluded from version control

## Notes

- Downloads are saved to the `downloads/` folder in your current directory
- The container runs as root, so downloaded files may need permission adjustments
- Large series downloads can take significant time and bandwidth
- Always respect the website's terms of service and rate limits
- **Tested working**: Successfully downloads Tower of God and other official webtoons

## License

This Docker setup is provided as-is. The underlying Webtoon Downloader follows its original license from the [upstream repository](https://github.com/Zehina/Webtoon-Downloader).