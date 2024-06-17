export class PostDTO {
  id: number;
  user_id: number;
  image_url: string;
  caption: string;
  location: string;
  created_at: Date;

  constructor(data: Partial<PostDTO>) {
    this.id = data.id || 0;
    this.user_id = data.user_id || 0;
    this.image_url = data.image_url || '';
    this.caption = data.caption || '';
    this.location = data.location || '';
    this.created_at = data.created_at || new Date();
  }
}
