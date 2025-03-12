import { EntitySchema } from "typeorm";

export const CommentEntity = new EntitySchema({
  name: "Comment",
  tableName: "comments",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    comment: {
      type: "varchar",
    },
    postId: {
      type: "uuid",
    },
    userId: {
      type: "uuid",
    },
  },
  relations: {
    post: {
      type: "many-to-one",
      target: "Post",
      joinColumn: {
        name: "postId",
        referencedColumnName: "id",
      },
    },
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "userId",
        referencedColumnName: "id",
      },
    },
  },
});
