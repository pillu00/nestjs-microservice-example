export interface CreateChannelDto {
  channels: ChannelDto[];
}

export interface ChannelDto {
  id: number;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  created_at: string;
  elevation: string;
  last_entry_id: number;
  public_flag: boolean;
  url?: string;
  ranking: number;
  github_url?: string;
  tags: TagDto[];
}

interface TagDto {
  id: number;
  name: string;
}
