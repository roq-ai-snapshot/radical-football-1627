import { ExerciseInterface } from 'interfaces/exercise';
import { UserInterface } from 'interfaces/user';
import { AcademyInterface } from 'interfaces/academy';
import { GetQueryInterface } from 'interfaces';

export interface CoachInterface {
  id?: string;
  user_id: string;
  academy_id: string;
  created_at?: Date;
  updated_at?: Date;
  exercise?: ExerciseInterface[];
  user?: UserInterface;
  academy?: AcademyInterface;
  _count?: {
    exercise?: number;
  };
}

export interface CoachGetQueryInterface extends GetQueryInterface {
  filter: {
    id?: string;
    user_id?: string;
    academy_id?: string;
  };
}
