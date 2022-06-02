import { MigrationInterface, QueryRunner } from "typeorm";

export class updateSubtitleEnum1654187173353 implements MigrationInterface {
    name = "updateSubtitleEnum1654187173353";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TYPE "public"."subtitle_status_enum" RENAME TO "subtitle_status_enum_old"`
        );
        await queryRunner.query(
            `CREATE TYPE "public"."subtitle_status_enum" AS ENUM('IDLE', 'PROCESSING', 'COMPLETED', 'FAILED')`
        );
        await queryRunner.query(
            `ALTER TABLE "subtitle" ALTER COLUMN "status" DROP DEFAULT`
        );
        await queryRunner.query(
            `ALTER TABLE "subtitle" ALTER COLUMN "status" TYPE "public"."subtitle_status_enum" USING "status"::"text"::"public"."subtitle_status_enum"`
        );
        await queryRunner.query(
            `ALTER TABLE "subtitle" ALTER COLUMN "status" SET DEFAULT 'PROCESSING'`
        );
        await queryRunner.query(
            `DROP TYPE "public"."subtitle_status_enum_old"`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."subtitle_status_enum_old" AS ENUM('UPLOADING', 'PROCESSING', 'COMPLETED', 'FAILED')`
        );
        await queryRunner.query(
            `ALTER TABLE "subtitle" ALTER COLUMN "status" DROP DEFAULT`
        );
        await queryRunner.query(
            `ALTER TABLE "subtitle" ALTER COLUMN "status" TYPE "public"."subtitle_status_enum_old" USING "status"::"text"::"public"."subtitle_status_enum_old"`
        );
        await queryRunner.query(
            `ALTER TABLE "subtitle" ALTER COLUMN "status" SET DEFAULT 'COMPLETED'`
        );
        await queryRunner.query(`DROP TYPE "public"."subtitle_status_enum"`);
        await queryRunner.query(
            `ALTER TYPE "public"."subtitle_status_enum_old" RENAME TO "subtitle_status_enum"`
        );
    }
}
