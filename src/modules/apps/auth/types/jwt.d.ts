type JwtPayload = {
  sub: string;
  email: string;
  is2faToken?: boolean;
};

type ReqUser = {
  userId: number;
  email: string;
};
