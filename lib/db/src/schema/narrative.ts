import { createInsertSchema } from "drizzle-zod";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const projectsTable = pgTable("narrative_projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  genre: text("genre").notNull(),
  status: text("status").notNull(),
  progress: text("progress").notNull(),
  description: text("description").notNull(),
  isExample: text("is_example").notNull().default("false"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const charactersTable = pgTable("narrative_characters", {
  id: text("id").primaryKey(),
  projectId: text("project_id"),
  name: text("name").notNull(),
  role: text("role").notNull(),
  initials: text("initials").notNull(),
  description: text("description").notNull(),
  arc: text("arc").notNull(),
  tags: text("tags").array().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const chaptersTable = pgTable("narrative_chapters", {
  id: text("id").primaryKey(),
  projectId: text("project_id"),
  number: text("number").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  sceneCount: text("scene_count").notNull(),
  summary: text("summary").notNull(),
});

export const scenesTable = pgTable("narrative_scenes", {
  id: text("id").primaryKey(),
  projectId: text("project_id"),
  chapterId: text("chapter_id").notNull(),
  number: text("number").notNull(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  kind: text("kind").notNull(),
  status: text("status").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  preview: text("preview").notNull(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ updatedAt: true });
export const insertCharacterSchema = createInsertSchema(charactersTable).omit({ updatedAt: true });
export const insertChapterSchema = createInsertSchema(chaptersTable);
export const insertSceneSchema = createInsertSchema(scenesTable).omit({ updatedAt: true });

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type InsertScene = z.infer<typeof insertSceneSchema>;
export type Project = typeof projectsTable.$inferSelect;
export type Character = typeof charactersTable.$inferSelect;
export type Chapter = typeof chaptersTable.$inferSelect;
export type Scene = typeof scenesTable.$inferSelect;