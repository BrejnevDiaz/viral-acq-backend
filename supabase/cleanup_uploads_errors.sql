-- ═══════════════════════════════════════════════════════════════════════════
-- NETTOYAGE — Lignes "erreur" fossiles de knowledge_uploads
-- ═══════════════════════════════════════════════════════════════════════════
-- Diagnostic du 12/07/2026 : 182 lignes status='error' provenant de deux
-- anciennes tentatives d'ingestion ratées (91 × clé OpenAI invalide,
-- 91 × conflit dimensions 1536 vs 768). Vérifié : CHAQUE fichier en erreur
-- possède une version 'completed' réussie — la base de savoir (615 chunks)
-- est complète. Ces lignes ne sont que du bruit visuel dans l'admin.
-- Ce script ne touche PAS à knowledge_chunks (le savoir ingéré).

DELETE FROM knowledge_uploads WHERE status = 'error';

-- Vérification : il ne doit rester que des lignes 'completed'
SELECT status, COUNT(*) FROM knowledge_uploads GROUP BY status;
