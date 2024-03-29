import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2 } from 'react-icons/fi';
import { getPlayerById } from 'apiSdk/players';
import { Error } from 'components/error';
import { PlayerInterface } from 'interfaces/player';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteExerciseById } from 'apiSdk/exercises';
import { deleteGoalById } from 'apiSdk/goals';
import { deleteParentById, createParent } from 'apiSdk/parents';

function PlayerViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlayerInterface>(
    () => (id ? `/players/${id}` : null),
    () =>
      getPlayerById(id, {
        relations: ['user', 'academy', 'exercise', 'goal', 'parent'],
      }),
  );

  const exerciseHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteExerciseById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const goalHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteGoalById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [parentUserId, setParentUserId] = useState(null);
  const parentHandleCreate = async () => {
    setCreateError(null);
    try {
      await createParent({ player_id: id, user_id: parentUserId });
      setParentUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const parentHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteParentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Player Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {hasAccess('player', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
              <NextLink href={`/players/edit/${data?.id}`} passHref legacyBehavior>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  mr={2}
                  as="a"
                  variant="outline"
                  colorScheme="blue"
                  leftIcon={<FiEdit2 />}
                >
                  Edit
                </Button>
              </NextLink>
            )}
            <Text fontSize="lg" fontWeight="bold" as="span">
              Status:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.status}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Created At:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.created_at as unknown as string}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Updated At:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.updated_at as unknown as string}
            </Text>
            <br />
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  User:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                    {data?.user?.email}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('academy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Academy:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/academies/view/${data?.academy?.id}`}>
                    {data?.academy?.name}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('exercise', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Exercises:
                </Text>
                <NextLink passHref href={`/exercises/create?player_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>name</Th>
                        <Th>status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.exercise?.map((record) => (
                        <Tr
                          cursor="pointer"
                          onClick={() => router.push(`/exercises/view/${record.id}`)}
                          key={record.id}
                        >
                          <Td>{record.name}</Td>
                          <Td>{record.status}</Td>
                          <Td>
                            <NextLink passHref href={`/exercises/edit/${record.id}`}>
                              <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                Edit
                              </Button>
                            </NextLink>
                            <IconButton
                              onClick={() => exerciseHandleDelete(record.id)}
                              colorScheme="red"
                              variant="outline"
                              aria-label="edit"
                              icon={<FiTrash />}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('goal', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Goals:
                </Text>
                <NextLink passHref href={`/goals/create?player_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>name</Th>
                        <Th>status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.goal?.map((record) => (
                        <Tr cursor="pointer" onClick={() => router.push(`/goals/view/${record.id}`)} key={record.id}>
                          <Td>{record.name}</Td>
                          <Td>{record.status}</Td>
                          <Td>
                            <NextLink passHref href={`/goals/edit/${record.id}`}>
                              <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                Edit
                              </Button>
                            </NextLink>
                            <IconButton
                              onClick={() => goalHandleDelete(record.id)}
                              colorScheme="red"
                              variant="outline"
                              aria-label="edit"
                              icon={<FiTrash />}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            <>
              <Text fontSize="lg" fontWeight="bold">
                Parents:
              </Text>
              <UserSelect name={'parent_user'} value={parentUserId} handleChange={setParentUserId} />
              <Button colorScheme="blue" mt="4" mr="4" onClick={parentHandleCreate} isDisabled={!parentUserId}>
                Create
              </Button>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Email</Th>

                      <Th>View</Th>
                      <Th>Delete</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.parent?.map((record) => (
                      <Tr key={record?.user?.id}>
                        <Td>{record?.user?.email}</Td>

                        <Td>
                          <NextLink href={`/users/view/${record?.user?.id}`} passHref>
                            <Button as="a">View</Button>
                          </NextLink>
                        </Td>
                        <Td>
                          <Button onClick={() => parentHandleDelete(record.id)}>Delete</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'player',
  operation: AccessOperationEnum.READ,
})(PlayerViewPage);
