-- AlterTable
CREATE SEQUENCE dictionary_id_seq;
ALTER TABLE "dictionary" ALTER COLUMN "id" SET DEFAULT nextval('dictionary_id_seq');
ALTER SEQUENCE dictionary_id_seq OWNED BY "dictionary"."id";
