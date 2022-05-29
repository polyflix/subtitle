import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1653854241298 implements MigrationInterface {
    name = "initialMigration1653854241298";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."subtitle_language_enum" AS ENUM('fr-FR', 'en-US')`
        );
        await queryRunner.query(
            `CREATE TABLE "public"."subtitle" ("subtitleId" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" "public"."subtitle_language_enum" NOT NULL DEFAULT 'fr-FR', "videoSlug" character varying NOT NULL, CONSTRAINT "PK_ec7d7b0aed3fb68a27c6366c50d" PRIMARY KEY ("subtitleId"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "public"."subtitle"`);
        await queryRunner.query(`DROP TYPE "public"."subtitle_language_enum"`);
    }
}
