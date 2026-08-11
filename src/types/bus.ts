export interface Bus {
  id: number;
  name: string;
  type: string;
  seats: number;
  price: number;
  fare_per_km?: number;
total_distance_km?: number;
}