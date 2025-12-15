import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Widget, WidgetConfig } from '../models/dashboard';
import { CardComponent } from '../pages/dashboard/widgets/card/card.component';
import { IndicatorComponent } from '../pages/dashboard/widgets/indicator/indicator.component';
import { ChartComponent } from '../pages/dashboard/widgets/chart/chart.component';
import { ListItemsComponent } from '../pages/dashboard/widgets/list-items/list-items.component';
import { v4 as uuidv4 } from 'uuid';
import { CardConfigComponent } from '../pages/dashboard/widgets/card/card-config/card-config.component';
import { IndicatorConfigComponent } from '../pages/dashboard/widgets/indicator/indicator-config/indicator-config.component';
import { ChartConfigComponent } from '../pages/dashboard/widgets/chart/chart-config/chart-config.component';
import { WebviewComponent } from '../pages/dashboard/widgets/webview/webview.component';
import { WebviewConfigComponent } from '../pages/dashboard/widgets/webview/webview-config/webview-config.component';
import { TimelineComponent } from '../pages/dashboard/widgets/timeline/timeline.component';
import { TimelineConfigComponent } from '../pages/dashboard/widgets/timeline/timeline-config/timeline-config.component';
import { DataService } from '../shared/services/data.service';
import { ServerDasboard } from '../shared/interfaces/server-dashboards';
import { Observable } from 'rxjs';


@Injectable()
export class DashboardService {
  private dataService = inject(DataService);

  widgetsStore = signal<Widget[]> ([
    {
    id: 1,
    templateId: 1,
    uuid: uuidv4(),
    label: 'Chart',
    content: ChartComponent,
    configPage: ChartConfigComponent,
    icon: "area_chart",
    rows: 2,
    columns: 2,
    hideAttributes: false,
    configuration: {
      attribute: "",
      units: "",
      label: "Chart",
      interpolate: false,
      timespan: 8, //(8 * 60 * 60 * 1000)
      chart_tension: 0.4,
      chart_step: false,
      chart_aggregation_method: "Average",
      chart_aggregation_timerange: 15,
      chart_type: "line",
      }
    },
    {
    id: 2,
    templateId: 2,
    uuid: uuidv4(),
    label: 'Card',
    content: CardComponent,
    configPage: CardConfigComponent,
    icon: "money",
    rows: 1,
    columns: 2,
    hideAttributes: false,
    backgroundColor: 'var(--sys-secondary-container)',
    color: 'var(--sys-on-secondary-container)',
    configuration: {
      attribute: "",
      units: "",
      timespan: 8, //(8 * 60 * 60 * 1000)
      chart_aggregation_method: "Average",
      }
    },
    {
    id: 3,
    templateId: 3,
    uuid: uuidv4(),
    label: 'Indicator',
    icon: "scoreboard",
    content: IndicatorComponent,
    configPage: IndicatorConfigComponent,
    rows: 1,
    columns: 2,
    hideAttributes: false,
    backgroundColor: 'var(--sys-secondary-container)',
    color: 'var(--sys-on-secondary-container)',
    configuration: {
      attribute: "6296c3ff-5f8b-467d-8549-94fa182cc3ed",
      units: "%",
      decimals: 1,
      }
    },
    {
    id: 4,
    templateId: 4,
    uuid: uuidv4(),
    label: 'List',
    content: ListItemsComponent,
    icon: "view_list",
    rows: 3,
    columns: 2,
    hideAttributes: false,
    backgroundColor: 'var(--sys-secondary-container)',
    color: 'var(--sys-on-secondary-container)',
    configuration: {
      attribute: "23750829-f54d-4fb3-86a7-7ce9c6a6ad8c",
      units: "",
      label: "List",
      timespan: 8,
      }
    },
    {
    id: 5,
    templateId: 5,
    uuid: uuidv4(),
    label: 'Webview',
    content: WebviewComponent,
    configPage: WebviewConfigComponent,
    icon: "language",
    rows: 3,
    columns: 4,
    hideAttributes: true,
    //backgroundColor: 'var(--sys-secondary-container)',
    color: 'var(--sys-on-secondary-container)',
    configuration: {
      attribute: "",
      webview_link: "https://www.groupe-bel.com/en/",
      }
    },
    {
    id: 6,
    templateId: 6,
    uuid: uuidv4(),
    label: 'Timeline',
    content: TimelineComponent,
    configPage: TimelineConfigComponent,
    icon: "view_week",
    rows: 1,
    columns: 4,
    hideAttributes: false,
    configuration: {
      attribute: "",
      label: "Status",
      timespan: 8,
      timeline_modes: [
        {
        code: 0,
        name: "Stopped",
        color: "#E8E8E8"
        },
        {
        code: 1,
        name: "Ready to start",
        color: "#BABD5E"
        },
        {
        code: 2,
        name: "Automatic production",
        color: "#38AB76"
        },
        {
        code: 3,
        name: "Manual production",
        color: "#2742F5"
        },
        {
        code: 4,
        name: "Error",
        color: "#F54927"
        },
      ]}
    },

  ]);

