const mapping: Record<string, string> = {
  academies: 'academy',
  coaches: 'coach',
  exercises: 'exercise',
  goals: 'goal',
  parents: 'parent',
  players: 'player',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
