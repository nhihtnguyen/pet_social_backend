export const REQUIRE_FIELDS = {
  user: ['email', 'phone_number', 'first_name', 'last_name', 'is_active'],
  post: ['user_id', 'media_url', 'caption'],
  pet: ['name'],
  comment: ['content', 'user_id', 'post_id'],
};
