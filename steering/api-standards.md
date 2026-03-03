---
inclusion: fileMatch
fileMatchPattern: '**/api/**/*,**/routes/**/*,**/controllers/**/*'
---

# API Standards

## RESTful API Design

### Endpoint Naming
- Use nouns, not verbs: `/users` not `/getUsers`
- Use plural nouns: `/users` not `/user`
- Use kebab-case: `/user-profiles`
- Nested resources: `/users/:id/posts`

### HTTP Methods
- `GET` - Retrieve resources (idempotent)
- `POST` - Create new resources
- `PUT` - Update entire resource (idempotent)
- `PATCH` - Partial update
- `DELETE` - Remove resource (idempotent)

### Status Codes
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server errors

### Request/Response Format
```typescript
// Success Response
{
  "data": {
    "id": "123",
    "name": "John Doe"
  },
  "meta": {
    "timestamp": "2026-03-02T00:00:00Z",
    "version": "1.0"
  }
}

// Error Response
{
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Invalid email format",
      "field": "email"
    }
  ]
}
```

### Pagination
```typescript
// Request
GET /api/users?page=2&limit=20

// Response
{
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Versioning
- URL versioning: `/api/v1/users`

### Authentication
- Use JWT tokens in Authorization header
- Format: `Authorization: Bearer <token>`


---

## WebSocket Standards

### Connection Management

**Server Setup:**
```typescript
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ 
  port: 8080,
  perMessageDeflate: false,
  clientTracking: true,
});

wss.on('connection', (ws, req) => {
  const clientId = generateClientId();
  
  // Store connection
  clients.set(clientId, {
    ws,
    userId: null,
    authenticated: false,
    lastPing: Date.now(),
  });
  
  // Setup handlers
  ws.on('message', (data) => handleMessage(clientId, data));
  ws.on('close', () => handleDisconnect(clientId));
  ws.on('error', (error) => handleError(clientId, error));
  ws.on('pong', () => handlePong(clientId));
});
```

**Client Connection:**
```typescript
class GameClient {
  private ws: WebSocket;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  connect(url: string) {
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      console.log('Connected');
      this.reconnectAttempts = 0;
      this.authenticate();
    };
    
    this.ws.onmessage = (event) => {
      this.handleMessage(JSON.parse(event.data));
    };
    
    this.ws.onclose = () => {
      console.log('Disconnected');
      this.reconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      setTimeout(() => this.connect(this.url), delay);
    }
  }
}
```

### Message Format

**Standard Message Structure:**
```typescript
interface WebSocketMessage {
  type: string;           // Message type (e.g., 'MOVE', 'ATTACK', 'CHAT')
  id?: string;            // Optional message ID for tracking
  timestamp: number;      // Unix timestamp
  data: any;              // Message payload
  error?: {               // Optional error info
    code: string;
    message: string;
  };
}
```

**Example Messages:**
```typescript
// Client → Server: Player movement
{
  "type": "PLAYER_MOVE",
  "id": "msg-123",
  "timestamp": 1709481600000,
  "data": {
    "x": 100,
    "y": 200,
    "direction": "north"
  }
}

// Server → Client: Position update
{
  "type": "POSITION_UPDATE",
  "timestamp": 1709481600100,
  "data": {
    "playerId": "player-456",
    "x": 100,
    "y": 200,
    "velocity": { "x": 0, "y": 5 }
  }
}

// Server → Client: Error
{
  "type": "ERROR",
  "timestamp": 1709481600200,
  "error": {
    "code": "INVALID_MOVE",
    "message": "Cannot move to that position"
  }
}
```

### Authentication

**Token-Based Authentication:**
```typescript
// Client sends auth message after connection
{
  "type": "AUTH",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// Server validates and responds
{
  "type": "AUTH_SUCCESS",
  "data": {
    "userId": "user-123",
    "sessionId": "session-456"
  }
}

// Or error
{
  "type": "AUTH_FAILED",
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Token expired or invalid"
  }
}
```

**Server-Side Validation:**
```typescript
async function handleAuth(clientId: string, token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const client = clients.get(clientId);
    client.userId = decoded.userId;
    client.authenticated = true;
    
    send(clientId, {
      type: 'AUTH_SUCCESS',
      data: { userId: decoded.userId }
    });
  } catch (error) {
    send(clientId, {
      type: 'AUTH_FAILED',
      error: { code: 'INVALID_TOKEN', message: error.message }
    });
    
    // Disconnect after failed auth
    setTimeout(() => disconnect(clientId), 1000);
  }
}
```

### Heartbeat / Keep-Alive

**Server-Side Ping:**
```typescript
// Ping all clients every 30 seconds
setInterval(() => {
  clients.forEach((client, clientId) => {
    if (Date.now() - client.lastPing > 60000) {
      // No pong received in 60s, disconnect
      disconnect(clientId);
    } else {
      client.ws.ping();
    }
  });
}, 30000);

function handlePong(clientId: string) {
  const client = clients.get(clientId);
  if (client) {
    client.lastPing = Date.now();
  }
}
```

**Client-Side Heartbeat:**
```typescript
class GameClient {
  private heartbeatInterval: NodeJS.Timeout;
  
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'PING', timestamp: Date.now() });
      }
    }, 30000);
  }
  
  stopHeartbeat() {
    clearInterval(this.heartbeatInterval);
  }
}
```

### Error Handling

**Error Codes:**
```typescript
enum WebSocketErrorCode {
  // Authentication
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_FAILED = 'AUTH_FAILED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // Validation
  INVALID_MESSAGE = 'INVALID_MESSAGE',
  INVALID_DATA = 'INVALID_DATA',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Game Logic
  INVALID_MOVE = 'INVALID_MOVE',
  INVALID_ACTION = 'INVALID_ACTION',
  PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND',
  
