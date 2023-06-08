import { ExerciseInterface } from 'interfaces/exercise';
import { GoalInterface } from 'interfaces/goal';
import { ParentInterface } from 'interfaces/parent';
import { UserInterface } from 'interfaces/user';
import { AcademyInterface } from 'interfaces/academy';
import { GetQueryInterface } from 'interfaces';

export interface PlayerInterface {
  id?: string;
  user_id: string;
  academy_id: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
  exercise?: ExerciseInterface[];
  goal?: GoalInterface[];
  parent?: ParentInterface[];
  user?: UserInterface;
  academy?: AcademyInterface;
  _count?: {
    exercise?: number;
    goal?: number;
    parent?: number;
  };
}

export interface PlayerGetQueryInterface extends GetQueryInterface {
  filter: {
    id?: string;
    user_id?: string;
    academy_id?: string;
    status?: string;
  };
}
