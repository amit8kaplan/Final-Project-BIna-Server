import { Session } from "express-session";

export interface ISession extends Session {
  otp?: string;
  Email?: string;
}