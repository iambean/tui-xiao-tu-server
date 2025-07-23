import express from 'express';
import TimelineController from '../../controllers/timeline.controller.js';

export default function(dbAdapter) {
  const router = express.Router();
  const timelineController = new TimelineController(dbAdapter);

  router.route('/')
    .get((req, res, next) => timelineController.getAllTweets(req, res, next))
    .post((req, res, next) => timelineController.saveTweets(req, res, next));

  router.route('/:id')
    .get((req, res, next) => timelineController.getTweet(req, res, next));

  return router;
}
