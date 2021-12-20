export const REQUIRE_FIELDS = {
  User: ['email', 'phone_number', 'first_name', 'last_name', 'is_active'],
  Post: ['user_id', 'media_url', 'caption'],
  Pet: ['name'],
  Comment: ['content', 'user_id', 'post_id'],
};
