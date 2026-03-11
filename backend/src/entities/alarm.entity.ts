import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Alarm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  alarmId: string;

  @Column()
  type: string;

  @Column()
  device: string;

  @Column()
  severity: string;

  @Column()
  message: string;

  @Column()
  occurredAt: string;

  @Column()
  status: string;
}
