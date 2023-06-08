import * as yup from 'yup';

export const exerciseValidationSchema = yup.object().shape({
  name: yup.string().required(),
  status: yup.string().required(),
  coach_id: yup.string().nullable().required(),
  player_id: yup.string().nullable().required(),
});
