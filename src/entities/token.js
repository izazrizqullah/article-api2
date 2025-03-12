import { EntitySchema } from "typeorm";

export const TokenEntity = new EntitySchema({
  name: "Token",
  tableName: "token",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    token: {
      type: "varchar",
      nullable: false,
    },
    isExpired: {
      type: "boolean",
      default: false,
    },
    userId: {
      type: "uuid",
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
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
  },
});
