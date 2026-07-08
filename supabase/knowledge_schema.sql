-- ═══════════════════════════════════════════════════════════════════════════
-- GIDEON RAG — Knowledge Base Schema (Supabase + pgvector)
-- ═══════════════════════════════════════════════════════════════════════════
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/etppvzemtmhdfistjlmy/sql

-- 1. Enable the pgvector extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 2. Create the knowledge_chunks table
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id              BIGSERIAL PRIMARY KEY,
  content         TEXT NOT NULL,                    -- The raw text chunk
  embedding       vector(1536),                     -- OpenAI text-embedding-3-small output
  category        TEXT NOT NULL DEFAULT 'general',  -- e.g. 'marketing', 'viralite', 'ecommerce', 'ugc', 'negotiation'
  tier            TEXT NOT NULL DEFAULT 'elite',    -- Access tier: 'creator_standard', 'vip_pro', 'elite'
  source_file     TEXT,                             -- Original PDF filename
  chunk_index     INTEGER DEFAULT 0,               -- Position within the source document
  metadata        JSONB DEFAULT '{}',               -- Extra metadata (page number, chapter title, etc.)
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create an index for fast similarity search
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
  ON knowledge_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- 4. Create the similarity search function
-- This function finds the most relevant knowledge chunks for a given query
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(1536),
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
    -- Tier-based access control:
    -- 'elite' can access everything
    -- 'vip_pro' can access 'vip_pro' and 'creator_standard'
    -- 'creator_standard' can only access 'creator_standard'
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
  status          TEXT DEFAULT 'processing',  -- 'processing', 'completed', 'error'
  error_message   TEXT,
  uploaded_at     TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

-- 6. Row Level Security (optional but recommended)
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_uploads ENABLE ROW LEVEL SECURITY;

-- Allow the service role to do everything
CREATE POLICY "Service role full access on knowledge_chunks"
  ON knowledge_chunks FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on knowledge_uploads"
  ON knowledge_uploads FOR ALL
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- DONE! After running this, add OPENAI_API_KEY to your .env file
-- ═══════════════════════════════════════════════════════════════════════════
