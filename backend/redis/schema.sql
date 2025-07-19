-- =============================================
-- Redis Database Structure for TCC Chat System
-- =============================================
-- This file documents the Redis key structure and data patterns
-- used in the TCC chat application for session management

-- =============================================
-- KEY PATTERNS AND STRUCTURE
-- =============================================

-- Session Keys
-- Pattern: session:{sessionId}
-- Type: Hash
-- Description: Stores session metadata
-- Fields:
--   - id: string (session UUID)
--   - userId: string (user identifier)
--   - createdAt: string (ISO date)
--   - lastActivity: string (ISO date)
--   - messageCount: string (number as string)
--   - title: string (session title)
--   - model: string (AI model used)
-- TTL: SESSION_TTL seconds (default: 3600)
-- Example: session:550e8400-e29b-41d4-a716-446655440000

-- User Session Lists
-- Pattern: user:{userId}:sessions
-- Type: List
-- Description: Lists all session IDs for a user (newest first)
-- Values: session IDs (strings)
-- TTL: SESSION_TTL seconds (default: 3600)
-- Example: user:user123:sessions

-- Session Message Lists
-- Pattern: session:{sessionId}:messages
-- Type: List
-- Description: Lists all message IDs for a session (newest first)
-- Values: message IDs (strings)
-- TTL: SESSION_TTL seconds (default: 3600)
-- Example: session:550e8400-e29b-41d4-a716-446655440000:messages

-- Message Keys
-- Pattern: message:{messageId}
-- Type: Hash
-- Description: Stores individual message data
-- Fields:
--   - id: string (message UUID)
--   - sessionId: string (parent session ID)
--   - role: string ('user' | 'assistant' | 'system')
--   - content: string (message content)
--   - timestamp: string (ISO date)
--   - model: string (AI model used)
--   - promptTokens: string (number as string)
--   - completionTokens: string (number as string)
--   - totalTokens: string (number as string)
-- TTL: SESSION_TTL seconds (default: 3600)
-- Example: message:550e8400-e29b-41d4-a716-446655440001

-- =============================================
-- REDIS COMMANDS FOR DATA OPERATIONS
-- =============================================

-- Create a session:
-- HSET session:{sessionId} id {sessionId} userId {userId} createdAt {ISO_DATE} lastActivity {ISO_DATE} messageCount "0" title {title} model {model}
-- EXPIRE session:{sessionId} 3600
-- LPUSH user:{userId}:sessions {sessionId}
-- EXPIRE user:{userId}:sessions 3600

-- Add a message to session:
-- HSET message:{messageId} id {messageId} sessionId {sessionId} role {role} content {content} timestamp {ISO_DATE} model {model}
-- EXPIRE message:{messageId} 3600
-- LPUSH session:{sessionId}:messages {messageId}
-- EXPIRE session:{sessionId}:messages 3600
-- HINCRBY session:{sessionId} messageCount 1

-- Get session data:
-- HGETALL session:{sessionId}

-- Get session messages (latest 20):
-- LRANGE session:{sessionId}:messages 0 19

-- Get user sessions:
-- LRANGE user:{userId}:sessions 0 -1

-- Delete session:
-- LRANGE session:{sessionId}:messages 0 -1  (get all message IDs)
-- DEL message:{messageId1} message:{messageId2} ...  (delete all messages)
-- DEL session:{sessionId}:messages
-- DEL session:{sessionId}
-- LREM user:{userId}:sessions 1 {sessionId}

-- =============================================
-- CONFIGURATION VARIABLES
-- =============================================

-- SESSION_TTL: Time to live for sessions in seconds (default: 3600 = 1 hour)
-- MAX_SESSIONS_PER_USER: Maximum number of sessions per user (default: 5)
-- MAX_MESSAGES_PER_SESSION: Maximum messages per session (default: 100)

-- =============================================
-- PERFORMANCE CONSIDERATIONS
-- =============================================

-- 1. All keys have TTL to automatically expire old sessions
-- 2. Lists are trimmed to prevent unlimited growth
-- 3. Hash operations are O(1) for field access
-- 4. List operations are O(1) for push/pop operations
-- 5. Range operations on lists are O(S+N) where S is start and N is elements

-- =============================================
-- MONITORING QUERIES
-- =============================================

-- Count all sessions:
-- EVAL "return #redis.call('keys', 'session:*')" 0

-- Count user sessions:
-- LLEN user:{userId}:sessions

-- Count messages in session:
-- LLEN session:{sessionId}:messages

-- Get memory usage:
-- INFO memory

-- Get Redis info:
-- INFO server
