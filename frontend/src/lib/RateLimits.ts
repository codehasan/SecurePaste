import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

interface RateLimiterProps {
  content: string;
  maxSizeMB: number;
}

const writeContentToFile = async (content: string): Promise<string> => {
  const tempDir = os.tmpdir();
  const tempFile = path.join(tempDir, `${uuidv4()}.txt`);

  await fs.writeFile(tempFile, content, 'utf8');
  return tempFile;
};

const getFileSizeInMB = async (filePath: string): Promise<number> => {
  const stats = await fs.stat(filePath);
  return stats.size / (1024 * 1024); // Convert bytes to megabytes
};

const applyRateLimit = async ({
  content,
  maxSizeMB,
}: RateLimiterProps): Promise<void> => {
  try {
    const tempFile = await writeContentToFile(content);
    const fileSizeMB = await getFileSizeInMB(tempFile);

    console.log(`File size: ${fileSizeMB.toFixed(2)} MB`);

    if (fileSizeMB > maxSizeMB) {
      console.error('Content exceeds the maximum allowed size.');
      // Handle the rate limit error accordingly
    } else {
      console.log('Content is within the allowed size.');
      // Proceed with your logic
    }

    // Clean up the temporary file
    await fs.unlink(tempFile);
  } catch (error) {
    console.error('Error processing the content:', error);
  }
};

// Example usage
const content = 'Your content here...';
const maxSizeMB = 1; // 1 MB limit

applyRateLimit({ content, maxSizeMB });
