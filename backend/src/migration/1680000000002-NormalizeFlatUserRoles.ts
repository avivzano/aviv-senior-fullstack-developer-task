import { MigrationInterface, QueryRunner } from 'typeorm';

export class NormalizeFlatUserRoles1680000000003 implements MigrationInterface {
  name = 'NormalizeFlatUserRoles1680000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`SELECT id, roles
                                               FROM users`);

    for (const user of users) {
      let roles: string[];

      try {
        roles = JSON.parse(user.roles);
      } catch {
        continue;
      }

      const normalizedRoles = new Set<string>();

      for (const role of roles) {
        if (role === 'Admin') {
          normalizedRoles.add('Admin');
          normalizedRoles.add('Editor');
          normalizedRoles.add('User');
        } else if (role === 'Editor') {
          normalizedRoles.add('Editor');
          normalizedRoles.add('User');
        } else if (role === 'User') {
          normalizedRoles.add('User');
        }
      }

      await queryRunner.query(
        `UPDATE users
         SET roles = ?
         WHERE id = ?`,
        [JSON.stringify([...normalizedRoles]), user.id],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`SELECT id, roles
                                               FROM users`);

    for (const user of users) {
      let roles: string[];

      try {
        roles = JSON.parse(user.roles);
      } catch {
        continue;
      }

      let restoredRoles: string[];

      if (roles.includes('Admin')) {
        restoredRoles = ['Admin'];
      } else if (roles.includes('Editor')) {
        restoredRoles = ['Editor'];
      } else if (roles.includes('User')) {
        restoredRoles = ['User'];
      } else {
        restoredRoles = []; // or null if needed
      }

      await queryRunner.query(
        `UPDATE users
                 SET roles = ?
                 WHERE id = ?`,
        [JSON.stringify(restoredRoles), user.id],
      );
    }
  }
}
