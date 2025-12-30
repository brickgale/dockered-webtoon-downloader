const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);

class DownloaderService {
  constructor() {
    this.downloadsPath = process.env.DOWNLOADS_PATH || '/app/downloads';
  }

  /**
   * Start downloading a webtoon
   * @param {Object} options - Download options
   * @param {string} options.url - Webtoon URL
   * @param {number} options.startChapter - Starting chapter
   * @param {number} options.endChapter - Ending chapter
   * @param {Function} options.onProgress - Progress callback
   */
  async download({ url, startChapter, endChapter, onProgress }) {
    try {
      let command = `docker run --rm -v ${this.downloadsPath}:/app/downloads webtoon-downloader -o /app/downloads`;
      
      if (startChapter && endChapter) {
        command += ` --start ${startChapter} --end ${endChapter}`;
      }
      
      command += ` "${url}"`;

      console.log('Executing command:', command);

      // Execute the download command
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });

      if (stderr) {
        console.error('Download stderr:', stderr);
      }

      console.log('Download stdout:', stdout);

      return {
        success: true,
        output: stdout
      };
    } catch (error) {
      console.error('Download error:', error);
      throw new Error(`Download failed: ${error.message}`);
    }
  }
}

module.exports = new DownloaderService();