  addedWidgets = signal<Widget[]>([]);

  widgetsToAdd = computed(() => {
    const addedIds = this.addedWidgets().map(w => w.id);
    return this.widgetsStore().filter(w => !addedIds.includes(w.id));
  });

  addWidget(w: Widget) {
    // w.uuid = uuidv4();
    // console.log(w.uuid);
    this.addedWidgets.set([...this.addedWidgets(), {...w}]);
  }

  updateWidget(uuid: string, widget: Partial<Widget>) {
    const index = this.addedWidgets().findIndex(w => w.uuid === uuid);
    if (index !== -1) {
      const newWidgets = [...this.addedWidgets()];
      newWidgets[index] = {...newWidgets[index], ...widget}
      this.addedWidgets.set(newWidgets);
    }
  }

  updateWidgetConfiguration(uuid: string, config: Partial<WidgetConfig>) {
    const index = this.addedWidgets().findIndex(w => w.uuid === uuid);
    if (index !== -1) {
      const newWidgets = [...this.addedWidgets()];
      newWidgets[index].configuration = {...newWidgets[index].configuration, ...config}
      this.addedWidgets.set(newWidgets);
    }
  }

  resetFontColor(uuid: string) {
    const index = this.addedWidgets().findIndex(w => w.uuid === uuid);
    const templateColor = this.widgetsStore().find(w => w.id === this.addedWidgets().at(index)?.templateId)?.color;

    let pWid = {
      color: templateColor
    }

    if (index !== -1) {
      const newWidgets = [...this.addedWidgets()];
      newWidgets[index] = {...newWidgets[index], ...pWid}
      this.addedWidgets.set(newWidgets);
    }
  }

  resetBackgroundColor(uuid: string) {
    const index = this.addedWidgets().findIndex(w => w.uuid === uuid);
    const templateColor = this.widgetsStore().find(w => w.id === this.addedWidgets().at(index)?.templateId)?.backgroundColor;

    let pWid = {
      backgroundColor: templateColor
    }

    if (index !== -1) {
      const newWidgets = [...this.addedWidgets()];
      newWidgets[index] = {...newWidgets[index], ...pWid}
      this.addedWidgets.set(newWidgets);
    }
  }