  // Server
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}
```

**Error Response:**
```typescript
function sendError(
  clientId: string,
  code: WebSocketErrorCode,
  message: string,
  details?: any
) {
  send(clientId, {
    type: 'ERROR',
    timestamp: Date.now(),
    error: {
      code,
      message,
      details,
    }
  });
}
```

### Rate Limiting

**Message Rate Limiting:**
```typescript
class RateLimiter {
  private limits = new Map<string, { count: number; resetAt: number }>();
  
  check(clientId: string, limit = 100, window = 60000): boolean {
    const now = Date.now();
    const clientLimit = this.limits.get(clientId);
    
    if (!clientLimit || now > clientLimit.resetAt) {
      this.limits.set(clientId, { count: 1, resetAt: now + window });
      return true;
    }
    
    if (clientLimit.count >= limit) {
      return false; // Rate limit exceeded
    }
    
    clientLimit.count++;
    return true;
  }
}

const rateLimiter = new RateLimiter();

function handleMessage(clientId: string, data: Buffer) {
  if (!rateLimiter.check(clientId)) {
    sendError(clientId, 'RATE_LIMIT_EXCEEDED', 'Too many messages');
    return;
  }
  
  // Process message
  processMessage(clientId, data);
}
```

### Broadcasting

**Broadcast to All:**
```typescript
function broadcast(message: WebSocketMessage, exclude?: string) {
  clients.forEach((client, clientId) => {
    if (clientId !== exclude && client.authenticated) {
      send(clientId, message);
    }
  });
}
```

**Broadcast to Room:**
```typescript
const rooms = new Map<string, Set<string>>(); // roomId → Set<clientId>

function broadcastToRoom(roomId: string, message: WebSocketMessage) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  room.forEach(clientId => {
    send(clientId, message);
  });
}

function joinRoom(clientId: string, roomId: string) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(clientId);
}

function leaveRoom(clientId: string, roomId: string) {
  const room = rooms.get(roomId);
  if (room) {
    room.delete(clientId);
    if (room.size === 0) {
      rooms.delete(roomId);
    }
  }
}
```

### Reconnection Strategy

**Client-Side Reconnection:**
```typescript
class GameClient {
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private reconnectAttempts = 0;
  private sessionId?: string;
  
  reconnect() {
    this.reconnectAttempts++;
    
    // Exponential backoff
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(this.url);
      
      // Try to restore session
      if (this.sessionId) {
        this.send({
          type: 'RESTORE_SESSION',
          data: { sessionId: this.sessionId }
        });
      }
    }, delay);
  }
}
```

**Server-Side Session Restoration:**
```typescript
const sessions = new Map<string, {
  userId: string;
  state: any;
  expiresAt: number;
}>();

function handleRestoreSession(clientId: string, sessionId: string) {
  const session = sessions.get(sessionId);
  
  if (!session || Date.now() > session.expiresAt) {
    sendError(clientId, 'SESSION_EXPIRED', 'Session not found or expired');
    return;
  }
  
  // Restore client state
  const client = clients.get(clientId);
  client.userId = session.userId;
  client.authenticated = true;
  
  send(clientId, {
    type: 'SESSION_RESTORED',
    data: session.state
  });
}
```

### Message Compression

**Enable Compression:**
```typescript
// Server
const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    threshold: 1024 // Only compress messages > 1KB
  }
});
```

### Binary Messages

**For Performance-Critical Data:**
```typescript
// Server sends binary position updates
function sendPositionUpdate(clientId: string, positions: Position[]) {
  const buffer = Buffer.alloc(positions.length * 12); // 3 floats per position
  
  positions.forEach((pos, i) => {
    buffer.writeFloatLE(pos.x, i * 12);
    buffer.writeFloatLE(pos.y, i * 12 + 4);
    buffer.writeFloatLE(pos.z, i * 12 + 8);
  });
  
  const client = clients.get(clientId);
  client.ws.send(buffer);
}

// Client receives binary data
ws.onmessage = (event) => {
  if (event.data instanceof ArrayBuffer) {
    const view = new DataView(event.data);
    const positions = [];
    
    for (let i = 0; i < view.byteLength; i += 12) {
      positions.push({
        x: view.getFloat32(i, true),
        y: view.getFloat32(i + 4, true),
        z: view.getFloat32(i + 8, true),
      });
    }
    
    updatePositions(positions);
  } else {
    // JSON message
    handleMessage(JSON.parse(event.data));
  }
};
```

### Best Practices

**Security:**
- Always validate and sanitize incoming messages
- Implement authentication before allowing game actions
- Use rate limiting to prevent abuse
- Validate message size to prevent memory attacks

**Performance:**
- Use binary messages for high-frequency updates
- Batch multiple updates into single message
- Implement message prioritization
- Use compression for large messages

**Reliability:**
- Implement heartbeat/ping-pong
- Handle reconnection gracefully
- Preserve session state for reconnection
- Use message IDs for tracking

**Monitoring:**
- Track connection count
- Monitor message rate per client
- Log errors and disconnections
- Track latency and message processing time

---

**Version:** 2.0  
**Last Updated:** 2026-03-03  
**Game Project:** MU H5 (HTML5 MMORPG)
