import { Widget } from "../../models/dashboard";

export interface ServerDasboard {
  dashboard_id: string,
  title: string,
  data?: Partial<Widget>[],
  created_at: string,
  created_by: string
}