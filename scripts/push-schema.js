const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL no definida");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const statements = [
  `DO $$ BEGIN
   CREATE TYPE "user_role" AS ENUM('admin', 'profesor', 'estudiante');
 EXCEPTION
   WHEN duplicate_object THEN null;
 END $$;`,

  `CREATE TABLE IF NOT EXISTS "users" (
   "id" serial PRIMARY KEY NOT NULL,
   "email" varchar(255) NOT NULL,
   "password_hash" text NOT NULL,
   "role" "user_role" DEFAULT 'estudiante' NOT NULL,
   "created_at" timestamp DEFAULT now() NOT NULL,
   CONSTRAINT "users_email_unique" UNIQUE("email")
 );`,

  `CREATE TABLE IF NOT EXISTS "courses" (
   "id" serial PRIMARY KEY NOT NULL,
   "title" varchar(200) NOT NULL,
   "description" text,
   "profesor_id" integer,
   "created_at" timestamp DEFAULT now() NOT NULL
 );`,

  `CREATE TABLE IF NOT EXISTS "subjects" (
   "id" serial PRIMARY KEY NOT NULL,
   "course_id" integer NOT NULL,
   "title" varchar(200) NOT NULL,
   "order" integer DEFAULT 0 NOT NULL
 );`,

  `CREATE TABLE IF NOT EXISTS "lessons" (
   "id" serial PRIMARY KEY NOT NULL,
   "subject_id" integer NOT NULL,
   "title" varchar(200) NOT NULL,
   "content_type" varchar(50) DEFAULT 'text' NOT NULL,
   "content_url" text,
   "order" integer DEFAULT 0 NOT NULL
 );`,

  `CREATE TABLE IF NOT EXISTS "enrollments" (
   "id" serial PRIMARY KEY NOT NULL,
   "user_id" integer NOT NULL,
   "course_id" integer NOT NULL,
   "enrolled_at" timestamp DEFAULT now() NOT NULL
 );`,

  `CREATE TABLE IF NOT EXISTS "files" (
   "id" serial PRIMARY KEY NOT NULL,
   "original_name" varchar(255) NOT NULL,
   "mime_type" varchar(100) NOT NULL,
   "url" text NOT NULL,
   "uploaded_by" integer,
   "created_at" timestamp DEFAULT now() NOT NULL
 );`,

  `CREATE TABLE IF NOT EXISTS "assignments" (
   "id" serial PRIMARY KEY NOT NULL,
   "subject_id" integer NOT NULL,
   "title" varchar(200) NOT NULL,
   "description" text,
   "due_date" timestamp,
   "max_files" integer DEFAULT 5 NOT NULL,
   "created_at" timestamp DEFAULT now() NOT NULL
 );`,

  `CREATE TABLE IF NOT EXISTS "submissions" (
   "id" serial PRIMARY KEY NOT NULL,
   "assignment_id" integer NOT NULL,
   "student_id" integer NOT NULL,
   "file_urls" text[] NOT NULL DEFAULT '{}',
   "submitted_at" timestamp DEFAULT now() NOT NULL,
   "grade" integer,
   "feedback" text
 );`,

  `CREATE TABLE IF NOT EXISTS "recordings" (
   "id" serial PRIMARY KEY NOT NULL,
   "subject_id" integer NOT NULL,
   "url" text NOT NULL,
   "recorded_at" timestamp DEFAULT now() NOT NULL
 );`,

  `DO $$ BEGIN
   ALTER TABLE "assignments" ADD CONSTRAINT "assignments_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE no action ON UPDATE no action;
 EXCEPTION
   WHEN duplicate_object THEN null;
 END $$;`,

  `DO $$ BEGIN
   ALTER TABLE "courses" ADD CONSTRAINT "courses_profesor_id_users_id_fk" FOREIGN KEY ("profesor_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
 EXCEPTION
   WHEN duplicate_object THEN null;
 END $$;`,

  `DO $$ BEGIN
   ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
 EXCEPTION
   WHEN duplicate_object THEN null;
 END $$;`,

  `DO $$ BEGIN
   ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE no action ON UPDATE no action;
 EXCEPTION
   WHEN duplicate_object THEN null;
 END $$;`,

  `DO $$ BEGIN
   ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
 EXCEPTION
   WHEN duplicate_object THEN null;
 END $$;`,

  `DO $$ BEGIN
   ALTER TABLE "lessons" ADD CONSTRAINT "lessons_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE no action ON UPDATE no action;
 EXCEPTION
   WHEN duplicate_object THEN null;
 END $$;`,

  `DO $$ BEGIN
   ALTER TABLE "recordings" ADD CONSTRAINT "recordings_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE no action ON UPDATE no action;
 EXCEPTION
   WHEN duplicate_object THEN null;
 END $$;`,

  `DO $$ BEGIN
   ALTER TABLE "subjects" ADD CONSTRAINT "subjects_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE no action ON UPDATE no action;
 EXCEPTION
   WHEN duplicate_object THEN null;
 END $$;`,

  `DO $$ BEGIN
   ALTER TABLE "submissions" ADD CONSTRAINT "submissions_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE no action ON UPDATE no action;
 EXCEPTION
   WHEN duplicate_object THEN null;
 END $$;`,

  `DO $$ BEGIN
   ALTER TABLE "submissions" ADD CONSTRAINT "submissions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
 EXCEPTION
   WHEN duplicate_object THEN null;
 END $$;`,
];

(async () => {
  try {
    for (let i = 0; i < statements.length; i++) {
      await pool.query(statements[i]);
      console.log(`[${i + 1}/${statements.length}] OK`);
    }
    console.log("\n✅ Esquema aplicado correctamente a Neon (kursa-prod).");
  } catch (err) {
    console.error("\n❌ Error aplicando esquema:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
