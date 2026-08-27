import { Router, type IRouter } from "express";
import { count, eq, isNull } from "drizzle-orm";
import {
  db,
  projectsTable,
  charactersTable,
  chaptersTable,
  scenesTable,
} from "@workspace/db";
import {
  CreateCharacterBody,
  GetDashboardResponse,
  ListCharactersResponse,
  ListChaptersResponse,
  ListScenesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const projectId = "project-echoes";
let seedPromise: Promise<void> | undefined;

async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const existing = await db.select({ id: projectsTable.id }).from(projectsTable).limit(1);
      if (existing.length > 0) return;

      await db.insert(projectsTable).values({
        id: projectId,
        name: "Echoes of Meridian",
        genre: "Mystery · Supernatural",
        status: "In development",
        progress: "68",
        description: "A branching mystery about memory, grief, and the city that refuses to forget.",
        isExample: "true",
      });
      await db.insert(charactersTable).values([
        {
          id: "char-mara",
          projectId,
          name: "Mara Voss",
          role: "Protagonist",
          initials: "MV",
          description: "A memory archivist returning to a city she swore to leave behind.",
          arc: "Learning to trust what she remembers.",
          tags: ["protagonist", "memory", "arc: active"],
        },
        {
          id: "char-eli",
          projectId,
          name: "Elias Wren",
          role: "Deuteragonist",
          initials: "EW",
          description: "An investigator who knows more about the disappearances than he admits.",
          arc: "From keeper of secrets to reluctant witness.",
          tags: ["ally", "mystery", "route: north"],
        },
        {
          id: "char-sable",
          projectId,
          name: "Sable",
          role: "Unknown",
          initials: "SB",
          description: "A voice arriving through the old radio network after midnight.",
          arc: "A presence without a body — for now.",
          tags: ["antagonist?", "signal", "secret"],
        },
        {
          id: "char-juno",
          projectId,
          name: "Juno Vale",
          role: "Supporting",
          initials: "JV",
          description: "Owner of the last independent cinema in the old quarter.",
          arc: "Protecting a community built on borrowed time.",
          tags: ["supporting", "old quarter"],
        },
      ]);
      await db.insert(chaptersTable).values([
        {
          id: "chapter-1",
          projectId,
          number: "1",
          title: "The Return",
          status: "Complete",
          sceneCount: "8",
          summary: "Mara comes home for a funeral and finds a message written in her own handwriting.",
        },
        {
          id: "chapter-2",
          projectId,
          number: "2",
          title: "The Static",
          status: "In progress",
          sceneCount: "6",
          summary: "The radio starts speaking in the voices of people the city has lost.",
        },
        {
          id: "chapter-3",
          projectId,
          number: "3",
          title: "Under the Archive",
          status: "Outline",
          sceneCount: "0",
          summary: "The truth beneath Meridian's oldest building begins to surface.",
        },
      ]);
      await db.insert(scenesTable).values([
        {
          id: "scene-18",
          chapterId: "chapter-2",
          projectId,
          number: "18",
          title: "The Broadcast",
          location: "Mara's apartment",
          kind: "Dialogue",
          status: "Draft",
          preview: "The radio crackles. A voice says her name, then asks why she came back.",
        },
        {
          id: "scene-17",
          chapterId: "chapter-2",
          projectId,
          number: "17",
          title: "A Door Below",
          location: "Meridian Archive",
          kind: "Exploration",
          status: "Review",
          preview: "Elias finds a staircase that does not appear on any floor plan.",
        },
        {
          id: "scene-16",
          chapterId: "chapter-2",
          projectId,
          number: "16",
          title: "Negative Space",
          location: "Old Quarter",
          kind: "Choice",
          status: "Complete",
          preview: "Mara decides whether to follow the signal or protect Juno from the truth.",
        },
        {
          id: "scene-08",
          chapterId: "chapter-1",
          projectId,
          number: "8",
          title: "The Handwriting",
          location: "Voss family house",
          kind: "Revelation",
          status: "Complete",
          preview: "A note in Mara's handwriting describes an event she cannot remember.",
        },
      ]);
    })();
  } else {
    await seedPromise;
  }
  const [demoProject] = await db.select({ id: projectsTable.id }).from(projectsTable).where(eq(projectsTable.id, projectId)).limit(1);
  if (demoProject) {
    await db.update(projectsTable).set({ isExample: "true" }).where(eq(projectsTable.id, projectId));
    await Promise.all([
      db.update(charactersTable).set({ projectId }).where(isNull(charactersTable.projectId)),
      db.update(chaptersTable).set({ projectId }).where(isNull(chaptersTable.projectId)),
      db.update(scenesTable).set({ projectId }).where(isNull(scenesTable.projectId)),
    ]);
  }
}

function iso(date: Date | null) {
  return (date ?? new Date()).toISOString();
}

router.get("/projects", async (_req, res) => {
  await ensureSeeded();
  const projects = await db.select().from(projectsTable);
  res.json(projects.map((project) => ({
    ...project,
    progress: Number(project.progress),
    isExample: project.isExample === "true",
    updatedAt: iso(project.updatedAt),
  })));
});

