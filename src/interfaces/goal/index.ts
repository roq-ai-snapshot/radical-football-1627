import { PlayerInterface } from 'interfaces/player';
import { GetQueryInterface } from 'interfaces';

export interface GoalInterface {
  id?: string;
  name: string;
  status: string;
  player_id: string;
  created_at?: Date;
  updated_at?: Date;

  player?: PlayerInterface;
  _count?: {};
}

export interface GoalGetQueryInterface extends GetQueryInterface {
  filter: {
    id?: string;
    name?: string;
    status?: string;
    player_id?: string;
  };
}
