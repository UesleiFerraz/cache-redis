import { User } from "./user.model";

export interface Scrap {
  uid: string;
  title: string;
  description: string;
  userUid: string;
  user: User;
}
