import { MigrationInterface, QueryRunner } from "typeorm";

export class updateSubtitle1654268090601 implements MigrationInterface {
    name = "updateSubtitle1654268090601";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."subtitle_language_enum" AS ENUM('fr-FR', 'en-US')`
        );
        await queryRunner.query(
            `CREATE TYPE "public"."subtitle_status_enum" AS ENUM('IDLE', 'PROCESSING', 'COMPLETED', 'FAILED')`
        );
        await queryRunner.query(
            `CREATE TABLE "subtitle" ("subtitleId" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" "public"."subtitle_language_enum" NOT NULL DEFAULT 'fr-FR', "videoSlug" character varying NOT NULL, "status" "public"."subtitle_status_enum" NOT NULL DEFAULT 'PROCESSING', "vttUrl" character varying, CONSTRAINT "PK_ec7d7b0aed3fb68a27c6366c50d" PRIMARY KEY ("subtitleId"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subtitle"`);
        await queryRunner.query(`DROP TYPE "public"."subtitle_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."subtitle_language_enum"`);
    }
}
