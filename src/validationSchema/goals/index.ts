import * as yup from 'yup';

export const goalValidationSchema = yup.object().shape({
  name: yup.string().required(),
  status: yup.string().required(),
  player_id: yup.string().nullable().required(),
});
