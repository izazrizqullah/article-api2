import { EntitySchema } from "typeorm";

export const PostEntity = new EntitySchema({
  name: "Post",
  tableName: "posts",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    title: {
      type: "varchar",
      nullable: false,
    },
    content: {
      type: "text",
      nullable: false,
    },
    photo: {
      type: "varchar",
      nullable: true,
    },
    userId: {
      type: "uuid",
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    deletedAt: {
      type: "timestamp",
      nullable: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "userId",
        referencedColumnName: "id",
      },
    },
    comments: {
      type: "one-to-many",
      target: "Comment",
      cascade: true,
      inverseSide: "post",
    },
  },
});
