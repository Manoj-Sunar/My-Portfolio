import { loadDB, logActivity, saveDB } from "../config/database.js";
import { deleteFile } from "../middleware/upload.js";
import { CertificateType } from "../types/index.js";
import { AppError } from "../utils/AppError.js";


export class CertificateService {
  public getAllCertificates() {
    const db = loadDB();
    const certificates = db.certificates || [];
    return [...certificates].sort((a, b) => a.order - b.order);
  }

  public getCertificateById(id: string) {
    const db = loadDB();
    const certificates = db.certificates || [];
    const cert = certificates.find(c => c.id === id);
    if (!cert) {
      throw new AppError('The requested certificate record does not exist.', 404);
    }
    return cert;
  }

  public createCertificate(data: Partial<CertificateType>) {
    const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, image } = data;

    if (!title || !issuer || !issueDate) {
      throw new AppError('Title, issuer, and issue date are required parameters.', 400);
    }

    const db = loadDB();
    const certificates = db.certificates || [];
    const maxOrder = certificates.reduce((max, c) => (c.order > max ? c.order : max), 0);

    const newCert: CertificateType = {
      id: 'cert_' + Date.now().toString(),
      title,
      issuer,
      issueDate,
      expiryDate: expiryDate || '',
      credentialId: credentialId || '',
      credentialUrl: credentialUrl || '',
      image: image || { url: '', publicId: '' },
      order: maxOrder + 1,
    };

    certificates.push(newCert);
    db.certificates = certificates;
    saveDB(db);

    logActivity(`Uploaded/created certificate: "${title}" (issued by ${issuer})`);
    return newCert;
  }

  public updateCertificate(id: string, updates: Partial<CertificateType>) {
    const db = loadDB();
    const certificates = db.certificates || [];
    const idx = certificates.findIndex(c => c.id === id);

    if (idx === -1) {
      throw new AppError('The certificate record sought for modification was not found.', 404);
    }

    const currentCert = certificates[idx];

    // Soft asset cleanup if certificate image switches
    if (updates.image && updates.image.publicId && currentCert.image && currentCert.image.publicId && currentCert.image.publicId !== updates.image.publicId) {
      deleteFile(currentCert.image.publicId).catch(err =>
        console.error('[Certificate Service Asset Cleanup] Failed to delete target image:', err)
      );
    }

    const updatedCert: CertificateType = {
      ...currentCert,
      title: updates.title !== undefined ? updates.title : currentCert.title,
      issuer: updates.issuer !== undefined ? updates.issuer : currentCert.issuer,
      issueDate: updates.issueDate !== undefined ? updates.issueDate : currentCert.issueDate,
      expiryDate: updates.expiryDate !== undefined ? updates.expiryDate : currentCert.expiryDate,
      credentialId: updates.credentialId !== undefined ? updates.credentialId : currentCert.credentialId,
      credentialUrl: updates.credentialUrl !== undefined ? updates.credentialUrl : currentCert.credentialUrl,
      image: updates.image !== undefined ? updates.image : currentCert.image,
      order: updates.order !== undefined ? Number(updates.order) : currentCert.order,
    };

    certificates[idx] = updatedCert;
    db.certificates = certificates;
    saveDB(db);

    logActivity(`Updated certificate record: "${updatedCert.title}"`);
    return updatedCert;
  }

  public deleteCertificate(id: string) {
    const db = loadDB();
    const certificates = db.certificates || [];
    const record = certificates.find(c => c.id === id);

    if (!record) {
      throw new AppError('The certificate record requested for deletion does not exist.', 404);
    }

    // Asset unlinking
    if (record.image && record.image.publicId) {
      deleteFile(record.image.publicId).catch(err =>
        console.error('[Certificate Service Asset Unlink] Failed to delete target asset:', err)
      );
    }

    const filtered = certificates.filter(c => c.id !== id);
    db.certificates = filtered;
    saveDB(db);

    logActivity(`Deleted certificate record: "${record.title}"`);
    return true;
  }
}
export const certificateService = new CertificateService();
