import { writeFile } from "fs/promises";
import { loadJsonGas } from "./utils";

export async function downloadFileIds(): Promise<string[] | void> {
  const result = await fetchGas();
  if (!result) return [];
  return JSON.parse(result).fileIds;
}

export async function setUsedFile(fileId: string) {
  await fetchGas(fileId, true);
}

export async function downloadPdf(
  fileId: string
): Promise<DownloadFileInfo | void> {
  const result = await fetchGas(fileId);
  if (!result) return console.error("cant get response");

  const { ankenmei, fileName, fileBytes } = JSON.parse(result);
  const buffer = Buffer.from(fileBytes);
  const filePath = `tmp/${fileName}`;
  await writeFile(filePath, buffer);
  return { fileId, fileName, ankenmei, filePath };
}

/**
 * GAS空データを受領する
 * @returns
 */
async function fetchGas(
  fileId?: string,
  isComplete?: boolean
): Promise<any | void> {
  const { url, apiKey } = loadJsonGas();
  const res = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey,
      fileId,
      isComplete,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }
  const text = await res.text();
  const gasData = JSON.parse(text) as GasData;
  if (gasData.status !== 200) {
    return console.error(`error found! ${gasData.status} ${gasData.message}`);
  }

  return gasData.message;
}
