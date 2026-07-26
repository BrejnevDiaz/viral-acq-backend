-- ═══════════════════════════════════════════════════════════════════════════
-- GIDEON RAG — Knowledge Base Schema (Supabase + pgvector)
-- ═══════════════════════════════════════════════════════════════════════════
-- Version conforme à la PRODUCTION (migration Gemini, embeddings 768 dims).
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/etppvzemtmhdfistjlmy/sql
-- ⚠️ Les DROP effacent la base de connaissances existante — ré-ingérer les PDF après.

-- 1. Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Drop existing items (Gemini migration)
DROP FUNCTION IF EXISTS match_knowledge(vector, text, int);
DROP TABLE IF EXISTS knowledge_chunks CASCADE;
DROP TABLE IF EXISTS knowledge_uploads CASCADE;

-- 2. Create the knowledge_chunks table
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id              BIGSERIAL PRIMARY KEY,
  content         TEXT NOT NULL,
  embedding       vector(768),
  category        TEXT NOT NULL DEFAULT 'general',
  tier            TEXT NOT NULL DEFAULT 'elite',
  source_file     TEXT,
  chunk_index     INTEGER DEFAULT 0,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create an index for fast similarity search
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
  ON knowledge_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- 4. Create the similarity search function
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(768),
  match_tier TEXT DEFAULT 'elite',
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  category TEXT,
  tier TEXT,
  source_file TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.content,
    kc.category,
    kc.tier,
    kc.source_file,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM knowledge_chunks kc
  WHERE
    CASE
      WHEN match_tier = 'elite' THEN TRUE
      WHEN match_tier = 'vip_pro' THEN kc.tier IN ('vip_pro', 'creator_standard')
      WHEN match_tier = 'creator_standard' THEN kc.tier = 'creator_standard'
      ELSE FALSE
    END
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 5. Create the knowledge_uploads tracking table
CREATE TABLE IF NOT EXISTS knowledge_uploads (
  id              BIGSERIAL PRIMARY KEY,
  filename        TEXT NOT NULL,
  category        TEXT NOT NULL,
  tier            TEXT NOT NULL,
  chunks_count    INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'processing',
  error_message   TEXT,
  uploaded_at     TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

-- 6. Row Level Security
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on knowledge_chunks"
  ON knowledge_chunks FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on knowledge_uploads"
  ON knowledge_uploads FOR ALL
  USING (true)
  WITH CHECK (true);
