import { EntitySchema } from "typeorm";

export const UserEntity = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    username: {
      type: "varchar",
      unique: true,
    },
    password: {
      type: "varchar",
      nullable: true,
    },
    profilePhoto: {
      type: "varchar",
      nullable: true,
    },
    roleId: {
      type: "uuid",
      nullable: true,
    },
    isVerified: {
      type: "boolean",
      default: false,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    role: {
      type: "many-to-one",
      target: "Role",
      joinColumn: {
        name: "roleId",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
    tokens: {
      type: "one-to-many",
      target: "Token",
      cascade: true,
      inverseSide: "user",
    },
    posts: {
      type: "one-to-many",
      target: "Post",
      cascade: true,
      inverseSide: "user",
    },
    comments: {
      type: "one-to-many",
      target: "Comment",
      cascade: true,
      inverseSide: "user",
    },
  },
});
