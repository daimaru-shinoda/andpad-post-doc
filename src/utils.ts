import { load } from "ts-dotenv";
/**
 * 環境設定名
 */
enum JSON_ENV_NAME {
  ANDPAD = "ANDPAD_JSON",
  GAS = "GAS_JSON",
  IS_TEST = "IS_TEST",
}

/**
 * 環境変数を読み込む
 */
export const env: { [key in JSON_ENV_NAME]: string } = load({
  ANDPAD_JSON: String,
  GAS_JSON: String,
  IS_TEST: String,
});

/**
 * ANDPAD用設定JSONを読み込む
 */
export function loadJsonAndpad(): ANDPAD_JSON {
  return loadJson(JSON_ENV_NAME.ANDPAD) as ANDPAD_JSON;
}

/**
 * GAS設定JSONを読み込む
 */
export function loadJsonGas(): GAS_JSON {
  return loadJson(JSON_ENV_NAME.GAS) as GAS_JSON;
}

/**
 * 環境変数名を指定してJSONを読み込む
 * @param envName 環境変数名
 */
function loadJson(envName: JSON_ENV_NAME): ANDPAD_JSON | GAS_JSON {
  const content = env[envName];
  if (!content) throw new Error(`環境変数が設定されてません ${envName}`);
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error("環境変数から取得したjsonのパースに失敗しました。", {
      content,
    });
    throw e;
  }
}

/**
 * テスト中か確認する
 * @returns true: テスト中 / false: 本番
 */
function isTest() {
  return env.IS_TEST === "true";
}
export const IS_TEST = isTest();

/**
 * スリープする
 * @param seconds 秒数
 */
export function sleep(seconds: number) {
  const sec = seconds - 1 + Math.random();
  return new Promise((r) => setTimeout(r, sec * 1000));
}

function pad0(n: number) {
  if (n < 10) return `0${n}`;
  return `${n}`;
}

export function formatDate(date: Date, separator = "-") {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}${separator}${pad0(month)}${separator}${pad0(day)}`;
}

/**
 * 全角数字を半角数字に変える
 * @param text
 * @returns
 */
export function zenkakuToHankaku(text?: string) {
  if (!text) return "";
  const zenkaku = "０１２３４５６７８９";
  const re = new RegExp("[" + zenkaku + "]", "g");
  return text.replace(re, (m) => `${zenkaku.indexOf(m)}`);
}
