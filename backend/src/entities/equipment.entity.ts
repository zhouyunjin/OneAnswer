import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  equipmentId: string;

  @Column()
  equipmentName: string;

  @Column()
  equipmentType: string;

  @Column()
  status: string;

  @Column()
  runningHours: number;

  @Column()
  maintenanceDate: string;

  @Column({ nullable: true })
  nextMaintenanceDate: string;

  @Column()
  efficiency: number;

  @Column({ nullable: true })
  faultCount: number;

  @Column({ nullable: true })
  lastFaultTime: string;

  @Column('json', { nullable: true })
  parameters: {
    temperature?: number;
    pressure?: number;
    speed?: number;
    flow?: number;
  };
}
