export interface IIH_Hostname {
  hostname: string,
}

export interface IIH_Resource_CPU {
  usedPercentage: string,
  coreCount: string,
  modelName: string,
  cpuArch: string,
}

export interface IIH_Resource_Storage {
  total: string,
  used: string,
  free: string,
  usedPercentage: string,
}

export interface IIH_Resource_Memory {
  total: string,
  used: string,
  free: string,
  usedPercentage: string,
  peak: string,
  average: string,
}

export interface IIH_Resources {
  cpu: IIH_Resource_CPU,
  storage: IIH_Resource_Storage,
  memory: IIH_Resource_Memory,
  upTime: string
}