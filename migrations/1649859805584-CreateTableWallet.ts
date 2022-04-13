import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const tableName = 'wallet';
export class CreateTableWallet1649859805584 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isPrimary: false,
            isGenerated: false,
            isNullable: false,
            isUnique: false,
          },
          {
            name: 'enabled',
            type: 'boolean',
            isPrimary: false,
            isGenerated: false,
            isNullable: false,
            isUnique: false,
            default: true,
          },
          {
            name: 'credential_id',
            type: 'varchar',
            isPrimary: false,
            isGenerated: false,
            isNullable: false,
            isUnique: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isPrimary: false,
            isGenerated: false,
            isNullable: false,
            isUnique: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isPrimary: false,
            isGenerated: false,
            isNullable: false,
            isUnique: false,
            default: 'now()',
          },
        ],
        indices: [
          { columnNames: ['id'], isUnique: true, name: 'wl_id_index' },
          { columnNames: ['credential_id'], isUnique: false, name: 'wl_credential_index' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable(tableName);
  }
}
