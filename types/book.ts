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
  
  // Nouveaux champs de l'API
  dateStart?: string;
  dateEnd?: string;
  tags?: Set<any>;
  userStatus?: string;
  userRating?: number;
  userMatch?: number;
  createdAt?: string;
  modifiedAt?: string;
  relatedBooks?: Set<BookDto>;
  sameAuthorBooks?: Set<BookDto>;
}

export interface Tag {
  id: string;
  name: string;
}
