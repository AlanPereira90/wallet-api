import { Column, Entity } from 'typeorm';

import EntityBase from '../../common/entities/EntityBase';

@Entity({ name: 'descriptor' })
export default class DescriptorEntity extends EntityBase {
  @Column()
  name!: string;

  @Column()
  description?: string;

  @Column()
  enabled!: boolean;

  @Column({ name: 'wallet_id' })
  walletId!: number;
}
