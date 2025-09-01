export type Cursor = { x: number; y: number };

export type PresenceDoc = {
  $id: string;
  canvasId: string;
  userId: string;
  name: string;
  color: string;
  cursor?: Cursor;
  lastSeen: string; // ISO timestamp
  tabId?: string;
};
