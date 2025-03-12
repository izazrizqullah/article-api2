export default class InitMigration1741679600559 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "comments" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "comment" VARCHAR NOT NULL,
        "postId" UUID NOT NULL,
        "userId" UUID NOT NULL,
        CONSTRAINT "FK_comments_post" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_comments_user" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
      );
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "comments";`);
  }
}
