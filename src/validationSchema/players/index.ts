import * as yup from 'yup';
import { exerciseValidationSchema } from 'validationSchema/exercises';
import { goalValidationSchema } from 'validationSchema/goals';
import { parentValidationSchema } from 'validationSchema/parents';

export const playerValidationSchema = yup.object().shape({
  status: yup.string().required(),
  user_id: yup.string().nullable().required(),
  academy_id: yup.string().nullable().required(),
  exercise: yup.array().of(exerciseValidationSchema),
  goal: yup.array().of(goalValidationSchema),
  parent: yup.array().of(parentValidationSchema),
});
