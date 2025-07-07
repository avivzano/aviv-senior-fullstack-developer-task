import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRoleTypeToArray1680000000001 implements MigrationInterface {
  name = 'ChangeRoleTypeToArray1680000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "role" TO "roles"`);
  
    await queryRunner.query(`
      UPDATE "users"
      SET "roles" = json('[' || json_quote("roles") || ']')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "users" SET "roles" = json_extract("roles", '$[0]')`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "roles" TO "role"`);
  }
}