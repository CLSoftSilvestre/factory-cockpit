export interface IIH_Asset_Tree_Item {
  $anchor: string,
  $name: string,
  $_entity: {
    $anchor: string,
    $concept: string,
  },
  $_hasChildren: boolean,
  $_hasAttributes: boolean
}

export interface IIH_Asset_Root {
  $anchor: string,
  $name: string,
}