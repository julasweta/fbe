import { Role } from '../auth/enums';

declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      username: string;
      role: Role;
      surname: string;
    };
  }
}

declare module 'express' {
  interface Request {
    user: {
      id: number;
      username: string;
      role: Role;
      surname: string;
    };
  }
}
