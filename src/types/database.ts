export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
}

export interface DatabaseError {
  code: string;
  details: string | null;
  hint: string | null;
  message: string;
}

export interface DatabaseResponse<T> {
  data: T | null;
  error: DatabaseError | null;
}
