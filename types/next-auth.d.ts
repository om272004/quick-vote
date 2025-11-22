import 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in session.user type
   */
  interface Session {
    user: {
      /** The user's database id. */
      id: string;
    } & DefaultSession['user']; // This keeps the 'name', 'email', 'image' properties
  }

  /**
   * Extends the built-in user type
   */
  interface User {
    id: string;
  }
}