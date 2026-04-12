import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  key: string;

  @Column({ type: 'text', nullable: true })
  value: string;

  @Column({ length: 200, nullable: true })
  label: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
