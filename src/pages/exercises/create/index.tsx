import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createExercise } from 'apiSdk/exercises';
import { Error } from 'components/error';
import { exerciseValidationSchema } from 'validationSchema/exercises';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CoachInterface } from 'interfaces/coach';
import { PlayerInterface } from 'interfaces/player';
import { getCoaches } from 'apiSdk/coaches';
import { getPlayers } from 'apiSdk/players';
import { ExerciseInterface } from 'interfaces/exercise';

function ExerciseCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ExerciseInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createExercise(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ExerciseInterface>({
    initialValues: {
      name: '',
      status: '',
      coach_id: (router.query.coach_id as string) ?? null,
      player_id: (router.query.player_id as string) ?? null,
    },
    validationSchema: exerciseValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Exercise
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
            <FormLabel>Status</FormLabel>
            <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CoachInterface>
            formik={formik}
            name={'coach_id'}
            label={'Select Coach'}
            placeholder={'Select Coach'}
            fetcher={getCoaches}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.user_id}
              </option>
            )}
          />
          <AsyncSelect<PlayerInterface>
            formik={formik}
            name={'player_id'}
            label={'Select Player'}
            placeholder={'Select Player'}
            fetcher={getPlayers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.user_id}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'exercise',
  operation: AccessOperationEnum.CREATE,
})(ExerciseCreatePage);
