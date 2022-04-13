import { Column, Entity } from 'typeorm';

import EntityBase from '../../common/entities/EntityBase';

@Entity({ name: 'wallet' })
export default class WalletEntity extends EntityBase {
  @Column()
  name!: string;

  @Column()
  enabled!: boolean;

  @Column({ name: 'credential_id' })
  credentialId!: string;
}
