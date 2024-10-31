import { UserRole } from 'src/modules/core/user/role.enum';

type JwtPayload = {
  sub: string;
  email: string;
  is2faToken?: boolean;
  role: UserRole;
};

type ReqUser = {
  userId: number;
  email: string;
  role: UserRole;
};
