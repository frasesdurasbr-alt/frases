-- Script SQL para criar a tabela de frases no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar a tabela frases
CREATE TABLE IF NOT EXISTS frases (
    id BIGSERIAL PRIMARY KEY,
    frase TEXT NOT NULL,
    arquivo_origem VARCHAR(255),
    data_importacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para buscas mais rápidas
CREATE INDEX IF NOT EXISTS idx_frases_arquivo ON frases(arquivo_origem);
CREATE INDEX IF NOT EXISTS idx_frases_data ON frases(data_importacao);

-- Adicionar comentários para documentação
COMMENT ON TABLE frases IS 'Tabela para armazenar frases importadas de arquivos txt';
COMMENT ON COLUMN frases.id IS 'Identificador único da frase';
COMMENT ON COLUMN frases.frase IS 'Texto da frase';
COMMENT ON COLUMN frases.arquivo_origem IS 'Nome do arquivo de onde a frase foi extraída';
COMMENT ON COLUMN frases.data_importacao IS 'Data e hora da importação da frase';

-- Verificar a tabela criada
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'frases'
ORDER BY 
    ordinal_position;
