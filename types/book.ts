export interface BookDto {
  id: number;
  names: string[];
  imgUrl: string;
  nbVolume: number;
  userCurrentVolume?: number;
  isCompleted?: boolean;
  authors?: any[];
  synopsis?: string;
  note?: number;
}

export interface Tag {
  id: string;
  name: string;
}
