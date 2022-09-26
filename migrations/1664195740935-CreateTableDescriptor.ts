import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const tableName = 'descriptor';
export class CreateTableDescriptor1664195740935 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
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
            name: 'description',
            type: 'varchar',
            isPrimary: false,
            isGenerated: false,
            isNullable: true,
            isUnique: false,
          },
          {
            name: 'enabled',
            type: 'bool',
            isPrimary: false,
            isGenerated: false,
            isNullable: false,
            isUnique: false,
            default: true,
          },
          {
            name: 'wallet_id',
            type: 'integer',
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
          { columnNames: ['id'], isUnique: true, name: 'desc_id_index' },
          { columnNames: ['wallet_id'], isUnique: false, name: 'desc_wallet_index' },
        ],
        foreignKeys: [
          {
            columnNames: ['wallet_id'],
            referencedTableName: 'wallet',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(tableName);
  }
}
