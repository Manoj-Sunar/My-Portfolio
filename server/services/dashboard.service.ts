import { loadDB } from "../config/database.js";


export class DashboardService {
  public getStats() {
    const db = loadDB();

    const totalProjects = db.projects ? db.projects.length : 0;
    const totalEducation = db.education ? db.education.length : 0;
    const totalSkills = (db.about && db.about.skills) ? db.about.skills.length : 0;
    const totalCertificates = db.certificates ? db.certificates.length : 0;

    return {
      totalProjects,
      totalEducation,
      totalSkills,
      totalCertificates,
      recentActivity: db.recentActivity || []
    };
  }
}
export const dashboardService = new DashboardService();
