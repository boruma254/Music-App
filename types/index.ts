export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  tracks: number;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  duration: number;
  url?: string;
}

export interface Artist {
  id: string;
  name: string;
  albums: number;
}
