import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeStatusToEnum1680000000002 implements MigrationInterface {
  name = 'ChangeStatusToEnum1680000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "status" TO "old_status"`,
    );
    await queryRunner.query(`ALTER TABLE "users"
            ADD COLUMN "status" TEXT NOT NULL DEFAULT 'Enabled'`);
    await queryRunner.query(`
            UPDATE "users"
            SET "status" = CASE
                               WHEN old_status IN (1, '1') THEN 'Enabled'
                               ELSE 'Disabled'
                END
        `);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "old_status"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users"
            ADD COLUMN "status_tmp" BOOLEAN NOT NULL DEFAULT 1`);
    await queryRunner.query(`
            UPDATE "users"
            SET "status_tmp" = CASE
                                   WHEN status = 'Enabled' THEN 1
                                   ELSE 0
                END
        `);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "status_tmp" TO "status"`,
    );
  }
}
