import Dexie, { type Table } from "dexie"
import type { RequestSnapshotWire } from "@/types"

const MAX_PER_TOKEN = 500

interface StoredRequest extends RequestSnapshotWire {
  token: string
}

export class HookTrayDb extends Dexie {
  requests!: Table<StoredRequest, string>

  constructor() {
    super("hooktray")
    this.version(1).stores({
      requests: "id, token, receivedAt, method",
    })
  }
}

export const db = new HookTrayDb()

export async function addRequest(
  token: string,
  snapshot: RequestSnapshotWire
): Promise<void> {
  await db.requests.put({ ...snapshot, token })
  const count = await db.requests.where("token").equals(token).count()
  if (count > MAX_PER_TOKEN) {
    const excess = count - MAX_PER_TOKEN
    const oldest = await db.requests
      .where("token")
      .equals(token)
      .sortBy("receivedAt")
    const toDelete = oldest.slice(0, excess).map((r) => r.id)
    await db.requests.bulkDelete(toDelete)
  }
}

export async function hydrate(token: string): Promise<RequestSnapshotWire[]> {
  const rows = await db.requests
    .where("token")
    .equals(token)
    .sortBy("receivedAt")
  return rows.reverse().map((row) => ({
    id: row.id,
    receivedAt: row.receivedAt,
    method: row.method,
    path: row.path,
    rawQueryString: row.rawQueryString,
    queryParams: row.queryParams,
    headers: row.headers,
    body: row.body,
    bodyEncoding: row.bodyEncoding,
    isBase64Encoded: row.isBase64Encoded,
    bodyPreview: row.bodyPreview,
    sizeBytes: row.sizeBytes,
  }))
}

export async function clearHistory(token: string): Promise<void> {
  await db.requests.where("token").equals(token).delete()
}
