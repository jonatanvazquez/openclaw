import { mkdirSync, appendFileSync } from "fs";
import { join } from "path";

const STORE_BASE = process.env.OPENCLAW_MESSAGE_STORE ?? "/Users/administrator/clawd/message-store";

export interface StoredMessage {
  ts: string;
  channel: string;
  type: "dm" | "group";
  groupJid?: string;
  groupName?: string;
  from?: string;
  fromName?: string;
  body: string;
  mediaType?: string | null;
  observeOnly?: boolean;
}

function ensureDir(dir: string) {
  mkdirSync(dir, { recursive: true });
}

function todayFile(subdir: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const dir = join(STORE_BASE, "raw", subdir);
  ensureDir(dir);
  return join(dir, `${date}.jsonl`);
}

export function archiveMessage(msg: StoredMessage): void {
  try {
    const file = todayFile("archive");
    appendFileSync(file, JSON.stringify(msg) + "\n");
  } catch {}
}

export function storeObservedMessage(msg: StoredMessage): void {
  try {
    const file = todayFile("observed");
    appendFileSync(file, JSON.stringify({ ...msg, observeOnly: true }) + "\n");
  } catch {}
}
