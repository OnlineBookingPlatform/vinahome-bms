export interface Province {
  id: number;
  name: string;
  code: number;
}

export interface District {
  id: number;
  name: string;
  code: number;
  provinceId: number;
}

export interface Ward {
  id: number;
  name: string;
  code: number;
  districtId: number;
}
