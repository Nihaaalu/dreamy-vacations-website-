export interface RoomType {
  id: string;
  name: string;
  price: number;
  occupancy: string;
  size: string;
  facilities: string[];
  description: string;
  longDescription: string;
  amenities: string[];
  images: string[];
}

export interface BookingDetails {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  foodPreference: 'with-food' | 'without-food';
}

export interface GroupBookingDetails {
  members: number;
  groupType: 'Family' | 'Friends' | 'Corporate';
  foodPreference: 'with-food' | 'without-food';
}

export interface Facility {
  name: string;
  icon: string;
  description: string;
}

export interface GalleryItem {
  src: string;
  category?: string;
}
