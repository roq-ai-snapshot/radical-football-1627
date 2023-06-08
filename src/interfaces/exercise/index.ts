import { CoachInterface } from 'interfaces/coach';
import { PlayerInterface } from 'interfaces/player';
import { GetQueryInterface } from 'interfaces';

export interface ExerciseInterface {
  id?: string;
  name: string;
  status: string;
  coach_id: string;
  player_id: string;
  created_at?: Date;
  updated_at?: Date;

  coach?: CoachInterface;
  player?: PlayerInterface;
  _count?: {};
}

export interface ExerciseGetQueryInterface extends GetQueryInterface {
  filter: {
    id?: string;
    name?: string;
    status?: string;
    coach_id?: string;
    player_id?: string;
  };
}
