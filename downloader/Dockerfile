FROM python:3.11-slim

# Create working directory
WORKDIR /app

# Install git (needed to clone the repo)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Clone the repo directly from GitHub
RUN git clone https://github.com/Zehina/Webtoon-Downloader.git /app/Webtoon-Downloader

# Move into repo
WORKDIR /app/Webtoon-Downloader

# Install the package using pip (this will install from pyproject.toml)
RUN pip install --no-cache-dir .

# Default command using the installed script
ENTRYPOINT ["webtoon-downloader"]
