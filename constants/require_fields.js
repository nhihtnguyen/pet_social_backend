export const REQUIRE_FIELDS = {
  User: [
    "email",
    "password",
    "phone_number",
    "first_name",
    "last_name",
    "is_active",
  ],
  Post: [
    "user_id",
    "media_url",
    "caption",
    "status",
    "size",
    "caption_status",
    "image_status",
  ],
  Pet: ["name"],
  Comment: ["content", "user_id", "post_id"],
};
