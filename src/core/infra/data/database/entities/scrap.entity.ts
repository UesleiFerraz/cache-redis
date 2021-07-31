import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { UserEntity } from "./user.entity";

@Entity({ name: "scraps" })
export class ScrapEntity {
  @PrimaryColumn()
  uid: string;

  @Column({ length: "50" })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ name: "user_uid" })
  userUid: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, user => user.scraps)
  user: UserEntity;

  @BeforeInsert()
  private beforeInsert = () => {
    this.uid = uuid();
  };
}
