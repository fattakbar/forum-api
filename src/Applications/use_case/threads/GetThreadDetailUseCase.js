const DetailComment = require('../../../Domains/threads/comments/entities/DetailComment');
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

    const replies =
      await this._threadCommentRepliesRepository.getRepliesCommentFromThread(
        id,
      );

    comments = comments.map((comment) => {
      return {
        ...new DetailComment(comment),
        replies: replies
          .filter((reply) => reply.comment_id === comment.id)
          .map((reply) => ({ ...new DetailCommentReplies(reply) })),
      };
    });

    return { ...thread, comments };
  }
}

module.exports = GetThreadDetailUseCase;
