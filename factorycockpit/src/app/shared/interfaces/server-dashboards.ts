import { Widget } from "../../models/dashboard";

export interface Keyword {
  name: string;
}

export interface ServerDasboard {
  dashboard_id: string,
  title: string,
  description?: string,
  data?: Partial<Widget>[],
  image?: string,
  keywords?: Keyword[],
  created_at: string,
  created_by: string
}