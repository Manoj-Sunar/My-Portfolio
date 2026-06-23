import { loadDB } from "../config/database.js";

export class PortfolioService {
  public getPortfolioData() {
    try {
      const db = loadDB();
      
      // Ensure all required fields exist with defaults
      return {
        about: db.about || {
          title: 'About Me',
          content: 'Welcome to my portfolio.',
          image: { url: '', publicId: '' },
          skills: [],
          achievements: []
        },
        projects: db.projects || [],
        education: db.education || [],
        certificates: db.certificates || [],
        cv: db.cv || {
          personalInfo: {
            name: 'Your Name',
            email: 'your@email.com',
            phone: '',
            address: '',
            website: '',
            title: 'Professional Title',
            summary: 'Professional summary'
          },
          sections: [],
          skills: [],
          languages: [],
          references: [],
          template: 'modern'
        },
      };
    } catch (error) {
      console.error('[Portfolio Service] Error loading portfolio data:', error);
      // Return empty data structure to prevent frontend errors
      return {
        about: { title: '', content: '', image: { url: '', publicId: '' }, skills: [], achievements: [] },
        projects: [],
        education: [],
        certificates: [],
        cv: {
          personalInfo: { name: '', email: '', phone: '', address: '', website: '', title: '', summary: '' },
          sections: [],
          skills: [],
          languages: [],
          references: [],
          template: 'modern'
        }
      };
    }
  }
}

export const portfolioService = new PortfolioService();