import { Scrap } from "./scrap.model";

export interface User {
  uid: string;
  username: string;
  password: string;
  scraps?: Scrap[];
}
