export interface BookDto {
  id: number;
  names: string[];
  imgUrl: string;
  nbVolume: number;
  userCurrentVolume?: number;
  isCompleted?: boolean;
  authors?: any[];
}
