export class AIUserDTO {
  ai_user_id: number;
  personality_type: string;
  activity_pattern: string;
  language_preference: string;
  region: string;
  content_preferences: string;
  user_id: number;

  constructor(data: Partial<AIUserDTO>) {
    this.ai_user_id = data.ai_user_id || 0;
    this.personality_type = data.personality_type || '';
    this.activity_pattern = data.activity_pattern || '';
    this.language_preference = data.language_preference || '';
    this.region = data.region || '';
    this.content_preferences = data.content_preferences || '';
    this.user_id = data.user_id || 0;
  }
}
