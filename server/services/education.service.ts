import { loadDB, logActivity, saveDB } from "../config/database.js";
import { EducationType } from "../types/index.js";
import { AppError } from "../utils/AppError.js";


export class EducationService {
  public getAllEducation() {
    const db = loadDB();
    const education = db.education || [];
    return [...education].sort((a, b) => a.order - b.order);
  }

  public getEducationById(id: string) {
    const db = loadDB();
    const education = db.education || [];
    const edu = education.find(e => e.id === id);
    if (!edu) {
      throw new AppError('The requested education record does not exist.', 404);
    }
    return edu;
  }

  public createEducation(data: Partial<EducationType>) {
    const { institution, degree, field, startDate, endDate, isCurrent, description, grade } = data;

    if (!institution || !degree || !field || !startDate) {
      throw new AppError('Institution, degree, field, and start date are required parameters.', 400);
    }

    const db = loadDB();
    const education = db.education || [];
    const maxOrder = education.reduce((max, e) => (e.order > max ? e.order : max), 0);

    const newEdu: EducationType = {
      id: 'edu_' + Date.now().toString(),
      institution,
      degree,
      field,
      startDate,
      endDate: isCurrent ? '' : (endDate || ''),
      isCurrent: !!isCurrent,
      description: description || '',
      grade: grade || '',
      order: maxOrder + 1,
    };

    education.push(newEdu);
    db.education = education;
    saveDB(db);

    logActivity(`Created education record: "${institution}" (${degree})`);
    return newEdu;
  }

  public updateEducation(id: string, updates: Partial<EducationType>) {
    const db = loadDB();
    const education = db.education || [];
    const idx = education.findIndex(e => e.id === id);

    if (idx === -1) {
      throw new AppError('The education record sought for modification was not found.', 404);
    }

    const currentEdu = education[idx];

    const updatedEdu: EducationType = {
      ...currentEdu,
      institution: updates.institution !== undefined ? updates.institution : currentEdu.institution,
      degree: updates.degree !== undefined ? updates.degree : currentEdu.degree,
      field: updates.field !== undefined ? updates.field : currentEdu.field,
      startDate: updates.startDate !== undefined ? updates.startDate : currentEdu.startDate,
      endDate: updates.isCurrent ? '' : (updates.endDate !== undefined ? updates.endDate : currentEdu.endDate),
      isCurrent: updates.isCurrent !== undefined ? !!updates.isCurrent : currentEdu.isCurrent,
      description: updates.description !== undefined ? updates.description : currentEdu.description,
      grade: updates.grade !== undefined ? updates.grade : currentEdu.grade,
      order: updates.order !== undefined ? Number(updates.order) : currentEdu.order,
    };

    education[idx] = updatedEdu;
    db.education = education;
    saveDB(db);

    logActivity(`Updated education record: "${updatedEdu.institution}"`);
    return updatedEdu;
  }

  public deleteEducation(id: string) {
    const db = loadDB();
    const education = db.education || [];
    const record = education.find(e => e.id === id);

    if (!record) {
      throw new AppError('The education record requested for deletion does not exist.', 404);
    }

    const filtered = education.filter(e => e.id !== id);
    db.education = filtered;
    saveDB(db);

    logActivity(`Deleted education record: "${record.institution}"`);
    return true;
  }
}
export const educationService = new EducationService();
