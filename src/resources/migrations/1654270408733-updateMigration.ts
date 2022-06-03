import { MigrationInterface, QueryRunner } from "typeorm";

export class updateMigration1654270408733 implements MigrationInterface {
    name = "updateMigration1654270408733";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."subtitle_status_enum" AS ENUM('IDLE', 'PROCESSING', 'COMPLETED', 'FAILED')`
        );
        await queryRunner.query(
            `ALTER TABLE "subtitle" ADD "status" "public"."subtitle_status_enum" NOT NULL DEFAULT 'PROCESSING'`
        );
        await queryRunner.query(
            `ALTER TABLE "subtitle" ADD "vttUrl" character varying`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subtitle" DROP COLUMN "vttUrl"`);
        await queryRunner.query(`ALTER TABLE "subtitle" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."subtitle_status_enum"`);
    }
}
