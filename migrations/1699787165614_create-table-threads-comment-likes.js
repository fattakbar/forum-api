/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('thread_comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  pgm.addConstraint(
    'thread_comment_likes',
    'fk_thread_comment_likes.comment_id_thread_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES thread_comments(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'thread_comment_likes',
    'fk_thread_comment_likes.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comment_likes');
};
