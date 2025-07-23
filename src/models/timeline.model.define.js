import { DataTypes } from 'sequelize';
// const sequelize = require('../database/DBFactory');

const TimelineModelDefine = (sequelize) => {

  // Timeline model definition based on timeline.jsonc
  const TimelineModel = sequelize.define('Timeline', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      comment: '唯一标识符 Unique identifier for the post',
    },
    account_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '账号唯一ID Unique account ID',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '创建时间（ISO 8601 格式） Creation time (ISO 8601 format)',
    },
    in_reply_to_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '回复的目标动态ID（如果是回复） ID of the post being replied to (if any)',
    },
    quote_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '引用的动态ID（如果有引用） ID of the quoted post (if any)',
    },
    in_reply_to_account_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '回复的目标账号ID（如果是回复） ID of the account being replied to (if any)',
    },
    sensitive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '是否为敏感内容 Whether the post is marked as sensitive',
    },
    spoiler_text: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '内容警告文本（如有） Spoiler or content warning text (if any)',
    },
    visibility: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '可见性（如公开、仅关注者等） Visibility (e.g., public, followers-only)',
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '语言（如有） Language (if specified)',
    },
    uri: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '唯一资源标识符 URI of the post',
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '动态的网页链接 URL to the post\'s web page',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '动态内容（HTML 格式） Content of the post (HTML format)',
    },
    media_attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '媒体附件（如图片、视频） Media attachments (images, videos, etc.)',
    },
    mentions: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '提及的用户 Mentions (users referenced in the post)',
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '话题标签 Hashtags',
    },
    card: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '卡片信息（如链接预览） Card info (e.g., link preview)',
    },
    group: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '群组信息（如有） Group info (if any)',
    },
    quote: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '引用内容（如有） Quoted content (if any)',
    },
    in_reply_to: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '回复内容（如有） Reply content (if any)',
    },
    reblog: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '转发内容（如有） Reblogged content (if any)',
    },
    sponsored: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '是否为广告/推广内容 Whether this is a sponsored/promoted post',
    },
    replies_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '回复数 Number of replies',
    },
    reblogs_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '转发数 Number of reblogs/shares',
    },
    favourites_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '收藏数 Number of favourites/likes',
    },
    reaction: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '当前用户的表态（如点赞/表情） Reaction by current user (if any)',
    },
    upvotes_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '顶数（如有） Number of upvotes (if any)',
    },
    downvotes_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '踩数（如有） Number of downvotes (if any)',
    },
    favourited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '当前用户是否已收藏 Whether the current user has favourited this post',
    },
    reblogged: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '当前用户是否已转发 Whether the current user has reblogged this post',
    },
    muted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '当前用户是否已屏蔽 Whether the current user has muted this post',
    },
    pinned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '是否置顶 Whether the post is pinned',
    },
    bookmarked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '当前用户是否已收藏书签 Whether the current user has bookmarked this post',
    },
    poll: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '投票信息（如有） Poll info (if any)',
    },
    emojis: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '自定义表情 Custom emojis',
    },
    votable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '是否可投票 Whether the post is votable',
    },
  }, {
    tableName: 'timelines',
    timestamps: false,
  });

  return TimelineModel;
};

export default TimelineModelDefine; 