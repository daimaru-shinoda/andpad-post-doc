import { Page } from "playwright-core";
import {
  createClickOption,
  fill,
  goto,
  waitLocatorVisible,
} from "./playwright-common";
import { sleep, loadJsonAndpad } from "./utils";
import { setUsedFile } from "./gas";

/**
 * アンドパッドに案件を登録する
 * @param page
 * @param data 元になるデータ
 */
export async function postFiles(page: Page, fileInfos: DownloadFileInfo[]) {
  console.log("post start");

  const url = "https://work.andpad.jp/";
  await login(page, url);

  for (const fileInfo of fileInfos) {
    await postFile(page, fileInfo);

    await setUsedFile(fileInfo.fileId);
    await page.goto(url);
  }

  console.log("all file uploaded");
}

async function postFile(page: Page, info: DownloadFileInfo) {
  const searchInput = page.locator(`input[name="q[keyword_cont]"]`);
  await waitLocatorVisible(searchInput);
  await searchInput.fill(info.ankenmei);
  await sleep(1);
  await page.keyboard.press("Enter");
  console.log("search done");
  await sleep(3);

  const ankenTr = page.locator(
    `div.content div.table_container.content__table table.table tbody tr`,
    {
      hasText: info.ankenmei,
    }
  );
  await waitLocatorVisible(ankenTr);
  await ankenTr.click(createClickOption());
  console.log(info.ankenmei, "clicked");
  await sleep(5);

  const tabMenu = page.locator(`ul.single-header__nav li a`, {
    hasText: /^資料$/,
  });
  await waitLocatorVisible(tabMenu);
  await tabMenu.click(createClickOption());
  console.log("go to 資料 folder");

  await sleep(3);
  const folder = page.locator(
    `tr.list-document-tag.clickable td a.list-document-tag__link`,
    { hasText: "構造図（プレカット図）　担当：建築" }
  );
  await waitLocatorVisible(folder);
  await folder.click(createClickOption());

  const button = page.locator(`div.action__element a.btn-small`, {
    hasText: "資料を追加",
  });
  await waitLocatorVisible(button);
  await button.click(createClickOption());

  const fileSelector = page.locator(
    `div.form-file-upload__action span.btn-small`,
    { hasText: "ファイルを選択する" }
  );
  await waitLocatorVisible(fileSelector);
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    fileSelector.click(createClickOption()),
  ]);
  await fileChooser.setFiles(info.filePath);
  await sleep(2);

  const submit = page.locator(`a#submit_link.btn-primary`, {
    hasText: "保存する",
  });
  await waitLocatorVisible(submit);
  await submit.click(createClickOption());
  await sleep(5);
}

/**
 * アンドパッドにログインする
 * @param page
 */
export async function login(page: Page, url: string) {
  console.log("login start");
  await page.goto("https://andpad.jp/login");
  await sleep(1);

  console.debug("login page opened");

  // アンドパッド 画面遷移
  await page.locator("input.button.button_main").click();
  console.debug("id input");

  const ANDPAD_JSON = loadJsonAndpad();

  await page.locator("input#email").waitFor({ state: "visible" });

  // mail入力
  await fill(page, "input#email", ANDPAD_JSON.mail);

  // アンドパッドにパスワードを入力
  await fill(page, "input#password", ANDPAD_JSON.password);

  // ログインボタンクリック
  await page.locator("#btn-login").click(createClickOption());
  await page.waitForEvent("load");

  await sleep(5);

  console.log("url: ", page.url());

  if (page.url().startsWith("https://auth.andpad.jp/login")) {
    await login(page, url);
  }

  await goto(page, url);
  await sleep(0.5);
}
