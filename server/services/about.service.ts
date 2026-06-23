import { loadDB, logActivity, saveDB } from "../config/database.js";
import { deleteFile } from "../middleware/upload.js";
import { AboutType } from "../types/index.js";


export class AboutService {
  public getAbout() {
    const db = loadDB();
    return db.about;
  }

  public updateAbout(updates: Partial<AboutType>) {
    const db = loadDB();
    const previousAbout = db.about;

    // Delete redundant profile image files if we upload and link a new one
    if (updates.image && updates.image.publicId && previousAbout.image && previousAbout.image.publicId && previousAbout.image.publicId !== updates.image.publicId) {
      deleteFile(previousAbout.image.publicId).catch(err =>
        console.error('[About Service Asset cleanup] failed:', err)
      );
    }

    const updatedAbout: AboutType = {
      title: updates.title !== undefined ? updates.title : previousAbout.title,
      content: updates.content !== undefined ? updates.content : previousAbout.content,
      image: updates.image !== undefined ? updates.image : previousAbout.image,
      skills: Array.isArray(updates.skills) ? updates.skills : previousAbout.skills,
      achievements: Array.isArray(updates.achievements) ? updates.achievements : previousAbout.achievements,
    };

    db.about = updatedAbout;
    saveDB(db);
    logActivity('About sections and technical skills updated.');

    return updatedAbout;
  }
}
export const aboutService = new AboutService();
