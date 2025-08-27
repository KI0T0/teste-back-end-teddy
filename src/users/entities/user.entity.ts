import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
import { UrlEntity } from '../../urls/entities/url.entity';
import { ToLowerCase } from '../../utils/decorators';
  
  @Entity('users')
  export class UserEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;
  
    @Column({ name: 'email' })
    @ToLowerCase()
    email: string;
  
    @Column({ name: 'password_hash', type: 'varchar', length: 255 })
    passwordHash: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
  
    @OneToMany(() => UrlEntity, (url) => url.user)
    urls: UrlEntity[];
  }
  