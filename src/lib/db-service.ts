import db, { Pick, Tag, PickWithTags } from './db';

export class DbService {
  // Pick operations
  static createPick(pick: Omit<Pick, 'id' | 'created_at'>, tagNames: string[]): number {
    const transaction = db.transaction((pickData: Omit<Pick, 'id' | 'created_at'>, tagNames: string[]) => {
      // Insert the pick
      const insertPick = db.prepare(`
        INSERT INTO picks (title, description, location, date)
        VALUES (?, ?, ?, ?)
      `);
      const result = insertPick.run(pickData.title, pickData.description, pickData.location, pickData.date);
      const pickId = result.lastInsertRowid as number;

      // Handle tags
      if (tagNames.length > 0) {
        const insertTag = db.prepare(`
          INSERT OR IGNORE INTO tags (name) VALUES (?)
        `);
        const getTagId = db.prepare(`
          SELECT id FROM tags WHERE name = ?
        `);
        const linkPickTag = db.prepare(`
          INSERT INTO pick_tags (pick_id, tag_id) VALUES (?, ?)
        `);

        for (const tagName of tagNames) {
          insertTag.run(tagName.toLowerCase().trim());
          const tag = getTagId.get(tagName.toLowerCase().trim()) as { id: number };
          linkPickTag.run(pickId, tag.id);
        }
      }

      return pickId;
    });

    return transaction(pick, tagNames);
  }

  static getAllPicks(): PickWithTags[] {
    const picks = db.prepare(`
      SELECT * FROM picks ORDER BY created_at DESC
    `).all() as Pick[];

    return picks.map(pick => ({
      ...pick,
      tags: this.getTagsForPick(pick.id)
    }));
  }

  static getTagsForPick(pickId: number): Tag[] {
    return db.prepare(`
      SELECT t.* FROM tags t
      JOIN pick_tags pt ON t.id = pt.tag_id
      WHERE pt.pick_id = ?
    `).all(pickId) as Tag[];
  }

  static searchPicks(query?: string, tagIds?: number[]): PickWithTags[] {
    let sql = `
      SELECT DISTINCT p.* FROM picks p
    `;
    const params: (string | number)[] = [];

    if (tagIds && tagIds.length > 0) {
      sql += `
        JOIN pick_tags pt ON p.id = pt.pick_id
        WHERE pt.tag_id IN (${tagIds.map(() => '?').join(',')})
      `;
      params.push(...tagIds);
    }

    if (query) {
      const whereClause = tagIds && tagIds.length > 0 ? ' AND ' : ' WHERE ';
      sql += `${whereClause}(p.title LIKE ? OR p.description LIKE ? OR p.location LIKE ?)`;
      const queryParam = `%${query}%`;
      params.push(queryParam, queryParam, queryParam);
    }

    sql += ' ORDER BY p.created_at DESC';

    const picks = db.prepare(sql).all(...params) as Pick[];

    return picks.map(pick => ({
      ...pick,
      tags: this.getTagsForPick(pick.id)
    }));
  }

  // Tag operations
  static getAllTags(): Tag[] {
    return db.prepare(`
      SELECT * FROM tags ORDER BY name ASC
    `).all() as Tag[];
  }

  static getTagsByNames(names: string[]): Tag[] {
    if (names.length === 0) return [];
    
    const placeholders = names.map(() => '?').join(',');
    return db.prepare(`
      SELECT * FROM tags WHERE name IN (${placeholders})
    `).all(...names.map(name => name.toLowerCase().trim())) as Tag[];
  }
}