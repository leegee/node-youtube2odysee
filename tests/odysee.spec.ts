import * as child_process from 'child_process';
import fs from 'fs';
import { test } from '@playwright/test';
import * as webp from 'webp-converter';

const MAX_ODYSEE_TAGS = 5;

const json = JSON.parse(
  fs.readFileSync('downloads/temp.info.json', 'utf-8')
);

let thumbFilepath;
if (fs.existsSync('downloads/temp.jpg')) {
  thumbFilepath = 'downloads/temp.jpg';
} else if (fs.existsSync('downloads/temp.png')) {
  thumbFilepath = 'downloads/temp.png';
} else if (fs.existsSync('downloads/temp.webp')) {
  (async () => await webp.dwebp("downloads/temp.webp", "downloads/temp.png", "-o"))();
  thumbFilepath = 'downloads/temp.png';
} else {
  console.warn('No thumbnail - found neither downloads/temp.webp nor downloads/temp.jpg!');
}

let videoFilepath;
if (fs.existsSync('downloads/temp.mp4')) {
  videoFilepath = 'downloads/temp.mp4';
} else if (fs.existsSync('downloads/temp.webm')) {
  videoFilepath = 'downloads/temp.webm';
}

const title = json.fulltitle || json.title;
const tags = json.tags;
const newUrl = title.replace(/\s+/g, '-');
const description = json.description + "\n\nOriginal at: " + json.channel_url;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

test.describe('YouTube to Odysee', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.odysee.com');
  });

  test('Upload', async ({ page }) => {
    test.setTimeout(120 * 1000);

    await page.click('#onetrust-accept-btn-handler');

    await page.click('[href="/$/signin"]');

    await page.click('#username');
    await page.keyboard.type('leegee@gmail.com');
    await page.click('[aria-label="Log In"]');
    await page.click('#password');
    await page.keyboard.type(process.env.ODYSEE_PASSWORD);
    await page.click('[aria-label="Continue"]');

    await page.click('[aria-label="Publish a file, or create a channel"]');
    await page.click('[data-valuetext="Upload"]');

    // URL
    await page.fill('[name="content_name"]', newUrl);

    // Title
    await page.fill('[name="content_title"]', title);

    // File
    await page.setInputFiles('input[type="file"][accept*="video"]', videoFilepath);

    // Description
    await page.fill("#content_description", description);

    // Thumbnail
    await page.setInputFiles('input[type*="file"][accept*="png"]', thumbFilepath);
    // OK thumbnail
    await page.click('button[aria-label="Upload"][class="button button--primary"] span span');

    // Tags
    let tagsUsed = 0;
    for (let tag of tags) {
      if (++tagsUsed <= MAX_ODYSEE_TAGS) {
        await page.click('input[type="text"][class="tag__input"]');
        await page.keyboard.type(tag);
        await page.keyboard.press('Enter');
      }
    }

    await delay(1000000);
  });
});

