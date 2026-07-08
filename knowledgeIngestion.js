// ═══════════════════════════════════════════════════════════════════════════
// GIDEON RAG — Knowledge Ingestion Engine
// ═══════════════════════════════════════════════════════════════════════════
// Takes a PDF, chunks it, generates embeddings, stores in Supabase pgvector.

import { createClient } from "@supabase/supabase-js";
import { embedTexts, activeProvider } from "./aiProvider.js";

// ─── Text Chunking ──────────────────────────────────────────────────────────
/**
 * Split text into overlapping chunks for embedding.
 * @param {string} text - The full text to chunk
 * @param {number} maxTokens - Approximate max tokens per chunk (~4 chars/token)
 * @param {number} overlapTokens - Number of overlapping tokens between chunks
 * @returns {string[]} Array of text chunks
 */
export function chunkText(text, maxTokens = 500, overlapTokens = 50) {
  const maxChars = maxTokens * 4;     // ~4 chars per token (rough estimate)
  const overlapChars = overlapTokens * 4;
  const chunks = [];

  // Clean up the text
  const cleaned = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Split by paragraphs first, then by sentences if too long
  const paragraphs = cleaned.split(/\n\n+/);
  let currentChunk = "";

  for (const para of paragraphs) {
    // If adding this paragraph would exceed the limit
    if (currentChunk.length + para.length > maxChars && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      // Keep overlap from the end of the current chunk
      const overlapStart = Math.max(0, currentChunk.length - overlapChars);
      currentChunk = currentChunk.slice(overlapStart) + "\n\n" + para;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + para;
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // Safety: if any chunk is still too long, split by sentences
  const finalChunks = [];
  for (const chunk of chunks) {
    if (chunk.length > maxChars * 1.5) {
      const sentences = chunk.split(/(?<=[.!?])\s+/);
      let subChunk = "";
      for (const sentence of sentences) {
        if (subChunk.length + sentence.length > maxChars && subChunk.length > 0) {
          finalChunks.push(subChunk.trim());
          const overlapStart = Math.max(0, subChunk.length - overlapChars);
          subChunk = subChunk.slice(overlapStart) + " " + sentence;
        } else {
          subChunk += (subChunk ? " " : "") + sentence;
        }
      }
      if (subChunk.trim()) finalChunks.push(subChunk.trim());
    } else {
      finalChunks.push(chunk);
    }
  }

  return finalChunks;
}

// ─── Embedding Generation ───────────────────────────────────────────────────
/**
 * Generate embeddings for an array of text chunks (Gemini ou OpenAI selon .env).
 * Processes in batches to avoid rate limits.
 * @param {string[]} chunks - Array of text chunks
 * @param {number} batchSize - Number of chunks to embed at once
 * @returns {number[][]} Array of embedding vectors
 */
export async function generateEmbeddings(chunks, batchSize = 20) {
  const allEmbeddings = [];

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    console.log(`   📊 Embedding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)} (${batch.length} chunks)...`);

    const embeddings = await embedTexts(batch, { taskType: "RETRIEVAL_DOCUMENT" });
    allEmbeddings.push(...embeddings);

    // Small delay between batches to be nice to the API
    if (i + batchSize < chunks.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  return allEmbeddings;
}

// ─── Full Ingestion Pipeline ────────────────────────────────────────────────
/**
 * Complete pipeline: takes raw text, chunks it, embeds it, stores in Supabase.
 * @param {Object} params
 * @param {string} params.text - The extracted PDF text
 * @param {string} params.filename - Original filename
 * @param {string} params.category - Knowledge category (marketing, viralite, etc.)
 * @param {string} params.tier - Access tier (creator_standard, vip_pro, elite)
 * @returns {Object} Result with chunks count and upload ID
 */
export async function ingestKnowledge({ text, filename, category, tier }) {
  // Initialize clients
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL et SUPABASE_KEY requis dans .env");
  }
  if (!activeProvider()) {
    throw new Error("GEMINI_API_KEY ou OPENAI_API_KEY requis dans .env");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Track the upload
  const { data: upload, error: uploadErr } = await supabase
    .from("knowledge_uploads")
    .insert({ filename, category, tier, status: "processing" })
    .select()
    .single();

  if (uploadErr) throw new Error(`Upload tracking failed: ${uploadErr.message}`);
  const uploadId = upload.id;

  try {
    // 2. Chunk the text
    console.log(`📄 Chunking "${filename}"...`);
    const chunks = chunkText(text);
    console.log(`   ✅ ${chunks.length} chunks created`);

    if (chunks.length === 0) {
      throw new Error("Aucun texte exploitable trouvé dans le PDF");
    }

    // 3. Generate embeddings
    console.log(`🧠 Generating embeddings (${activeProvider()})...`);
    const embeddings = await generateEmbeddings(chunks);
    console.log(`   ✅ ${embeddings.length} embeddings generated`);

    // 4. Store in Supabase
    console.log(`💾 Storing in Supabase...`);
    const rows = chunks.map((content, i) => ({
      content,
      embedding: JSON.stringify(embeddings[i]),
      category,
      tier,
      source_file: filename,
      chunk_index: i,
      metadata: { total_chunks: chunks.length },
    }));

    // Insert in batches of 50
    for (let i = 0; i < rows.length; i += 50) {
      const batch = rows.slice(i, i + 50);
      const { error: insertErr } = await supabase
        .from("knowledge_chunks")
        .insert(batch);

      if (insertErr) {
        throw new Error(`Insert batch ${i} failed: ${insertErr.message}`);
      }
    }

    // 5. Update upload status
    await supabase
      .from("knowledge_uploads")
      .update({
        status: "completed",
        chunks_count: chunks.length,
        completed_at: new Date().toISOString(),
      })
      .eq("id", uploadId);

    console.log(`✅ "${filename}" ingested: ${chunks.length} chunks stored`);
    return { uploadId, chunksCount: chunks.length, status: "completed" };

  } catch (err) {
    // Mark upload as failed
    await supabase
      .from("knowledge_uploads")
      .update({ status: "error", error_message: err.message })
      .eq("id", uploadId);

    throw err;
  }
}
