type JwtPayload = {
  sub: string;
  email: string;
  is2faToken?: boolean;
};
