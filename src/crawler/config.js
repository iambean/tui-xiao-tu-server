import { URLSearchParams } from "url";

const TRUMP_ID = '107780257626128497';
const BASE_URL = `https://truthsocial.com/api/v1/accounts/${TRUMP_ID}/statuses`;

const INIT_PARAMS = { 
  exclude_replies: true, 
  only_replies: false, 
  with_muted: true 
};

export const INIT_API_URL = `${BASE_URL}?${new URLSearchParams(INIT_PARAMS)}`;

export const NEXT_20_URL = (sinceID) => {
  const params = Object.assign({}, INIT_PARAMS, {
    max_id: sinceID,
    page: 1,
    exclude_replies: true,
    limit: 20,
  });
  return `${BASE_URL}?${new URLSearchParams(params)}`;
};

export const MAIN_KEYS = [
  'id',
  'created_at', 
  'content',
];
export const STATS_KEYS = [
  'replies_count', 
  'reblogs_count', 
  'favourites_count', 
  'upvotes_count',
];
export const MEDIA_KEY = 'media_attachments';
export const MEDIA_TYPES = ['image', 'video', 'gifv'];