import { MigrationInterface, QueryRunner } from "typeorm";

export class initialSubtitles1653723948856 implements MigrationInterface {
    name = "initialSubtitles1653723948856";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "subtitle"."subtitle_language_enum" AS ENUM('fr-FR', 'en-US')`
        );
        await queryRunner.query(
            `CREATE TABLE "subtitle" ("subtitleId" uuid NOT NULL, "language" "subtitle"."subtitle_language_enum" NOT NULL DEFAULT 'fr-FR', CONSTRAINT "PK_ec7d7b0aed3fb68a27c6366c50d" PRIMARY KEY ("subtitleId"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subtitle"`);
        await queryRunner.query(
            `DROP TYPE "subtitle"."subtitle_language_enum"`
        );
    }
}
