-- ═══════════════════════════════════════════════════════════════════════════
-- PATCH SÉCURITÉ — Verrouillage RLS de la base de connaissances
-- ═══════════════════════════════════════════════════════════════════════════
-- PROBLÈME : les policies "Service role full access" avec USING (true) ne
-- limitaient RIEN — leur nom était trompeur. N'importe qui possédant la clé
-- anon (publique, présente dans le bundle front) pouvait lire, modifier et
-- supprimer les 91 PDF de formations (knowledge_chunks/knowledge_uploads).
--
-- CORRECTIF : on supprime ces policies. RLS étant activée, plus AUCUNE policy
-- = accès refusé pour anon et authenticated. Le service_role, lui, contourne
-- la RLS par design → le backend garde un accès complet.
--
-- ⚠️ PRÉREQUIS AVANT D'EXÉCUTER : dans le .env du backend, SUPABASE_KEY doit
-- être la clé service_role (Dashboard → Settings → API → service_role secret),
-- PAS la clé anon. Sinon le RAG et l'ingestion cesseront de fonctionner.
-- La clé service_role ne doit JAMAIS apparaître côté front (pas de préfixe VITE_).

DROP POLICY IF EXISTS "Service role full access on knowledge_chunks" ON knowledge_chunks;
DROP POLICY IF EXISTS "Service role full access on knowledge_uploads" ON knowledge_uploads;

-- Vérification : cette requête doit renvoyer 0 ligne (plus aucune policy)
SELECT policyname, tablename FROM pg_policies
WHERE tablename IN ('knowledge_chunks', 'knowledge_uploads');
