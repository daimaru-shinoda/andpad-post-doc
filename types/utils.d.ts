/**
 * REINS用設定
 */
type ANDPAD_JSON = {
  mail: string;
  password: string;
};

type GAS_JSON = {
  url: string;
  apiKey: string;
};

/**
 * GAS情報
 */
type GasData = {
  message: string; // 受信データ
  status: number;
};

/**
 *
 */
type DownloadFileInfo = {
  fileId: string;
  fileName: string;
  ankenmei: string;
  filePath: string;
};
