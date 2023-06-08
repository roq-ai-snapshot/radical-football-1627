import * as yup from 'yup';
import { exerciseValidationSchema } from 'validationSchema/exercises';

export const coachValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  academy_id: yup.string().nullable().required(),
  exercise: yup.array().of(exerciseValidationSchema),
});
