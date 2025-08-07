import { chromium } from "playwright-core";
import { postFiles } from "./andpad";
import { IS_TEST, formatDate } from "./utils";
import { downloadFileIds, downloadPdf } from "./gas";

(async () => {
  console.log(formatDate(new Date()));
  console.log("program start!");
  // ブラウザ起動時設定
  const args: string[] = [
    "--mute-audio", // 音声をミュート
    "--no-default-browser-check", // デフォルトブラウザチェックを無効
    "--no-first-run", // 初回起動時の設定を無効
    "--disable-cache", // キャッシュを無効
    "--disable-background-networking", // バックグラウンドネットワーキングを無効
    "--disable-breakpad", // クラッシュレポートを無効
  ];
  const browser = await chromium.launch({
    headless: !IS_TEST,
    channel: "chrome",
    args,
  });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.133 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    const fileIds = await downloadFileIds();
    if (!fileIds || fileIds.length < 1) return console.log("no fileId found");

    const files: DownloadFileInfo[] = [];
    for (const fileId of fileIds) {
      const result = await downloadPdf(fileId);
      if (!result) continue;
      console.log(JSON.stringify(result));
      files.push(result);
    }

    // await postFiles(page, files);
  } catch (e) {
    console.debug(e);
  } finally {
    await page.close();
    await browser.close();
  }
})();
