import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TriangleArbitrage {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column('text', { array: true })
  public triangleTokens: string[];

  @Column('numeric')
  public profitRate: number;

  @CreateDateColumn()
  creationDate: Date;
}
