import {
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('channels')
export class Channel {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryColumn()
  channelId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  created_at: string;

  @Column()
  elevation: string;

  @Column()
  last_entry_id: number;

  @Column()
  public_flag: boolean;

  @Column()
  url?: string;

  @Column()
  ranking: number;

  @Column()
  github_url?: string;

  @Column((type) => Tag)
  tags: Tag[];
}

export class Tag {
  @Column()
  id: number;

  @Column()
  name: string;
}