router.post("/projects", async (req, res) => {
  await ensureSeeded();
  const { name, genre, description } = req.body as {
    name?: unknown;
    genre?: unknown;
    description?: unknown;
  };
  if (typeof name !== "string" || name.trim().length === 0 || typeof genre !== "string" || genre.trim().length === 0) {
    res.status(400).json({ error: "Project name and genre are required." });
    return;
  }
  const [project] = await db.insert(projectsTable).values({
    id: `project-${crypto.randomUUID().slice(0, 8)}`,
    name: name.trim(),
    genre: genre.trim(),
    status: "In development",
    progress: "0",
    description: typeof description === "string" ? description.trim() : "",
    isExample: "false",
  }).returning();
  res.status(201).json({
    ...project,
    progress: Number(project.progress),
    isExample: false,
    updatedAt: iso(project.updatedAt),
  });
});

router.get("/dashboard", async (req, res) => {
  await ensureSeeded();
  const requestedId = typeof req.query.projectId === "string" ? req.query.projectId : projectId;
  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, requestedId)).limit(1);
  if (!project) {
    res.status(404).json({ error: "Project not found." });
    return;
  }
  const projectFilter = eq(charactersTable.projectId, project.id);
  const chapterFilter = eq(chaptersTable.projectId, project.id);
  const sceneFilter = eq(scenesTable.projectId, project.id);
  const [characters, chapters, scenes, issues] = await Promise.all([
    db.select({ value: count() }).from(charactersTable).where(projectFilter),
    db.select({ value: count() }).from(chaptersTable).where(chapterFilter),
    db.select({ value: count() }).from(scenesTable).where(sceneFilter),
    Promise.resolve([{ value: 3 }]),
  ]);
  const data = {
    project: {
      ...project,
      progress: Number(project.progress),
      isExample: project.isExample === "true",
      updatedAt: iso(project.updatedAt),
    },
    stats: {
      characters: Number(characters[0]?.value ?? 0),
      chapters: Number(chapters[0]?.value ?? 0),
      scenes: Number(scenes[0]?.value ?? 0),
      decisions: 12,
      endings: 4,
      issues: Number(issues[0]?.value ?? 0),
    },
    health: [
      { label: "Overall", value: 87, color: "teal" },
      { label: "Continuity", value: 92, color: "teal" },
      { label: "Characters", value: 84, color: "violet" },
      { label: "Timeline", value: 95, color: "amber" },
      { label: "Branches", value: 79, color: "coral" },
      { label: "World rules", value: 91, color: "blue" },
    ],
    activity: project.id === projectId ? [
      { id: "activity-1", type: "scene", title: "The Broadcast", detail: "Scene 18 · Draft updated", timestamp: "12 min ago" },
      { id: "activity-2", type: "character", title: "Elias Wren", detail: "Arc notes edited", timestamp: "1 hr ago" },
      { id: "activity-3", type: "qa", title: "3 continuity issues", detail: "Narrative QA scan completed", timestamp: "Yesterday" },
      { id: "activity-4", type: "world", title: "Meridian Archive", detail: "Location added to canon", timestamp: "Yesterday" },
    ] : [],
  };
  res.json(GetDashboardResponse.parse(data));
});

router.get("/characters", async (req, res) => {
  await ensureSeeded();
  const requestedId = typeof req.query.projectId === "string" ? req.query.projectId : projectId;
  const rows = await db.select().from(charactersTable).where(eq(charactersTable.projectId, requestedId));
  res.json(ListCharactersResponse.parse(rows.map((character) => ({
    ...character,
    updatedAt: iso(character.updatedAt),
  }))));
});

router.post("/characters", async (req, res) => {
  await ensureSeeded();
  const input = CreateCharacterBody.parse(req.body);
  const requestedId = typeof req.query.projectId === "string" ? req.query.projectId : projectId;
  const id = `char-${crypto.randomUUID().slice(0, 8)}`;
  const initials = input.name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const [created] = await db.insert(charactersTable).values({
    id,
    projectId: requestedId,
    name: input.name,
    role: input.role,
    initials,
    description: input.description,
    arc: input.arc,
    tags: input.tags ?? [],
  }).returning();
  res.status(201).json({
    ...created,
    updatedAt: iso(created.updatedAt),
  });
});

router.get("/chapters", async (req, res) => {
  await ensureSeeded();
  const requestedId = typeof req.query.projectId === "string" ? req.query.projectId : projectId;
  const rows = await db.select().from(chaptersTable).where(eq(chaptersTable.projectId, requestedId));
  res.json(ListChaptersResponse.parse(rows.map((chapter) => ({
    ...chapter,
    number: Number(chapter.number),
    sceneCount: Number(chapter.sceneCount),
  }))));
});

router.get("/scenes", async (req, res) => {
  await ensureSeeded();
  const requestedId = typeof req.query.projectId === "string" ? req.query.projectId : projectId;
  const rows = await db.select().from(scenesTable).where(eq(scenesTable.projectId, requestedId));
  res.json(ListScenesResponse.parse(rows.map((scene) => ({
    ...scene,
    number: Number(scene.number),
    updatedAt: iso(scene.updatedAt),
  }))));
});

export default router;