"""
KARA Backend - Real-time progress updates via WebSocket
Handles live streaming of agent logs, execution states, and completed artifacts.
"""
from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/ws", tags=["Real-time Connection"])


# ── In-Memory Connection Manager ─────────────────────────────

class ConnectionManager:
    def __init__(self):
        # Maps project_id -> list of active websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, project_id: str, websocket: WebSocket):
        await websocket.accept()
        if project_id not in self.active_connections:
            self.active_connections[project_id] = []
        self.active_connections[project_id].append(websocket)

    def disconnect(self, project_id: str, websocket: WebSocket):
        if project_id in self.active_connections:
            self.active_connections[project_id].remove(websocket)
            if not self.active_connections[project_id]:
                del self.active_connections[project_id]

    async def send_message_to_project(self, project_id: str, message: dict):
        """Broadcast a message to all connected clients for a project."""
        if project_id in self.active_connections:
            for connection in self.active_connections[project_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    # Stale connection
                    pass


# Global WebSocket manager instance
ws_manager = ConnectionManager()


# ── WebSocket Endpoint ───────────────────────────────────────

@router.websocket("/projects/{project_id}")
async def websocket_project_progress(websocket: WebSocket, project_id: str):
    """Real-time progress socket for project compilation."""
    await ws_manager.connect(project_id, websocket)
    try:
        # Keep connection open and listen for client heartbeats or queries
        while True:
            data = await websocket.receive_text()
            # Send simple ping back for heartbeat
            await websocket.send_json({"type": "ping", "data": data})
    except WebSocketDisconnect:
        ws_manager.disconnect(project_id, websocket)
    except Exception:
        ws_manager.disconnect(project_id, websocket)
