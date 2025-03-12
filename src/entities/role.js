import { EntitySchema } from "typeorm";

export const RoleEntity = new EntitySchema({
  name: "Role",
  tableName: "role",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    roleName: {
      type: "varchar",
      nullable: false,
    },
  },
  relations: {
    users: {
      type: "one-to-many",
      target: "User",
      cascade: true,
      onDelete: "CASCADE",
      inverseSide: "role",
    },
  },
});
