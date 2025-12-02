import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IIH_Hostname, IIH_Resources } from '../interfaces/iih-resources';
import { IIH_Attribute, IIH_Attribute_Data_Response } from '../interfaces/iih-attributes';
import { IIH_Asset_Root, IIH_Asset_Tree_Item } from '../interfaces/iih-assets';
import { ServerDasboard } from '../interfaces/server-dashboards';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private http = inject(HttpClient);

  /**
   * Get the IED resources (CPU, Ram, Drive)
   * @returns the resources of the IED
   */
  getIEDResources() {
    const url = 'api/ied/resources';
    return this.http.get<IIH_Resources>(url);
  }

  /**
   * Get the IED Hostname
   * @returns the name of the IED
   */
  getHostname() {
    const url = 'api/ied/resources/hostname';
    return this.http.get<IIH_Hostname>(url);
  }

  /**
   * Get attribute last value
   * @param attributeId The UUID of the attribute
   * @returns the current value of the attribute
   */
  getAttributeCurrentValue(attributeId: string) {
    const url = 'api/attributes/' + attributeId;
    return this.http.get<IIH_Attribute>(url);
  }

  /**
   * Get attribute recorded values in interval
   * @param attributeId The UUID of the attribute
   * @param from the start of the period
   * @param to the end of the period
   * @param interpolation use interpolation or not
   * @param interval interval for the interpolation in ms
   * @returns the list of values on the defined period
   */
  getAttributeData(attributeId: string, from: string, to: string, interpolation: boolean, interval: number) {
    const url = 'api/attributes/' + attributeId + '/data?from=' + from + '&to=' + to + '&interpolation=' + interpolation + '&interval=' + interval;
    return this.http.get(url, {responseType: 'text'});
  }

  /**
   * Get attribute trend in the interval
   * @param attributeId The UUID of the attribute
   * @param from the start of the period
   * @param to the end of the period
   * @param timerange the interval of the aggregation
   * @param aggregation the type of aggregation to be calculated
   * @returns the list of values on the defined period
   */
  getAttributeTrend(attributeId: string, from: string, to: string, timerange: number, aggregation: string) {
    const url = 'api/attributes/' + attributeId + '/trend?from=' + from + '&to=' + to + '&timerange=' + timerange * 60 * 1000 + '&aggregation=' + aggregation;
    return this.http.get(url, {responseType: 'text'});
  }

  getAssetsList(){
    const url = 'api/assets';
    return this.http.get(url);
  }

  getAssetAttributesList(assetId: string){
    const url = 'api/assets/' + assetId + '/attributes';
    return this.http.get(url);
  }

  /**
   * Get the 
   * @param attributeId The UUID of the asset
   * @returns the list of child assets
   */
  getAssetTree(attributeId: string) {
    const url= 'api/assets/' + attributeId + '/tree';
    return this.http.get<IIH_Asset_Tree_Item[]>(url);
  }

  /**
   * Get the 
   * @param attributeId The UUID of the asset
   * @returns the list of child assets
   */
  getRootAsset() {
    const url= 'api/assets/root';
    return this.http.get<IIH_Asset_Root>(url);
  }

  /**
   * Get the list of dashboards
   * @returns the list of available dashboards in the server
   */
  getDashboardsList() {
    const url = 'api/dashboards';
    return this.http.get<ServerDasboard[]>(url);
  }

  /**
   * Get the specified dashboard
   * @returns the dashboard in the server
   */
  getDashboardsById(dashboardId: string) {
    const url = 'api/dashboards/' + dashboardId;
    return this.http.get<ServerDasboard>(url);
  }

  /**
   * Save the specified dashboard
   * @returns the dashboard in the server
   */
  saveDashboardsById(dashboardId: string, data: any) {
    const url = 'api/dashboards/' + dashboardId;
    const body = {
      data: JSON.stringify(data)
    };
    return this.http.patch<ServerDasboard>(url, body);
  }

  /**
   * Create new dashboard
   * @returns the new dashboard created
   */
  newDashboard(name: string) {
    const url = 'api/dashboards/';
    const body = {
      title: name
    };
    return this.http.post<ServerDasboard>(url, body);
  }

  /**
   * Delete dashboard
   * @returns success
   */
  deleteDashboard(dashboardId: string) {
    const url = 'api/dashboards/' + dashboardId;
    return this.http.delete<ServerDasboard>(url);
  }

  constructor() { }
}
