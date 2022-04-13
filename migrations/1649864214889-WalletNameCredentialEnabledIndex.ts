import { MigrationInterface, QueryRunner } from 'typeorm';

export class WalletNameCredentialEnabledIndex1649864214889 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('CREATE UNIQUE INDEX wallet_name_idx ON wallet ("name",enabled,credential_id)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('DROP INDEX wallet_name_idx');
  }
}
