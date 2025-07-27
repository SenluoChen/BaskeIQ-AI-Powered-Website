export interface User {
  username: string;
  email: string;
  position: string;
  timestamp: number;
  height: number;
  weight: number;
  imageUrl: string;
}

export interface PostUser {
  username: string;
  position: 'Point Guard' | 'Shooting Guard' | 'Small Forward' | 'Power Forward' | 'Center'
  height: number;
  weight: number;
  filename: string;
}

export interface PutUser {
  email: string;
  birthdate: string;
  firstName: string;
  lastName: string;
  country: string;
  licenseNumber: string;
  filename: string;
}

export interface PostUserResponse {
  message: string;
  uploadUrl: string;
}

export interface PutUserResponse {
  message: string;
  uploadUrl?: string;
}
