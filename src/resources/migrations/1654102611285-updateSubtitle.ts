import { MigrationInterface, QueryRunner } from "typeorm";

export class updateSubtitle1654102611285 implements MigrationInterface {
    name = "updateSubtitle1654102611285";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "subtitle" ADD "status" "public"."subtitle_status_enum" NOT NULL DEFAULT 'COMPLETED'`
        );
        await queryRunner.query(
            `ALTER TABLE "subtitle" ADD "vttUrl" character varying`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subtitle" DROP COLUMN "vttUrl"`);
        await queryRunner.query(`ALTER TABLE "subtitle" DROP COLUMN "status"`);
    }
}
