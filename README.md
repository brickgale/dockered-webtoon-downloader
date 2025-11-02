# Webtoon Downloader Docker Setup

A Docker containerized version of the [Webtoon Downloader](https://github.com/Zehina/Webtoon-Downloader) for downloading comics from webtoons.com.

## Prerequisites

- Docker installed on your system
- Internet connection

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
docker run --rm webtoon-downloader --help
```

## Usage

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

## Directory Structure

```
webtoon-downloader/
├── Dockerfile
├── README.md
└── downloads/          # Your downloaded comics will appear here
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

## Notes

- Downloads are saved to the `downloads/` folder in your current directory
- The container runs as root, so downloaded files may need permission adjustments
- Large series downloads can take significant time and bandwidth
- Always respect the website's terms of service and rate limits

## License

This Docker setup is provided as-is. The underlying Webtoon Downloader follows its original license from the [upstream repository](https://github.com/Zehina/Webtoon-Downloader).