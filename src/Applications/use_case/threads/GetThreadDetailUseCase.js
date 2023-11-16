const DetailComment = require('../../../Domains/threads/comments/entities/DetailComment');
const DetailCommentLikes = require('../../../Domains/threads/comments/entities/DetailCommentLikes');
const DetailCommentReplies = require('../../../Domains/threads/comments/replies/entities/DetailCommentReplies');

class GetThreadDetailUseCase {
  constructor({
    threadsRepository,
    threadCommentsRepository,
    threadCommentRepliesRepository,
  }) {
    this._threadsRepository = threadsRepository;
    this._threadCommentsRepository = threadCommentsRepository;
    this._threadCommentRepliesRepository = threadCommentRepliesRepository;
  }

  async execute(id) {
    const thread = await this._threadsRepository.getThreadById(id);

    let comments = await this._threadCommentsRepository.getCommentsFromThread(
      id,
    );

    const likes =
      await this._threadCommentsRepository.getNumberOfCommentsByThread(id);

    const replies =
      await this._threadCommentRepliesRepository.getRepliesCommentFromThread(
        id,
      );

    comments = comments.map((comment) => {
      return {
        ...new DetailComment(comment),
        likeCount: new DetailCommentLikes(
          likes.filter((like) => like.thread_comment_id === comment.id)[0],
        ).likes,
        replies: replies
          .filter((reply) => reply.comment_id === comment.id)
          .map((reply) => ({ ...new DetailCommentReplies(reply) })),
      };
    });

    return { ...thread, comments };
  }
}

module.exports = GetThreadDetailUseCase;
