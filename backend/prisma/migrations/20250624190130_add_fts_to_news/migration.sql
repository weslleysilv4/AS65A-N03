-- 1. Adiciona a nova coluna 'search_vector' do tipo tsvector.
ALTER TABLE "News" ADD COLUMN "search_vector" tsvector;

-- 2. Cria uma função que será executada pelo gatilho (trigger).
CREATE OR REPLACE FUNCTION update_news_search_vector()
RETURNS trigger AS $$
BEGIN
    DECLARE
        tags_text TEXT := array_to_string(coalesce(NEW."tagsKeywords", '{}'), ' ');
    BEGIN
        NEW.search_vector :=
            setweight(to_tsvector('portuguese', coalesce(NEW.title, '')), 'A') ||
            setweight(to_tsvector('portuguese', tags_text), 'A') ||
            setweight(to_tsvector('portuguese', coalesce(NEW.text, '')), 'B');
        RETURN NEW;
    END;
END;
$$ LANGUAGE plpgsql;

-- 3. Cria o gatilho (trigger) que executa a função acima.
CREATE TRIGGER news_search_vector_update
BEFORE INSERT OR UPDATE ON "News"
FOR EACH ROW EXECUTE FUNCTION update_news_search_vector();

-- 4. Cria um índice GIN na nossa nova coluna.
CREATE INDEX news_search_vector_idx ON "News" USING gin(search_vector);

-- 5. Atualiza todas as notícias já existentes para popular a coluna.
--    Corrigido "tagsKeywords" com aspas duplas.
UPDATE "News" SET search_vector = 
    setweight(to_tsvector('portuguese', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('portuguese', array_to_string(coalesce("tagsKeywords", '{}'), ' ')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(text, '')), 'B');