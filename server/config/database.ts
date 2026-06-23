import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { ProjectType, EducationType, AboutType, CVType, AdminProfile, CertificateType } from '../types/index.js';
import { PortfolioModel } from '../models/portfolioModel.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio_db.json');

export interface DatabaseSchema {
  admin: AdminProfile & {
    passwordHash: string;
    resetPasswordToken?: string | null;
    resetPasswordExpire?: string | null;
    resetPasswordOTP?: string | null;
    resetPasswordOTPExpires?: string | null;
  };
  projects: ProjectType[];
  education: EducationType[];
  certificates: CertificateType[];
  about: AboutType;
  cv: CVType;
  recentActivity: string[];
}

let syncDBCache: DatabaseSchema | null = null;
let isConnectedToMongo = false;

const getDefaultDB = (): DatabaseSchema => ({
  admin: {
    name: 'Admin',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
    resetPasswordToken: null,
    resetPasswordExpire: null,
    resetPasswordOTP: null,
    resetPasswordOTPExpires: null,
    profileImage: { url: '', publicId: '' },
    bio: 'Portfolio Administrator',
    title: 'Administrator',
    socialLinks: { github: '', linkedin: '', twitter: '', instagram: '' }
  },
  projects: [],
  education: [],
  certificates: [],
  about: {
    title: 'About Me',
    content: 'Welcome to my portfolio.',
    image: { url: '', publicId: '' },
    skills: [],
    achievements: []
  },
  cv: {
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
  recentActivity: ['App launched successfully.']
});

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[MongoDB Connect] MONGODB_URI is not defined. Falling back to JSON storage.');
    return;
  }

  try {
    console.log('[MongoDB Connect] Connecting to database...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnectedToMongo = true;
    console.log('[MongoDB Connect] Successfully established connection to MongoDB.');

    // Load data from MongoDB on startup
    await loadFromMongoDB();
  } catch (error) {
    console.error('[MongoDB Error] Database connection failed:', error);
    isConnectedToMongo = false;
  }
};

const loadFromMongoDB = async (): Promise<void> => {
  try {
    const mongoData = await (PortfolioModel as any).findOne().lean();
    if (mongoData) {
      console.log('[MongoDB] Successfully loaded existing portfolio data from MongoDB.');
      console.log(`[MongoDB] Projects: ${mongoData.projects?.length || 0}`);
      console.log(`[MongoDB] Education: ${mongoData.education?.length || 0}`);
      console.log(`[MongoDB] Certificates: ${mongoData.certificates?.length || 0}`);
      
      // Convert MongoDB document to our schema
      syncDBCache = {
        admin: mongoData.admin,
        projects: mongoData.projects || [],
        education: mongoData.education || [],
        certificates: mongoData.certificates || [],
        about: mongoData.about || getDefaultDB().about,
        cv: mongoData.cv || getDefaultDB().cv,
        recentActivity: mongoData.recentActivity || ['App launched successfully.']
      };
      
      // Also save to local file for redundancy
      saveToFile(syncDBCache);
    } else {
      console.log('[MongoDB] No existing data found. Creating default portfolio document.');
      const defaultData = getDefaultDB();
      await (PortfolioModel as any).create(defaultData);
      syncDBCache = defaultData;
      saveToFile(defaultData);
    }
  } catch (error) {
    console.error('[MongoDB] Failed to load data:', error);
    // Try to load from file as fallback
    loadFromFile();
  }
};

const loadFromFile = (): void => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const db = JSON.parse(raw) as DatabaseSchema;
      syncDBCache = db;
      console.log('[File] Loaded data from local file system.');
    }
  } catch (error) {
    console.error('[File] Failed to load from file:', error);
  }
};

const saveToFile = (db: DatabaseSchema): void => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save to file system:', error);
  }
};

export const loadDB = (): DatabaseSchema => {
  // If memory cache is available, return it
  if (syncDBCache) {
    return syncDBCache;
  }

  // Try to load from file system
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const db = JSON.parse(raw) as DatabaseSchema;
      
      // Ensure all required fields exist
      if (!db.recentActivity) db.recentActivity = ['App launched successfully.'];
      if (!db.about) db.about = getDefaultDB().about;
      if (!db.cv) db.cv = getDefaultDB().cv;
      if (!db.admin) db.admin = getDefaultDB().admin;
      if (!db.projects) db.projects = [];
      if (!db.education) db.education = [];
      if (!db.certificates) db.certificates = [];

      syncDBCache = db;
      console.log('[Database] Loaded data from file system.');
      return db;
    }

    // If no file exists, create default
    console.log('[Database] No existing database file found. Creating default data.');
    const defaultDB = getDefaultDB();
    saveToFile(defaultDB);
    syncDBCache = defaultDB;
    return defaultDB;
  } catch (error: any) {
    console.error('Failed to load portfolio database:', error);
    const defaultDB = getDefaultDB();
    syncDBCache = defaultDB;
    return defaultDB;
  }
};

export const saveDB = (db: DatabaseSchema): void => {
  // 1. Update local cache
  syncDBCache = db;

  // 2. Persist to file
  saveToFile(db);

  // 3. Persist to MongoDB
  if (isConnectedToMongo) {
    (PortfolioModel as any).findOneAndUpdate(
      {}, 
      db, 
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
      .exec()
      .then(() => {
        console.log('[MongoDB Sync] Portfolio document persisted successfully.');
      })
      .catch((err: any) => {
        console.error('[MongoDB Sync Error]', err);
      });
  }
};

export const logActivity = (message: string): void => {
  try {
    const db = loadDB();
    const timestamp = new Date().toLocaleString();
    db.recentActivity.unshift(`[${timestamp}] ${message}`);
    if (db.recentActivity.length > 30) {
      db.recentActivity = db.recentActivity.slice(0, 30);
    }
    saveDB(db);
  } catch (err) {
    console.error('Activity log error:', err);
  }
};