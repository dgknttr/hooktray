import Dexie, { type Table } from "dexie"
import type { LocalRequestSnapshot, RequestSnapshotWire } from "@/types"

export const MAX_PER_TOKEN = 500

interface StoredRequest extends RequestSnapshotWire {
  token: string
  localOrdinal?: number
  isRead?: boolean
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

function hasLocalMetadata(
  snapshot: RequestSnapshotWire | LocalRequestSnapshot
): snapshot is LocalRequestSnapshot {
  return "localOrdinal" in snapshot && "isRead" in snapshot
}

async function getNextLocalOrdinal(token: string): Promise<number> {
  const rows = await db.requests
    .where("token")
    .equals(token)
    .sortBy("receivedAt")
  let nextOrdinal = 1
  for (const row of rows) {
    const localOrdinal = row.localOrdinal ?? nextOrdinal
    nextOrdinal = Math.max(nextOrdinal, localOrdinal + 1)
  }
  return nextOrdinal
}

export async function addRequest(
  token: string,
  snapshot: RequestSnapshotWire | LocalRequestSnapshot
): Promise<void> {
  const localOrdinal = hasLocalMetadata(snapshot)
    ? snapshot.localOrdinal
    : await getNextLocalOrdinal(token)
  const isRead = hasLocalMetadata(snapshot) ? snapshot.isRead : false

  await db.requests.put({ ...snapshot, token, localOrdinal, isRead })
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

export async function hydrate(token: string): Promise<LocalRequestSnapshot[]> {
  const rows = await db.requests
    .where("token")
    .equals(token)
    .sortBy("receivedAt")
  let nextLegacyOrdinal = 1
  const hydrated = rows.map((row) => {
    const localOrdinal = row.localOrdinal ?? nextLegacyOrdinal
    nextLegacyOrdinal = Math.max(nextLegacyOrdinal, localOrdinal + 1)

    return {
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
      localOrdinal,
      isRead: row.isRead ?? false,
    }
  })

  return hydrated.reverse()
}

export async function clearHistory(token: string): Promise<void> {
  await db.requests.where("token").equals(token).delete()
}

export async function markRequestRead(token: string, id: string): Promise<void> {
  const row = await db.requests.get(id)
  if (row?.token !== token) return
  await db.requests.update(id, { isRead: true })
}
