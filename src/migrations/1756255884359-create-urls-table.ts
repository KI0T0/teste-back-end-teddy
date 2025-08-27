import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUrlsTable1756255884359 implements MigrationInterface {
  name = 'CreateUrlsTable1756255884359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "urls" (
        "id" SERIAL NOT NULL,
        "short_code" character varying(6) NOT NULL,
        "long_url" text NOT NULL,
        "clicks" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "user_id" integer,
        CONSTRAINT "PK_eaf7bec915960b26aa4988d73b0" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_urls_short_code" UNIQUE ("short_code"),
        CONSTRAINT "FK_urls_user_id__users_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_urls_user_id" ON "urls" ("user_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_urls_user_id"`);
    await queryRunner.query(`ALTER TABLE "urls" DROP CONSTRAINT "FK_urls_user_id__users_id"`);
    await queryRunner.query(`DROP TABLE "urls"`);
  }
}
