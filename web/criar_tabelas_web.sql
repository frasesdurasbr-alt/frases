-- Execute no SQL Editor do Supabase (após criar_tabela.sql)
-- Tabelas e políticas para o app web: controle de frases vistas por usuário

-- Coluna opcional para imagem de fundo por frase (URL de Unsplash/Pexels)
ALTER TABLE frases ADD COLUMN IF NOT EXISTS imagem_url TEXT;

-- Tabela: quais frases cada usuário já viu (evita repetição)
CREATE TABLE IF NOT EXISTS frases_vistas (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    frase_id BIGINT NOT NULL REFERENCES frases(id) ON DELETE CASCADE,
    visto_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, frase_id)
);

CREATE INDEX IF NOT EXISTS idx_frases_vistas_user ON frases_vistas(user_id);
CREATE INDEX IF NOT EXISTS idx_frases_vistas_data ON frases_vistas(visto_em);
CREATE INDEX IF NOT EXISTS idx_frases_vistas_user_data ON frases_vistas(user_id, (visto_em::date));

-- RLS: frases são leitura pública
ALTER TABLE frases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "frases_select_public" ON frases;
CREATE POLICY "frases_select_public" ON frases FOR SELECT USING (true);

-- RLS: frases_vistas: cada usuário só vê e insere os próprios registros
ALTER TABLE frases_vistas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "frases_vistas_select_own" ON frases_vistas;
CREATE POLICY "frases_vistas_select_own" ON frases_vistas FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "frases_vistas_insert_own" ON frases_vistas;
CREATE POLICY "frases_vistas_insert_own" ON frases_vistas FOR INSERT WITH CHECK (auth.uid() = user_id);
