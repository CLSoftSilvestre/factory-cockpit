
export interface IIH_DisplayName {
    "xx_XX": string,
}

export interface IIH_Attributes_Relations {
  $outgoing: [],
  $incomming: [],
}

export interface IIH_Attribute {
  $anchor: string,
  $name: string,
  $abstraction: string,
  $concept: string,
  $displayname: IIH_DisplayName,
  $metadata?:any
  $references: [],
  $type: string,
  $datatype: string,
  $array: boolean,
  $unit: string,
  $value: any,
  $relations: IIH_Attributes_Relations
}

export interface IIH_Attribute_Data_Point {
  timestamp: string,
  value: any,
  qualitycode: number
}

export interface IIH_Attribute_Data {
  variableId: string,
  values: IIH_Attribute_Data_Point []
}

export interface IIH_Attribute_Data_Response {
  data: IIH_Attribute_Data[]
}
