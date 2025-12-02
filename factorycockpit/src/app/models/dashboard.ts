import { Type } from "@angular/core";

export interface TimelineMode {
    code: number,
    name: string,
    color: string
}

export interface WidgetConfig {
    attribute: string,
    aggregation?: string,
    units?: string,
    decimals?: number,
    interpolate?: boolean,
    label?: string,
    timespan?: number,
    chart_tension?: number,
    chart_step?: boolean,
    chart_type?: string,
    sum_data?: boolean,
    chart_aggregation_method?: string,
    chart_aggregation_timerange?: number,
    webview_link?: string,
    timeline_modes?: TimelineMode[],
}

export interface Widget {
    id: number;
    templateId: number;
    uuid: string;
    label: string;
    content: Type<unknown>;
    configPage?: Type<unknown>;
    icon?:string;
    rows?: number;
    columns?: number;
    backgroundColor?: string;
    color?: string;
    configuration: WidgetConfig;
    hideAttributes?: boolean;
}