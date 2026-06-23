import { loadDB, logActivity, saveDB } from "../config/database.js";
import { CVType } from "../types/index.js";

export class CVService {
  public getCV() {
    const db = loadDB();
    return db.cv;
  }

  public updateCV(updates: Partial<CVType>) {
    const db = loadDB();
    const currentCV = db.cv;

    const updatedCV: CVType = {
      personalInfo: updates.personalInfo || currentCV.personalInfo,
      sections: Array.isArray(updates.sections) ? updates.sections : currentCV.sections,
      skills: Array.isArray(updates.skills) ? updates.skills : currentCV.skills,
      languages: Array.isArray(updates.languages) ? updates.languages : currentCV.languages,
      references: Array.isArray(updates.references) ? updates.references : currentCV.references,
      template: updates.template || currentCV.template || 'modern'
    };

    db.cv = updatedCV;
    saveDB(db);
    logActivity('CV content and styling template updated.');

    return updatedCV;
  }
}
export const cvService = new CVService();