  moveWidgetToRight(uuid: string) {
    const index = this.addedWidgets().findIndex(w => w.uuid === uuid);
    if (index === this.addedWidgets().length -1){
      return;
    }

    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index +1]] = [{...newWidgets[index +1]},{...newWidgets[index]}]

    this.addedWidgets.set(newWidgets);
  }

  moveWidgetToLeft(uuid: string) {
    const index = this.addedWidgets().findIndex(w => w.uuid === uuid);
    if (index === 0){
      return;
    }

    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index -1]] = [{...newWidgets[index -1]},{...newWidgets[index]}]

    this.addedWidgets.set(newWidgets);

  }

  removeWidget(uuid: string) {
    this.addedWidgets.set(this.addedWidgets().filter(w => w.uuid !== uuid));
  }

  updateWidgetPosition(sourceWidgetUuid: string, targetWidgetUuid: string){
    const sourceIndex = this.addedWidgets().findIndex((w) => w.uuid === sourceWidgetUuid);

    if (sourceIndex === -1){
      return;
    }

    const newWidgets = [...this.addedWidgets()];
    const sourceWidget = newWidgets.splice(sourceIndex, 1)[0];

    const targetIndex = newWidgets.findIndex((w) => w.uuid === targetWidgetUuid);
    if (targetIndex === -1){
      return;
    }

    const insertAt = targetIndex === sourceIndex ? targetIndex +1 : targetIndex;

    newWidgets.splice(insertAt, 0, sourceWidget);
    this.addedWidgets.set(newWidgets);

  }

  insertWidgetAtPosition(sourceWidgetUuid: string, destWidgetUuid: string){
    //console.log("Insert widget at position!");
    //console.log("Source widget: " + sourceWidgetUuid)
    //console.log("Destination widget: " + destWidgetUuid)

    const widgetToAdd = this.widgetsStore().find((w) => w.uuid === sourceWidgetUuid);
    if (!widgetToAdd) {
      console.log("No Widget to add");
      return;
    }

    const indexOfDestWidget = this.addedWidgets().findIndex(w => w.uuid === destWidgetUuid);
    const positionToAdd = indexOfDestWidget === -1 ? this.addedWidgets().length +1 : indexOfDestWidget;

    const newWidgets = [...this.addedWidgets()];
    newWidgets.splice(positionToAdd, 0, widgetToAdd);

    // Update new widget uuid
    const newUuid: Partial<Widget> = {
      uuid: uuidv4()
    }

    const index = newWidgets.findIndex(w => w.uuid === sourceWidgetUuid);

    newWidgets[index] = {...newWidgets[index], ...newUuid}
    
    this.addedWidgets.set(newWidgets);

  }

  fetchWidgets() {
    const widgetsAsString = localStorage.getItem('dashboardWidgets');
    if(widgetsAsString){
      const widgets = JSON.parse(widgetsAsString) as Widget[];
      widgets.forEach(widget => {
        const content = this.widgetsStore().find(w => w.id === widget.templateId)?.content;
        const configPage = this.widgetsStore().find(w => w.id === widget.templateId)?.configPage;

        if (content) {
          widget.content = content;
        }

        if(configPage) {
          widget.configPage = configPage;
        }
      })

      this.addedWidgets.set(widgets);
    }

  }

  exportDashboard() {
    const widgetsWithoutContent: Partial<Widget>[] = this.addedWidgets().map(w => ({...w}));
    widgetsWithoutContent.forEach(w => {
      delete w.content;
      delete w.configPage;
    });

    const dashboard = JSON.stringify(widgetsWithoutContent);
    const blob = new Blob([dashboard], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mydashboard.json';
    a.click();
    window.URL.revokeObjectURL(url);

  }

  newDashboard(name: string) {
    if (name.length > 3) {
      this.dataService.newDashboard(name).subscribe(data => {
        console.log(data);
        return data.dashboard_id
      })
    }
    return null
  }

  saveDashboard(dashboardId: string) : Observable<ServerDasboard> {
    const widgetsWithoutContent: Partial<Widget>[] = this.addedWidgets().map(w => ({...w}));
    widgetsWithoutContent.forEach(w => {
      delete w.content;
      delete w.configPage;
    });

    const dashboardData = widgetsWithoutContent;

    return this.dataService.saveDashboardsById(dashboardId, dashboardData);

  }

  importDashboard(dashboard: string) {

    //const widgetsAsString = localStorage.getItem('dashboardWidgets');

    if(dashboard){
      const widgets = JSON.parse(dashboard) as Widget[];
      widgets.forEach(widget => {
        const content = this.widgetsStore().find(w => w.id === widget.templateId)?.content;
        const configPage = this.widgetsStore().find(w => w.id === widget.templateId)?.configPage;

        if (content) {
          widget.content = content;
        }

        if(configPage) {
          widget.configPage = configPage;
        }
      })

      this.addedWidgets.set(widgets);
    }
    //console.log(dashboard);
  }

  getListOfServerDashboards(): ServerDasboard[]{
    let dashboardList: ServerDasboard[] = []
    this.dataService.getDashboardsList().subscribe(data => {
      dashboardList = data;
    })
    return dashboardList
  }

  showServerDashboard(dashboardId: string) {
    let dashboard: ServerDasboard
    this.dataService.getDashboardsById(dashboardId).subscribe(data => {
      dashboard = data
      if(dashboard) {
        const widgets = dashboard.data as Widget[];
        widgets.forEach(widget => {
          const content = this.widgetsStore().find(w => w.id === widget.templateId)?.content;
          const configPage = this.widgetsStore().find(w => w.id === widget.templateId)?.configPage;

          if (content) {
            widget.content = content;
          }

          if(configPage) {
            widget.configPage = configPage;
          }

        })

        this.addedWidgets.set(widgets);

      }

    });
    
  }

  constructor() {
    this.fetchWidgets();
  }

  saveWidgets = effect(() => {
    const widgetsWithoutContent: Partial<Widget>[] = this.addedWidgets().map(w => ({...w}));
    widgetsWithoutContent.forEach(w => {
      delete w.content;
      delete w.configPage;
    });

    localStorage.setItem('dashboardWidgets', JSON.stringify(widgetsWithoutContent));
  })
}
