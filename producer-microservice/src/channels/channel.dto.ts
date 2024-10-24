export interface PublicChannelsResponse {
    pagination: Pagination
    channels: Channel[]
  }
  
  export interface Pagination {
    current_page: number
    per_page: number
    total_entries: number
  }
  
  export interface Channel {
    id: number
    name: string
    description: string
    latitude: string
    longitude: string
    created_at: string
    elevation: string
    last_entry_id: number
    public_flag: boolean
    url: string
    ranking: number
    github_url: string
    tags: Tag[]
  }
  
  export interface Tag {
    id: number
    name: string
  }
  