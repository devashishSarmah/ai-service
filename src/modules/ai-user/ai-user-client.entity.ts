import {
  Column,
  Entity, PrimaryColumn
} from 'typeorm';

@Entity({
  name: 'ai_user_client',
})
export class AIUserClient {

  @PrimaryColumn()
  client_id: string;

  @Column({ nullable: false })
  client_secret: string;
}
