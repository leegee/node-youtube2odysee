import { test, expect } from '@playwright/test';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

test.describe('e2e', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/index.html');
  });

  test('with known values', async ({ page }) => {
    await page.click('#video-url');
    await page.keyboard.type('https://www.youtube.com/watch?v=-lVQHIC3QYw&t=315s');
    await page.click('#set-video-src');
    await page.waitForRequest(/^.+\/youtube.+$/);

    await page.click('#subject > input');
    await page.keyboard.type('oswald');
    await page.waitForRequest(/^.+\/entity.+$/);

    await page.click('#verb > input');
    await page.keyboard.type('assassinated');
    await page.waitForRequest(/\/verb/);

    await page.click('#object > input');
    await page.keyboard.type('jfk');
    await page.waitForRequest(/\/entity/);

    await expect(
      page.locator('erd-submit > button')
    ).toBeEnabled({ timeout: 10000 });

    await page.click('erd-submit > button');
    await page.waitForResponse(/\/predicate/, { timeout: 10000 });

    await delay(100000);
  });
});

