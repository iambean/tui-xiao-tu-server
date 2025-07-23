import TimelineService from '../services/timeline.service.js';
import { ResponseHelper } from '../utils/responseHelper.js';

class TimelineController {
  constructor(dbAdapter) {
    this.timelineService = new TimelineService(dbAdapter);
  }
  // Create a new timeline post
  // async saveTweets(req, res) {
  //   try {
  //     const timeline = await timelineService.create(req.body);
  //     res.json(success(timeline));
  //   } catch (err) {
  //     res.status(500).json(error(err.message));
  //   }
  // }

  // Get all timeline posts (only key fields)
  async getAllTweets(req, res) {
    try {
      const timelines = await this.timelineService.find(req.query);
      // 只返回关键字段
      const result = timelines.map(t => ({
        id: t.id,
        created_at: t.created_at,
        content: t.content,
        account_id: t.account_id,
        url: t.url,
        replies_count: t.replies_count,
        reblogs_count: t.reblogs_count,
        favourites_count: t.favourites_count
      }));
      res.json(ResponseHelper.success(result));
    } catch (err) {
      res.status(500).json(ResponseHelper.error(err.message));
    }
  }

  // Get a single timeline post by ID (all fields)
  async getTweet(req, res) {
    try {
      const timeline = await this.timelineService.getModel().findByPk(req.params.id);
      if (timeline){
        res.json(ResponseHelper.success(timeline));
      }else {
        res.status(404).json(ResponseHelper.error('Timeline not found'));
      }
    } catch (err) {
      res.status(500).json(ResponseHelper.error(err.message));
    }
  }
}

export default TimelineController;