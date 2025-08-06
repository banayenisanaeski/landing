# Security Requirements - BanaYeni SanaEski

**Document Type:** Comprehensive Security Framework  
**Created:** August 6, 2025  
**Version:** 1.0  
**Status:** Security Implementation Guide  

---

## Security Overview

This document defines the comprehensive security requirements for BanaYeni SanaEski, a Turkish automotive parts marketplace. The security framework addresses data protection, user privacy, business logic security, and regulatory compliance specific to the Turkish market and European data protection standards.

**Security Priorities:**
- **Data Protection:** Turkish personal data and business information security
- **Authentication Security:** Robust user identity management with Supabase Auth
- **Business Logic Protection:** Interest-gating system and anti-fraud measures
- **Infrastructure Security:** Cloud-native security with Vercel and Supabase
- **Regulatory Compliance:** GDPR/KVKK compliance for Turkish and European users

---

## Security Architecture

### 1. Defense in Depth Strategy

**Multi-Layer Security Model:**
```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                       │
│  • Input Validation • XSS Protection • CSRF Protection │
├─────────────────────────────────────────────────────────┤
│                   Application Layer                     │
│  • Authentication • Authorization • Rate Limiting       │
├─────────────────────────────────────────────────────────┤
│                     API Gateway                         │
│  • Request Validation • SQL Injection Prevention       │
├─────────────────────────────────────────────────────────┤
│                   Database Layer                        │
│  • Row Level Security • Encrypted Storage • Backups    │
├─────────────────────────────────────────────────────────┤
│                Infrastructure Layer                     │
│  • Network Security • SSL/TLS • DDoS Protection        │
└─────────────────────────────────────────────────────────┘
```

**Security Domains:**
- **Frontend Security:** Client-side input validation and XSS prevention
- **API Security:** Server-side validation, authentication, and rate limiting
- **Database Security:** Row-level security policies and encryption
- **Infrastructure Security:** Network protection and SSL/TLS termination
- **Business Logic Security:** Interest-gating protection and fraud prevention

---

## Authentication and Authorization

### 2. User Authentication Framework

**Supabase Auth Integration:**
```typescript
// lib/auth/security-config.ts - Production authentication configuration
import { createClient } from '@supabase/supabase-js';

export const secureAuthConfig = {
  // Authentication settings
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // More secure PKCE flow for production
    debug: false, // Never enable in production
  },
  
  // Security headers
  global: {
    headers: {
      'X-Client-Info': 'BanaYeni-SanaEski/1.0',
      'User-Agent': 'BanaYeni-SanaEski-Web/1.0',
    },
  },
  
  // Session management
  session: {
    maxAge: 3600, // 1 hour session timeout
    refreshThreshold: 600, // Refresh 10 minutes before expiry
  },
};

// Authentication middleware for API routes
export const withAuth = (
  handler: (req: NextApiRequest, res: NextApiResponse, user: User) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Extract and validate JWT token
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ 
          error: 'Yetkilendirme gerekli', // "Authorization required" in Turkish
          code: 'AUTH_REQUIRED' 
        });
      }
      
      // Verify token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ 
          error: 'Geçersiz oturum', // "Invalid session" in Turkish
          code: 'INVALID_SESSION' 
        });
      }
      
      // Check user status and profile completion
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('profile_complete, status')
        .eq('id', user.id)
        .single();
      
      if (!profile || profile.status !== 'active') {
        return res.status(403).json({ 
          error: 'Hesap aktif değil', // "Account not active" in Turkish
          code: 'ACCOUNT_INACTIVE' 
        });
      }
      
      // Proceed with authenticated request
      await handler(req, res, user);
      
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(500).json({ 
        error: 'Sunucu hatası', // "Server error" in Turkish
        code: 'SERVER_ERROR' 
      });
    }
  };
};
```

**Password Security Requirements:**
```typescript
// lib/auth/password-security.ts - Password validation for Turkish users
export const passwordRequirements = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: false, // Relaxed for Turkish user experience
  requireLowercase: false,
  requireNumbers: true,
  requireSpecialChars: false, // Relaxed for Turkish keyboards
  
  // Turkish-specific validations
  forbiddenPatterns: [
    /123456/,
    /password/,
    /sifre/, // Turkish for "password"
    /parola/, // Another Turkish word for "password"
  ],
  
  // Common Turkish names/words to avoid
  forbiddenWords: [
    'istanbul', 'ankara', 'izmir', 'bursa',
    'mustafa', 'ahmet', 'mehmet', 'ali',
    'banayeni', 'sanaeski', // Application-specific
  ],
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  // Length validation
  if (password.length < passwordRequirements.minLength) {
    errors.push(`Şifre en az ${passwordRequirements.minLength} karakter olmalıdır`);
  }
  
  if (password.length > passwordRequirements.maxLength) {
    errors.push(`Şifre en fazla ${passwordRequirements.maxLength} karakter olabilir`);
  }
  
  // Number requirement
  if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Şifre en az bir rakam içermelidir');
  }
  
  // Forbidden patterns
  for (const pattern of passwordRequirements.forbiddenPatterns) {
    if (pattern.test(password.toLowerCase())) {
      errors.push('Şifre çok yaygın bir desen içeriyor');
      break;
    }
  }
  
  // Forbidden words
  const lowerPassword = password.toLowerCase();
  for (const word of passwordRequirements.forbiddenWords) {
    if (lowerPassword.includes(word)) {
      errors.push('Şifre yaygın bir kelime içeriyor');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password),
  };
};
```

### 3. Role-Based Access Control (RBAC)

**User Roles and Permissions:**
```sql
-- User roles for Turkish marketplace
CREATE TYPE user_role AS ENUM ('user', 'premium_user', 'moderator', 'admin');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended', 'banned');

-- Enhanced user profiles with security context
ALTER TABLE public.user_profiles ADD COLUMN role user_role DEFAULT 'user';
ALTER TABLE public.user_profiles ADD COLUMN status user_status DEFAULT 'pending';
ALTER TABLE public.user_profiles ADD COLUMN last_login_at TIMESTAMPTZ;
ALTER TABLE public.user_profiles ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE public.user_profiles ADD COLUMN locked_until TIMESTAMPTZ;
ALTER TABLE public.user_profiles ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.user_profiles ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;

-- Permission matrix for Turkish marketplace
CREATE TABLE public.permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role permissions mapping
CREATE TABLE public.role_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role user_role NOT NULL,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    granted_by UUID REFERENCES public.user_profiles(id),
    
    UNIQUE(role, permission_id)
);

-- Insert Turkish marketplace permissions
INSERT INTO public.permissions (name, description) VALUES
-- Basic permissions
('parts.view', 'View active parts'),
('parts.search', 'Search parts with filters'),
('interests.express', 'Express interest in parts'),

-- Authenticated user permissions  
('parts.create', 'Create new parts for sale'),
('parts.edit_own', 'Edit own parts'),
('parts.delete_own', 'Delete own parts'),
('conversations.participate', 'Participate in conversations'),
('profile.edit_own', 'Edit own profile'),

-- Premium user permissions
('parts.featured', 'Create featured part listings'),
('analytics.view_own', 'View own part analytics'),
('priority_support.access', 'Access priority customer support'),

-- Moderator permissions
('parts.moderate', 'Moderate reported parts'),
('users.moderate', 'Moderate user reports'),
('conversations.moderate', 'Access reported conversations'),

-- Admin permissions
('users.manage', 'Full user management'),
('system.configure', 'System configuration'),
('analytics.view_all', 'View system-wide analytics');

-- Assign permissions to roles
INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'user', id FROM public.permissions WHERE name IN (
    'parts.view', 'parts.search', 'interests.express',
    'parts.create', 'parts.edit_own', 'parts.delete_own',
    'conversations.participate', 'profile.edit_own'
);

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'premium_user', id FROM public.permissions WHERE name LIKE '%';

-- Authorization helper function
CREATE OR REPLACE FUNCTION public.user_has_permission(user_id UUID, permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role_val user_role;
    has_permission BOOLEAN := FALSE;
BEGIN
    -- Get user role
    SELECT role INTO user_role_val 
    FROM public.user_profiles 
    WHERE id = user_id AND status = 'active';
    
    -- Check if user has permission
    SELECT EXISTS(
        SELECT 1 
        FROM public.role_permissions rp
        JOIN public.permissions p ON rp.permission_id = p.id
        WHERE rp.role = user_role_val AND p.name = permission_name
    ) INTO has_permission;
    
    RETURN has_permission;
END;
$$;
```

---

## Data Protection and Privacy

### 4. Personal Data Protection (GDPR/KVKK Compliance)

**Data Classification:**
```typescript
// lib/security/data-classification.ts - Data sensitivity levels
export enum DataSensitivity {
  PUBLIC = 'public',           // Part titles, descriptions (non-personal)
  INTERNAL = 'internal',       // User IDs, timestamps
  CONFIDENTIAL = 'confidential', // Email addresses, phone numbers
  RESTRICTED = 'restricted',   // Passwords, payment info, personal messages
}

export interface DataClassification {
  sensitivity: DataSensitivity;
  retention: number; // days
  encryptionRequired: boolean;
  auditRequired: boolean;
  gdprApplicable: boolean;
  kvkkApplicable: boolean; // Turkish personal data law
}

export const dataClassifications: Record<string, DataClassification> = {
  // Public data - parts information
  part_title: {
    sensitivity: DataSensitivity.PUBLIC,
    retention: 2555, // 7 years for business records
    encryptionRequired: false,
    auditRequired: false,
    gdprApplicable: false,
    kvkkApplicable: false,
  },
  
  // Personal identifiers
  email_address: {
    sensitivity: DataSensitivity.CONFIDENTIAL,
    retention: 2555, // 7 years after account deletion request
    encryptionRequired: true,
    auditRequired: true,
    gdprApplicable: true,
    kvkkApplicable: true,
  },
  
  // Communication data
  private_messages: {
    sensitivity: DataSensitivity.RESTRICTED,
    retention: 1095, // 3 years for business communications
    encryptionRequired: true,
    auditRequired: true,
    gdprApplicable: true,
    kvkkApplicable: true,
  },
  
  // Authentication data
  password_hash: {
    sensitivity: DataSensitivity.RESTRICTED,
    retention: 0, // Delete immediately on account closure
    encryptionRequired: true,
    auditRequired: true,
    gdprApplicable: true,
    kvkkApplicable: true,
  },
};
```

**Privacy Controls Implementation:**
```sql
-- Privacy controls for Turkish/EU users
CREATE TABLE public.privacy_consents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    consent_type TEXT NOT NULL, -- 'gdpr', 'kvkk', 'marketing', 'analytics'
    consent_given BOOLEAN NOT NULL,
    consent_date TIMESTAMPTZ DEFAULT NOW(),
    withdrawn_date TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    
    -- Ensure current consent per type
    UNIQUE(user_id, consent_type) DEFERRABLE INITIALLY DEFERRED
);

-- Data retention policies
CREATE TABLE public.data_retention_policies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    data_type TEXT NOT NULL,
    retention_days INTEGER NOT NULL,
    deletion_method TEXT NOT NULL, -- 'soft_delete', 'hard_delete', 'anonymize'
    last_applied TIMESTAMPTZ DEFAULT NOW()
);

-- Privacy-focused RLS policies
CREATE POLICY "Users can only access own private data" ON public.user_profiles
    FOR SELECT USING (
        auth.uid() = id OR 
        public.user_has_permission(auth.uid(), 'users.moderate')
    );

-- Audit log for privacy compliance
CREATE TABLE public.privacy_audit_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    action TEXT NOT NULL, -- 'data_access', 'data_export', 'data_deletion'
    data_type TEXT NOT NULL,
    performed_by UUID REFERENCES public.user_profiles(id),
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    details JSONB
);

-- GDPR/KVKK data export function
CREATE OR REPLACE FUNCTION public.export_user_data(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_data JSONB;
    requestor_id UUID := auth.uid();
BEGIN
    -- Verify user can access this data
    IF requestor_id != target_user_id AND NOT public.user_has_permission(requestor_id, 'users.moderate') THEN
        RAISE EXCEPTION 'Unauthorized data access attempt';
    END IF;
    
    -- Export user data in structured format
    SELECT jsonb_build_object(
        'personal_information', jsonb_build_object(
            'email', email,
            'created_at', created_at,
            'profile_complete', profile_complete
        ),
        'parts_data', (
            SELECT jsonb_agg(jsonb_build_object(
                'title', title,
                'part_reference', part_reference,
                'condition', condition,
                'price', price,
                'created_at', created_at
            ))
            FROM public.parts 
            WHERE seller_id = target_user_id
        ),
        'conversations', (
            SELECT jsonb_agg(jsonb_build_object(
                'created_at', created_at,
                'status', status,
                'last_message_at', last_message_at
            ))
            FROM public.conversations 
            WHERE buyer_id = target_user_id OR seller_id = target_user_id
        ),
        'privacy_consents', (
            SELECT jsonb_agg(jsonb_build_object(
                'consent_type', consent_type,
                'consent_given', consent_given,
                'consent_date', consent_date
            ))
            FROM public.privacy_consents 
            WHERE user_id = target_user_id
        ),
        'export_metadata', jsonb_build_object(
            'exported_at', NOW(),
            'exported_by', requestor_id,
            'format_version', '1.0'
        )
    ) INTO user_data
    FROM public.user_profiles 
    WHERE id = target_user_id;
    
    -- Log the export
    INSERT INTO public.privacy_audit_log (user_id, action, data_type, performed_by, details)
    VALUES (target_user_id, 'data_export', 'full_user_data', requestor_id, 
           jsonb_build_object('export_size_kb', length(user_data::text) / 1024));
    
    RETURN user_data;
END;
$$;
```

### 5. Encryption and Data Security

**Encryption Standards:**
```typescript
// lib/security/encryption.ts - Encryption utilities for Turkish marketplace
import crypto from 'crypto';

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly tagLength = 16;

  constructor(private encryptionKey: string) {
    if (!encryptionKey || encryptionKey.length < 32) {
      throw new Error('Encryption key must be at least 32 characters');
    }
  }

  // Encrypt sensitive data (emails, phone numbers, personal messages)
  encryptSensitiveData(plaintext: string): EncryptedData {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, Buffer.from(this.encryptionKey), iv);
      
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        algorithm: this.algorithm,
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt sensitive data');
    }
  }

  // Decrypt sensitive data
  decryptSensitiveData(encryptedData: EncryptedData): string {
    try {
      const decipher = crypto.createDecipher(
        encryptedData.algorithm,
        Buffer.from(this.encryptionKey),
        Buffer.from(encryptedData.iv, 'hex')
      );
      
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt sensitive data');
    }
  }

  // Hash passwords using bcrypt (Supabase handles this, but for reference)
  async hashPassword(password: string): Promise<string> {
    const bcrypt = require('bcrypt');
    const saltRounds = 12; // Strong salt for Turkish marketplace
    return bcrypt.hash(password, saltRounds);
  }

  // Generate secure tokens for password reset, email verification
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // Turkish-specific data masking for logs
  maskTurkishData(data: string, type: 'email' | 'phone' | 'name'): string {
    switch (type) {
      case 'email':
        return data.replace(/(.{2}).*(@.*)/, '$1***$2');
      case 'phone':
        // Turkish phone format: +90 5XX XXX XX XX
        return data.replace(/(\+90\s5\d{2})\s(\d{3})\s(\d{2})\s(\d{2})/, '$1 *** ** **');
      case 'name':
        return data.replace(/^(\w{2}).*(\w{1})$/, '$1***$2');
      default:
        return '***';
    }
  }
}

interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
  algorithm: string;
}

// Environment-based encryption service initialization
export const getEncryptionService = (): EncryptionService => {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }
  return new EncryptionService(encryptionKey);
};
```

---

## Input Validation and Sanitization

### 6. Comprehensive Input Validation

**Turkish-Optimized Validation:**
```typescript
// lib/security/validation.ts - Input validation for Turkish marketplace
import { z } from 'zod';

// Turkish character support
const turkishCharacterRegex = /^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s\d\-_.,!?()]+$/;
const turkishPhoneRegex = /^(\+90|0)?[5][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/;

export const ValidationSchemas = {
  // User registration validation
  userRegistration: z.object({
    email: z
      .string()
      .email('Geçerli bir e-posta adresi giriniz')
      .max(254, 'E-posta adresi çok uzun')
      .toLowerCase()
      .refine((email) => !email.includes('+'), 'Plus işareti içeren e-postalar desteklenmiyor'),
    
    password: z
      .string()
      .min(8, 'Şifre en az 8 karakter olmalıdır')
      .max(128, 'Şifre çok uzun')
      .regex(/\d/, 'Şifre en az bir rakam içermelidir'),
    
    profile: z.object({
      name: z
        .string()
        .min(2, 'İsim en az 2 karakter olmalıdır')
        .max(50, 'İsim çok uzun')
        .regex(turkishCharacterRegex, 'Geçersiz karakterler'),
      
      phone: z
        .string()
        .regex(turkishPhoneRegex, 'Geçerli bir Türk telefon numarası giriniz')
        .optional(),
    }),
  }),

  // Part creation validation
  partCreation: z.object({
    title: z
      .string()
      .min(5, 'Başlık en az 5 karakter olmalıdır')
      .max(200, 'Başlık çok uzun')
      .regex(turkishCharacterRegex, 'Başlıkta geçersiz karakterler var'),
    
    part_reference: z
      .string()
      .min(3, 'Parça referansı en az 3 karakter olmalıdır')
      .max(50, 'Parça referansı çok uzun')
      .regex(/^[a-zA-Z0-9\-_]+$/, 'Parça referansı sadece harf, rakam, tire ve alt çizgi içerebilir'),
    
    condition: z
      .enum(['Kullanılabilir', 'Arızalı'], {
        errorMap: () => ({ message: 'Geçerli bir durum seçiniz' }),
      }),
    
    price: z
      .number()
      .min(1, 'Fiyat 1 TL den az olamaz')
      .max(999999.99, 'Fiyat çok yüksek')
      .multipleOf(0.01, 'Fiyat kuruş hassasiyetinde olmalıdır'),
    
    location_city: z
      .string()
      .min(2, 'Şehir adı en az 2 karakter olmalıdır')
      .max(50, 'Şehir adı çok uzun')
      .refine((city) => TURKISH_CITIES.includes(city), 'Geçerli bir Türk şehri seçiniz'),
    
    brand: z
      .string()
      .min(2, 'Marka adı en az 2 karakter olmalıdır')
      .max(50, 'Marka adı çok uzun'),
    
    model: z
      .string()
      .min(2, 'Model adı en az 2 karakter olmalıdır')
      .max(50, 'Model adı çok uzun'),
    
    year: z
      .number()
      .int('Yıl tam sayı olmalıdır')
      .min(1900, 'Yıl 1900 den küçük olamaz')
      .max(new Date().getFullYear() + 1, 'Yıl gelecek yıldan büyük olamaz'),
    
    description: z
      .string()
      .max(2000, 'Açıklama çok uzun')
      .regex(turkishCharacterRegex, 'Açıklamada geçersiz karakterler var')
      .optional(),
    
    images: z
      .array(z.string().url('Geçerli bir resim URL\'si olmalıdır'))
      .max(5, 'En fazla 5 resim yükleyebilirsiniz')
      .optional(),
  }),

  // Search filters validation
  searchFilters: z.object({
    query: z
      .string()
      .max(200, 'Arama terimi çok uzun')
      .regex(turkishCharacterRegex, 'Arama teriminde geçersiz karakterler var')
      .optional(),
    
    brand: z
      .string()
      .max(50, 'Marka adı çok uzun')
      .optional(),
    
    model: z
      .string()
      .max(50, 'Model adı çok uzun')
      .optional(),
    
    condition: z
      .enum(['Kullanılabilir', 'Arızalı'])
      .optional(),
    
    min_price: z
      .number()
      .min(0, 'Minimum fiyat 0 dan küçük olamaz')
      .optional(),
    
    max_price: z
      .number()
      .max(999999.99, 'Maximum fiyat çok yüksek')
      .optional(),
    
    city: z
      .string()
      .refine((city) => !city || TURKISH_CITIES.includes(city), 'Geçerli bir şehir seçiniz')
      .optional(),
    
    year_from: z
      .number()
      .int('Yıl tam sayı olmalıdır')
      .min(1900, 'Başlangıç yılı 1900 den küçük olamaz')
      .optional(),
    
    year_to: z
      .number()
      .int('Yıl tam sayı olmalıdır')
      .max(new Date().getFullYear() + 1, 'Bitiş yılı gelecek yıldan büyük olamaz')
      .optional(),
  }).refine((data) => {
    if (data.min_price && data.max_price) {
      return data.min_price <= data.max_price;
    }
    return true;
  }, {
    message: 'Minimum fiyat maximum fiyattan büyük olamaz',
    path: ['min_price'],
  }).refine((data) => {
    if (data.year_from && data.year_to) {
      return data.year_from <= data.year_to;
    }
    return true;
  }, {
    message: 'Başlangıç yılı bitiş yılından büyük olamaz',
    path: ['year_from'],
  }),

  // Message validation
  message: z.object({
    content: z
      .string()
      .min(1, 'Mesaj boş olamaz')
      .max(2000, 'Mesaj çok uzun')
      .regex(turkishCharacterRegex, 'Mesajda geçersiz karakterler var')
      .refine((content) => content.trim().length > 0, 'Mesaj sadece boşluk karakteri içeremez'),
    
    conversation_id: z
      .string()
      .uuid('Geçerli bir konuşma ID\'si olmalıdır'),
  }),
};

// Turkish cities list for validation
const TURKISH_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya',
  'Artvin', 'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu',
  'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır',
  'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun',
  'Gümüşhane', 'Hakkâri', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir',
  'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya',
  'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop',
  'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
  'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale',
  'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis',
  'Osmaniye', 'Düzce'
];

// Input sanitization functions
export class InputSanitizer {
  // Sanitize HTML content to prevent XSS
  static sanitizeHtml(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Sanitize SQL inputs (additional layer beyond parameterized queries)
  static sanitizeSql(input: string): string {
    return input
      .replace(/'/g, "''")
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');
  }

  // Remove potentially dangerous characters while preserving Turkish characters
  static sanitizeUserInput(input: string): string {
    return input
      .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim(); // Remove leading/trailing whitespace
  }

  // Validate and sanitize file uploads
  static validateImageUpload(file: File): ValidationResult {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    const maxSize = 2 * 1024 * 1024; // 2MB for Turkish mobile optimization
    const errors: string[] = [];

    if (!allowedTypes.includes(file.type)) {
      errors.push('Sadece JPEG, PNG, WebP ve AVIF formatları desteklenmektedir');
    }

    if (file.size > maxSize) {
      errors.push('Resim boyutu 2MB dan büyük olamaz');
    }

    if (file.name.length > 100) {
      errors.push('Dosya adı çok uzun');
    }

    // Check for potentially malicious file names
    const suspiciousPatterns = [/\.php$/, /\.exe$/, /\.js$/, /\.html?$/];
    if (suspiciousPatterns.some(pattern => pattern.test(file.name.toLowerCase()))) {
      errors.push('Güvenlik nedeniyle bu dosya türü desteklenmiyor');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
```

---

## API Security

### 7. API Rate Limiting and Protection

**Rate Limiting Implementation:**
```typescript
// lib/security/rate-limiting.ts - API protection for Turkish marketplace
import { LRUCache } from 'lru-cache';
import type { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: NextApiRequest) => string;
  onLimitReached?: (req: NextApiRequest, res: NextApiResponse) => void;
}

export class RateLimiter {
  private cache: LRUCache<string, number>;
  private options: Required<RateLimitOptions>;

  constructor(options: RateLimitOptions) {
    this.options = {
      skipSuccessfulRequests: false,
      keyGenerator: (req) => this.getClientIp(req),
      onLimitReached: this.defaultLimitHandler,
      ...options,
    };

    this.cache = new LRUCache({
      max: 10000, // Maximum number of IP addresses to track
      ttl: this.options.windowMs,
    });
  }

  // Rate limiting middleware
  middleware() {
    return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
      const key = this.options.keyGenerator(req);
      const current = this.cache.get(key) || 0;

      if (current >= this.options.maxRequests) {
        this.options.onLimitReached(req, res);
        return;
      }

      // Increment request count
      this.cache.set(key, current + 1);

      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', this.options.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.options.maxRequests - current - 1));
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + this.options.windowMs).toISOString());

      next();
    };
  }

  private getClientIp(req: NextApiRequest): string {
    // Handle various proxy headers for Turkish hosting providers
    const forwarded = req.headers['x-forwarded-for'] as string;
    const real = req.headers['x-real-ip'] as string;
    const cloudflare = req.headers['cf-connecting-ip'] as string;
    
    return (
      cloudflare ||
      real ||
      (forwarded && forwarded.split(',')[0].trim()) ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }

  private defaultLimitHandler = (req: NextApiRequest, res: NextApiResponse) => {
    res.status(429).json({
      error: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyiniz.', // "Too many requests" in Turkish
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(this.options.windowMs / 1000),
    });
  };
}

// Predefined rate limiters for different endpoints
export const rateLimiters = {
  // General API endpoints
  general: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
  }),

  // Search endpoint (higher limit for core functionality)
  search: new RateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes  
    maxRequests: 50, // 50 searches per 5 minutes
  }),

  // Authentication endpoints (stricter limits)
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 login attempts per 15 minutes
    onLimitReached: (req, res) => {
      // Log potential brute force attack
      console.warn(`Potential brute force attack from ${req.socket.remoteAddress}`);
      res.status(429).json({
        error: 'Çok fazla giriş denemesi. Hesap güvenliği için 15 dakika bekleyiniz.',
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        retryAfter: 900, // 15 minutes
      });
    },
  }),

  // Part creation (prevent spam)
  partCreation: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 parts per hour
    keyGenerator: (req) => {
      // Use user ID for authenticated endpoints
      const token = req.headers.authorization?.replace('Bearer ', '');
      return token || req.socket.remoteAddress || 'unknown';
    },
  }),

  // Interest expression (prevent spam)
  expressInterest: new RateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 20, // 20 interests per 5 minutes
    keyGenerator: (req) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      return token || req.socket.remoteAddress || 'unknown';
    },
  }),

  // File upload (prevent abuse)
  fileUpload: new RateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 20, // 20 uploads per 10 minutes
  }),
};
```

### 8. SQL Injection Prevention

**Parameterized Query Patterns:**
```typescript
// lib/security/query-security.ts - Secure database queries
import { SupabaseClient } from '@supabase/supabase-js';

export class SecureQueryBuilder {
  constructor(private supabase: SupabaseClient) {}

  // Secure parts search with Turkish text optimization
  async searchPartsSecure(filters: SearchFilters): Promise<Part[]> {
    let query = this.supabase
      .from('parts')
      .select(`
        id,
        title,
        part_reference,
        condition,
        price,
        location_city,
        brand,
        model,
        year,
        description,
        images,
        created_at,
        user_profiles!inner(email)
      `)
      .eq('status', 'active');

    // Secure text search using PostgreSQL functions
    if (filters.query?.trim()) {
      const searchTerm = this.sanitizeSearchTerm(filters.query.trim());
      query = query.rpc('search_parts_turkish', { 
        search_query: searchTerm,
        limit_count: filters.limit || 20,
        offset_count: filters.offset || 0
      });
    }

    // Secure numeric filters with validation
    if (filters.min_price !== undefined) {
      if (typeof filters.min_price !== 'number' || filters.min_price < 0) {
        throw new Error('Invalid minimum price');
      }
      query = query.gte('price', filters.min_price);
    }

    if (filters.max_price !== undefined) {
      if (typeof filters.max_price !== 'number' || filters.max_price > 999999.99) {
        throw new Error('Invalid maximum price');
      }
      query = query.lte('price', filters.max_price);
    }

    // Secure string filters with validation
    if (filters.brand?.trim()) {
      const brand = this.sanitizeStringInput(filters.brand.trim());
      query = query.ilike('brand', `%${brand}%`);
    }

    if (filters.model?.trim()) {
      const model = this.sanitizeStringInput(filters.model.trim());
      query = query.ilike('model', `%${model}%`);
    }

    if (filters.condition && ['Kullanılabilir', 'Arızalı'].includes(filters.condition)) {
      query = query.eq('condition', filters.condition);
    }

    if (filters.city?.trim()) {
      const city = this.sanitizeStringInput(filters.city.trim());
      if (!TURKISH_CITIES.includes(city)) {
        throw new Error('Invalid city');
      }
      query = query.eq('location_city', city);
    }

    // Secure numeric range filters
    if (filters.year_from !== undefined) {
      if (typeof filters.year_from !== 'number' || filters.year_from < 1900) {
        throw new Error('Invalid year range start');
      }
      query = query.gte('year', filters.year_from);
    }

    if (filters.year_to !== undefined) {
      if (typeof filters.year_to !== 'number' || filters.year_to > new Date().getFullYear() + 1) {
        throw new Error('Invalid year range end');
      }
      query = query.lte('year', filters.year_to);
    }

    // Execute query with error handling
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Secure search query error:', error);
      throw new Error('Arama sırasında bir hata oluştu'); // "Error occurred during search" in Turkish
    }

    return data || [];
  }

  // Secure part creation
  async createPartSecure(partData: CreatePartRequest, sellerId: string): Promise<Part> {
    // Validate all inputs
    const validatedData = this.validatePartData(partData);
    
    const { data, error } = await this.supabase
      .from('parts')
      .insert([{
        seller_id: sellerId,
        title: validatedData.title,
        part_reference: validatedData.part_reference,
        condition: validatedData.condition,
        price: validatedData.price,
        location_city: validatedData.location_city,
        brand: validatedData.brand,
        model: validatedData.model,
        year: validatedData.year,
        description: validatedData.description || null,
        images: validatedData.images || [],
        status: 'active',
      }])
      .select()
      .single();

    if (error) {
      console.error('Secure part creation error:', error);
      throw new Error('Parça kaydedilemedi'); // "Part could not be saved" in Turkish
    }

    return data;
  }

  // Secure interest expression with business logic validation
  async expressInterestSecure(partId: string, userId: string, type: 'interested' | 'not_interested'): Promise<Interest> {
    // Validate UUID format
    if (!this.isValidUUID(partId) || !this.isValidUUID(userId)) {
      throw new Error('Invalid ID format');
    }

    // Check if part exists and is active
    const { data: part, error: partError } = await this.supabase
      .from('parts')
      .select('id, seller_id, status')
      .eq('id', partId)
      .single();

    if (partError || !part || part.status !== 'active') {
      throw new Error('Parça bulunamadı veya artık mevcut değil'); // "Part not found or no longer available"
    }

    // Prevent self-interest
    if (part.seller_id === userId) {
      throw new Error('Kendi parçanıza ilgi belirtemezsiniz'); // "Cannot express interest in your own part"
    }

    // Check existing interest
    const { data: existingInterest } = await this.supabase
      .from('interests')
      .select('id, type')
      .eq('user_id', userId)
      .eq('part_id', partId)
      .single();

    let result;
    if (existingInterest) {
      // Update existing interest
      const { data, error } = await this.supabase
        .from('interests')
        .update({ type, updated_at: new Date().toISOString() })
        .eq('id', existingInterest.id)
        .select()
        .single();

      if (error) throw new Error('İlgi güncellenemedi'); // "Interest could not be updated"
      result = data;
    } else {
      // Create new interest
      const { data, error } = await this.supabase
        .from('interests')
        .insert([{
          user_id: userId,
          part_id: partId,
          type: type,
        }])
        .select()
        .single();

      if (error) throw new Error('İlgi kaydedilemedi'); // "Interest could not be saved"
      result = data;
    }

    return result;
  }

  // Input sanitization methods
  private sanitizeSearchTerm(term: string): string {
    return term
      .replace(/[<>\"';\\]/g, '') // Remove potentially dangerous characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 200); // Limit length
  }

  private sanitizeStringInput(input: string): string {
    return input
      .replace(/[<>\"';\\]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 100);
  }

  private validatePartData(data: CreatePartRequest): CreatePartRequest {
    // Use Zod schema validation
    const result = ValidationSchemas.partCreation.safeParse(data);
    if (!result.success) {
      throw new Error(`Validation error: ${result.error.errors.map(e => e.message).join(', ')}`);
    }
    return result.data;
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
```

---

## Security Monitoring and Incident Response

### 9. Security Monitoring

**Security Event Logging:**
```typescript
// lib/security/monitoring.ts - Security monitoring for Turkish marketplace
import * as Sentry from '@sentry/nextjs';

export enum SecurityEventType {
  AUTHENTICATION_FAILURE = 'auth_failure',
  BRUTE_FORCE_ATTEMPT = 'brute_force',
  SUSPICIOUS_REQUEST = 'suspicious_request',
  DATA_ACCESS_VIOLATION = 'data_access_violation',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  XSS_ATTEMPT = 'xss_attempt',
  SQL_INJECTION_ATTEMPT = 'sql_injection_attempt',
  UNAUTHORIZED_API_ACCESS = 'unauthorized_api_access',
  MASS_DATA_EXPORT = 'mass_data_export',
  SUSPICIOUS_FILE_UPLOAD = 'suspicious_file_upload',
}

export interface SecurityEvent {
  type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ip: string;
  userAgent: string;
  endpoint?: string;
  details: Record<string, unknown>;
  timestamp: Date;
}

export class SecurityMonitor {
  // Log security events
  static logSecurityEvent(event: SecurityEvent): void {
    try {
      // Log to console for development
      console.warn('Security Event:', {
        type: event.type,
        severity: event.severity,
        ip: this.maskIpAddress(event.ip),
        timestamp: event.timestamp.toISOString(),
        details: event.details,
      });

      // Send to Sentry for production monitoring
      if (process.env.NODE_ENV === 'production') {
        Sentry.addBreadcrumb({
          message: `Security event: ${event.type}`,
          category: 'security',
          level: event.severity as any,
          data: {
            ip: this.maskIpAddress(event.ip),
            endpoint: event.endpoint,
            userId: event.userId,
          },
        });

        if (event.severity === 'high' || event.severity === 'critical') {
          Sentry.captureException(new Error(`Security Alert: ${event.type}`));
        }
      }

      // Store in database for analysis
      this.storeSecurityEvent(event);

      // Trigger real-time alerts for critical events
      if (event.severity === 'critical') {
        this.triggerCriticalAlert(event);
      }

    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Detect suspicious patterns
  static detectSuspiciousPatterns(req: NextApiRequest): SecurityEvent[] {
    const events: SecurityEvent[] = [];
    const ip = this.getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    const url = req.url || 'unknown';
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});

    // SQL Injection patterns
    const sqlPatterns = [
      /union\s+select/i,
      /drop\s+table/i,
      /insert\s+into/i,
      /delete\s+from/i,
      /update\s+.*set/i,
      /exec\s*\(/i,
      /script\s*>/i,
    ];

    const sqlDetected = sqlPatterns.some(pattern => 
      pattern.test(url) || pattern.test(body)
    );

    if (sqlDetected) {
      events.push({
        type: SecurityEventType.SQL_INJECTION_ATTEMPT,
        severity: 'high',
        ip,
        userAgent,
        endpoint: url,
        details: { requestBody: body.substring(0, 500) },
        timestamp: new Date(),
      });
    }

    // XSS patterns
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /eval\s*\(/i,
    ];

    const xssDetected = xssPatterns.some(pattern => 
      pattern.test(url) || pattern.test(body)
    );

    if (xssDetected) {
      events.push({
        type: SecurityEventType.XSS_ATTEMPT,
        severity: 'high',
        ip,
        userAgent,
        endpoint: url,
        details: { requestBody: body.substring(0, 500) },
        timestamp: new Date(),
      });
    }

    // Suspicious user agents
    const suspiciousAgents = [
      /sqlmap/i,
      /burp/i,
      /nikto/i,
      /nessus/i,
      /openvas/i,
      /nmap/i,
    ];

    const suspiciousAgent = suspiciousAgents.some(pattern => 
      pattern.test(userAgent)
    );

    if (suspiciousAgent) {
      events.push({
        type: SecurityEventType.SUSPICIOUS_REQUEST,
        severity: 'medium',
        ip,
        userAgent,
        endpoint: url,
        details: { reason: 'suspicious_user_agent' },
        timestamp: new Date(),
      });
    }

    return events;
  }

  // Monitor authentication failures
  static monitorAuthFailures(userId: string, ip: string, userAgent: string): void {
    this.logSecurityEvent({
      type: SecurityEventType.AUTHENTICATION_FAILURE,
      severity: 'medium',
      userId,
      ip,
      userAgent,
      details: { reason: 'invalid_credentials' },
      timestamp: new Date(),
    });

    // Check for brute force patterns
    this.checkBruteForceAttempt(ip);
  }

  // Check for brute force attacks
  private static async checkBruteForceAttempt(ip: string): Promise<void> {
    // This would typically query a database or cache
    // For demo purposes, we'll simulate the check
    const recentFailures = await this.getRecentAuthFailures(ip, 15 * 60 * 1000); // 15 minutes

    if (recentFailures >= 5) {
      this.logSecurityEvent({
        type: SecurityEventType.BRUTE_FORCE_ATTEMPT,
        severity: 'high',
        ip,
        userAgent: 'unknown',
        details: { 
          failureCount: recentFailures,
          timeWindow: '15 minutes' 
        },
        timestamp: new Date(),
      });

      // Trigger IP blocking (implement based on infrastructure)
      this.blockSuspiciousIp(ip);
    }
  }

  // Store security events in database
  private static async storeSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // This would store in your security events table
      // Implementation depends on your database setup
      console.log('Storing security event:', event.type);
    } catch (error) {
      console.error('Failed to store security event:', error);
    }
  }

  // Trigger critical security alerts
  private static triggerCriticalAlert(event: SecurityEvent): void {
    // Send immediate notifications for critical security events
    console.error('CRITICAL SECURITY ALERT:', event);
    
    // In production, this would:
    // - Send notifications to security team
    // - Update status dashboard
    // - Potentially auto-block suspicious IPs
    // - Trigger incident response procedures
  }

  // Helper methods
  private static maskIpAddress(ip: string): string {
    return ip.replace(/\.\d+$/, '.xxx');
  }

  private static getClientIp(req: NextApiRequest): string {
    const forwarded = req.headers['x-forwarded-for'] as string;
    const real = req.headers['x-real-ip'] as string;
    const cloudflare = req.headers['cf-connecting-ip'] as string;
    
    return (
      cloudflare ||
      real ||
      (forwarded && forwarded.split(',')[0].trim()) ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }

  private static async getRecentAuthFailures(ip: string, timeWindowMs: number): Promise<number> {
    // Mock implementation - replace with actual database query
    return Math.floor(Math.random() * 10);
  }

  private static blockSuspiciousIp(ip: string): void {
    console.warn(`Blocking suspicious IP: ${this.maskIpAddress(ip)}`);
    // Implement IP blocking based on your infrastructure
    // This could integrate with Cloudflare, AWS WAF, etc.
  }
}

// Security middleware for API routes
export const withSecurityMonitoring = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Detect and log suspicious patterns
      const suspiciousEvents = SecurityMonitor.detectSuspiciousPatterns(req);
      suspiciousEvents.forEach(event => SecurityMonitor.logSecurityEvent(event));

      // Block obviously malicious requests
      if (suspiciousEvents.some(event => event.severity === 'high' || event.severity === 'critical')) {
        return res.status(403).json({
          error: 'Şüpheli etkinlik tespit edildi', // "Suspicious activity detected" in Turkish
          code: 'SECURITY_VIOLATION',
        });
      }

      // Proceed with request
      await handler(req, res);

    } catch (error) {
      // Log security-related errors
      SecurityMonitor.logSecurityEvent({
        type: SecurityEventType.SUSPICIOUS_REQUEST,
        severity: 'medium',
        ip: SecurityMonitor['getClientIp'](req),
        userAgent: req.headers['user-agent'] || 'unknown',
        endpoint: req.url || 'unknown',
        details: { error: error instanceof Error ? error.message : 'unknown error' },
        timestamp: new Date(),
      });

      throw error;
    }
  };
};
```

### 10. Incident Response Plan

**Security Incident Response Framework:**
```typescript
// lib/security/incident-response.ts - Security incident handling
export enum IncidentSeverity {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IncidentStatus {
  DETECTED = 'detected',
  INVESTIGATING = 'investigating',
  CONTAINING = 'containing',
  RESOLVED = 'resolved',
  POST_MORTEM = 'post_mortem',
}

export interface SecurityIncident {
  id: string;
  type: SecurityEventType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  affectedUsers: string[];
  affectedSystems: string[];
  detectedAt: Date;
  resolvedAt?: Date;
  responseActions: ResponseAction[];
  postMortem?: PostMortemReport;
}

export interface ResponseAction {
  action: string;
  performedBy: string;
  performedAt: Date;
  result: string;
  effective: boolean;
}

export class IncidentResponseManager {
  // Incident response procedures
  static readonly RESPONSE_PROCEDURES = {
    [IncidentSeverity.CRITICAL]: {
      responseTime: 15, // minutes
      escalationLevel: 'immediate',
      actions: [
        'Notify security team immediately',
        'Assess scope and impact',
        'Implement containment measures',
        'Notify affected users (Turkish)',
        'Document all actions',
        'Conduct post-mortem review',
      ],
    },
    [IncidentSeverity.HIGH]: {
      responseTime: 60, // minutes
      escalationLevel: 'urgent',
      actions: [
        'Notify security team',
        'Investigate incident scope',
        'Implement fixes',
        'Monitor for recurrence',
        'Update security measures',
      ],
    },
    [IncidentSeverity.MEDIUM]: {
      responseTime: 240, // minutes (4 hours)
      escalationLevel: 'normal',
      actions: [
        'Log incident details',
        'Investigate root cause',
        'Apply patches/fixes',
        'Update monitoring rules',
      ],
    },
    [IncidentSeverity.LOW]: {
      responseTime: 1440, // minutes (24 hours)
      escalationLevel: 'low',
      actions: [
        'Document incident',
        'Review in next security meeting',
        'Consider preventive measures',
      ],
    },
  };

  // Turkish communication templates for incident response
  static readonly COMMUNICATION_TEMPLATES = {
    userNotification: {
      dataBreachDetected: `
Değerli BanaYeni SanaEski kullanıcısı,

Sistemimizde güvenlik açısından şüpheli bir aktivite tespit ettik. Güvenliğinizi sağlamak için aşağıdaki önlemleri aldık:

• Hesabınız geçici olarak güvence altına alındı
• Şifrenizi değiştirmenizi öneriyoriz
• Şüpheli aktivite tespit edilirse derhal bilgilendireceğiz

Güvenliğiniz bizim önceliğimizdir.

BanaYeni SanaEski Güvenlik Ekibi
      `,
      
      systemMaintenance: `
Değerli kullanıcılarımız,

Sistemimizin güvenliğini artırmak için planlı bakım yapıyoruz.

• Bakım süresi: [DURATION]
• Etkilenen özellikler: [FEATURES]
• Tahmini bitiş: [END_TIME]

Yaşanan rahatsızlık için özür dileriz.
      `,
    },

    internalAlert: {
      criticalIncident: `
CRITICAL SECURITY INCIDENT - BanaYeni SanaEski

Incident ID: [INCIDENT_ID]
Detected: [TIMESTAMP]
Severity: CRITICAL
Type: [INCIDENT_TYPE]

Immediate actions required:
1. Assess impact scope
2. Implement containment
3. Notify stakeholders
4. Begin investigation

Incident Commander: [COMMANDER]
War Room: [LOCATION/LINK]
      `,
    },
  };

  // Create and track security incident
  static async createIncident(
    type: SecurityEventType,
    severity: IncidentSeverity,
    description: string,
    initialContext: Record<string, unknown>
  ): Promise<SecurityIncident> {
    const incident: SecurityIncident = {
      id: this.generateIncidentId(),
      type,
      severity,
      status: IncidentStatus.DETECTED,
      description,
      affectedUsers: [],
      affectedSystems: [],
      detectedAt: new Date(),
      responseActions: [],
    };

    // Immediate response actions based on severity
    await this.initiateResponse(incident);

    // Store incident for tracking
    await this.storeIncident(incident);

    return incident;
  }

  // Initiate incident response procedures
  private static async initiateResponse(incident: SecurityIncident): Promise<void> {
    const procedures = this.RESPONSE_PROCEDURES[incident.severity];
    
    // Log initial response
    console.warn(`Security incident ${incident.id} detected - Severity: ${incident.severity}`);

    // Execute immediate containment measures
    switch (incident.severity) {
      case IncidentSeverity.CRITICAL:
        await this.executeCriticalResponse(incident);
        break;
      case IncidentSeverity.HIGH:
        await this.executeHighResponse(incident);
        break;
      case IncidentSeverity.MEDIUM:
        await this.executeMediumResponse(incident);
        break;
      case IncidentSeverity.LOW:
        await this.executeLowResponse(incident);
        break;
    }
  }

  // Critical incident response (immediate containment)
  private static async executeCriticalResponse(incident: SecurityIncident): Promise<void> {
    // Immediate notifications
    this.sendCriticalAlert(incident);

    // Potential system isolation
    if (incident.type === SecurityEventType.DATA_ACCESS_VIOLATION) {
      await this.isolateAffectedSystems(incident);
    }

    // User notifications in Turkish
    if (incident.affectedUsers.length > 0) {
      await this.notifyAffectedUsers(incident);
    }
  }

  // High severity incident response
  private static async executeHighResponse(incident: SecurityIncident): Promise<void> {
    // Enhanced monitoring
    await this.enableEnhancedMonitoring(incident);

    // Security team notification
    this.notifySecurityTeam(incident);
  }

  // Medium severity incident response  
  private static async executeMediumResponse(incident: SecurityIncident): Promise<void> {
    // Standard logging and monitoring
    this.logIncidentDetails(incident);
  }

  // Low severity incident response
  private static async executeLowResponse(incident: SecurityIncident): Promise<void> {
    // Documentation for review
    this.documentForReview(incident);
  }

  // Helper methods
  private static generateIncidentId(): string {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').substring(0, 15);
    const random = Math.random().toString(36).substring(2, 8);
    return `SEC-${timestamp}-${random.toUpperCase()}`;
  }

  private static async storeIncident(incident: SecurityIncident): Promise<void> {
    // Store in security incidents database/system
    console.log(`Storing incident ${incident.id}`);
  }

  private static sendCriticalAlert(incident: SecurityIncident): void {
    console.error('CRITICAL SECURITY ALERT:', incident.id);
    // In production: send to security team, management, on-call systems
  }

  private static async isolateAffectedSystems(incident: SecurityIncident): Promise<void> {
    console.warn(`Isolating systems for incident ${incident.id}`);
    // Implement system isolation procedures
  }

  private static async notifyAffectedUsers(incident: SecurityIncident): Promise<void> {
    console.log(`Notifying ${incident.affectedUsers.length} affected users`);
    // Send Turkish notifications to affected users
  }

  private static async enableEnhancedMonitoring(incident: SecurityIncident): Promise<void> {
    console.log(`Enabling enhanced monitoring for incident ${incident.id}`);
    // Increase monitoring sensitivity and logging
  }

  private static notifySecurityTeam(incident: SecurityIncident): void {
    console.warn(`Notifying security team about incident ${incident.id}`);
    // Send notifications to security team
  }

  private static logIncidentDetails(incident: SecurityIncident): void {
    console.log(`Logging details for incident ${incident.id}`);
    // Detailed logging for investigation
  }

  private static documentForReview(incident: SecurityIncident): void {
    console.log(`Documenting incident ${incident.id} for review`);
    // Add to review queue
  }
}
```

---

## Compliance and Regulatory Requirements

### 11. GDPR/KVKK Compliance Framework

**Data Protection Compliance:**
```sql
-- GDPR/KVKK compliance tables
CREATE TABLE public.data_processing_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    activity_name TEXT NOT NULL,
    purpose TEXT NOT NULL,
    data_categories TEXT[] NOT NULL, -- Personal data categories processed
    legal_basis TEXT NOT NULL, -- Legal basis for processing (GDPR Art. 6)
    retention_period INTEGER NOT NULL, -- Days
    recipients TEXT[], -- Who receives the data
    third_country_transfers BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data subject rights requests (GDPR/KVKK)
CREATE TABLE public.data_rights_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    request_type TEXT NOT NULL CHECK (request_type IN (
        'access', 'rectification', 'erasure', 'portability', 
        'restriction', 'objection', 'withdraw_consent'
    )),
    status TEXT DEFAULT 'submitted' CHECK (status IN (
        'submitted', 'under_review', 'approved', 'rejected', 'completed'
    )),
    reason TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    processed_by UUID REFERENCES public.user_profiles(id),
    response_data JSONB,
    notes TEXT
);

-- Consent management for Turkish users
CREATE TABLE public.consent_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    consent_category TEXT NOT NULL, -- 'necessary', 'functional', 'analytics', 'marketing'
    consent_given BOOLEAN NOT NULL,
    consent_method TEXT NOT NULL, -- 'explicit', 'opt_in', 'pre_checked', 'inferred'
    legal_basis TEXT NOT NULL,
    purpose_description TEXT NOT NULL,
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    withdrawn_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    
    -- Turkish specific requirements
    kvkk_compliant BOOLEAN DEFAULT TRUE,
    explicit_consent BOOLEAN DEFAULT FALSE,
    
    UNIQUE(user_id, consent_category, collected_at)
);

-- Data retention automation
CREATE TABLE public.data_retention_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    table_name TEXT NOT NULL,
    retention_days INTEGER NOT NULL,
    deletion_method TEXT NOT NULL CHECK (deletion_method IN ('soft_delete', 'hard_delete', 'anonymize')),
    last_run TIMESTAMPTZ,
    next_run TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

-- Insert default retention rules for Turkish marketplace
INSERT INTO public.data_retention_rules (table_name, retention_days, deletion_method) VALUES
('user_profiles', 2555, 'anonymize'), -- 7 years after account deletion
('parts', 2555, 'soft_delete'), -- 7 years business records
('conversations', 1095, 'hard_delete'), -- 3 years communications
('messages', 1095, 'hard_delete'), -- 3 years communications
('privacy_audit_log', 2555, 'hard_delete'), -- 7 years audit trail
('consent_records', 2555, 'hard_delete'), -- 7 years consent proof
('data_rights_requests', 2555, 'hard_delete'); -- 7 years request records

-- Automated data retention function
CREATE OR REPLACE FUNCTION public.process_data_retention()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    rule RECORD;
    deleted_count INTEGER;
BEGIN
    FOR rule IN SELECT * FROM public.data_retention_rules WHERE is_active = TRUE AND next_run <= NOW() LOOP
        CASE rule.deletion_method
            WHEN 'soft_delete' THEN
                EXECUTE format('UPDATE %I SET status = ''deleted'', deleted_at = NOW() WHERE created_at <= NOW() - INTERVAL ''%s days''', 
                              rule.table_name, rule.retention_days);
                GET DIAGNOSTICS deleted_count = ROW_COUNT;
                
            WHEN 'hard_delete' THEN
                EXECUTE format('DELETE FROM %I WHERE created_at <= NOW() - INTERVAL ''%s days''', 
                              rule.table_name, rule.retention_days);
                GET DIAGNOSTICS deleted_count = ROW_COUNT;
                
            WHEN 'anonymize' THEN
                -- Anonymize user data instead of deletion
                IF rule.table_name = 'user_profiles' THEN
                    UPDATE public.user_profiles 
                    SET email = 'anonymized_' || id || '@example.com',
                        profile_complete = FALSE
                    WHERE created_at <= NOW() - INTERVAL '2555 days'
                      AND status = 'deleted';
                    GET DIAGNOSTICS deleted_count = ROW_COUNT;
                END IF;
        END CASE;
        
        -- Log retention processing
        INSERT INTO public.privacy_audit_log (action, data_type, details)
        VALUES ('data_retention', rule.table_name, jsonb_build_object(
            'retention_rule_id', rule.id,
            'records_processed', deleted_count,
            'deletion_method', rule.deletion_method
        ));
        
        -- Update next run time (monthly)
        UPDATE public.data_retention_rules 
        SET last_run = NOW(), 
            next_run = NOW() + INTERVAL '30 days' 
        WHERE id = rule.id;
    END LOOP;
END;
$$;

-- Data portability function (GDPR Article 20)
CREATE OR REPLACE FUNCTION public.export_user_data_portable(user_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    export_data JSONB;
BEGIN
    -- Verify user authorization (must be own data or admin)
    IF auth.uid() != user_id_param AND NOT public.user_has_permission(auth.uid(), 'users.moderate') THEN
        RAISE EXCEPTION 'Unauthorized data export request';
    END IF;
    
    -- Create portable data export
    SELECT jsonb_build_object(
        'export_metadata', jsonb_build_object(
            'user_id', user_id_param,
            'export_date', NOW(),
            'format', 'JSON',
            'version', '1.0',
            'gdpr_compliant', TRUE,
            'kvkk_compliant', TRUE
        ),
        'personal_data', jsonb_build_object(
            'profile', (
                SELECT to_jsonb(u) - 'id' 
                FROM public.user_profiles u 
                WHERE u.id = user_id_param
            ),
            'consent_records', (
                SELECT jsonb_agg(to_jsonb(c) - 'user_id') 
                FROM public.consent_records c 
                WHERE c.user_id = user_id_param
            )
        ),
        'marketplace_data', jsonb_build_object(
            'parts', (
                SELECT jsonb_agg(to_jsonb(p) - 'seller_id') 
                FROM public.parts p 
                WHERE p.seller_id = user_id_param
            ),
            'interests', (
                SELECT jsonb_agg(to_jsonb(i) - 'user_id') 
                FROM public.interests i 
                WHERE i.user_id = user_id_param
            ),
            'conversations', (
                SELECT jsonb_agg(jsonb_build_object(
                    'conversation_id', c.id,
                    'created_at', c.created_at,
                    'status', c.status,
                    'role', CASE WHEN c.buyer_id = user_id_param THEN 'buyer' ELSE 'seller' END
                ))
                FROM public.conversations c 
                WHERE c.buyer_id = user_id_param OR c.seller_id = user_id_param
            )
        )
    ) INTO export_data;
    
    -- Log the export for audit
    INSERT INTO public.privacy_audit_log (user_id, action, data_type, performed_by, details)
    VALUES (user_id_param, 'data_export', 'portable_format', auth.uid(),
           jsonb_build_object('export_size_bytes', length(export_data::text)));
    
    RETURN export_data;
END;
$$;
```

---

## Security Testing and Validation

### 12. Security Testing Framework

**Automated Security Testing:**
```typescript
// lib/security/__tests__/security-validation.test.ts
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { InputSanitizer, ValidationSchemas } from '../validation';
import { RateLimiter } from '../rate-limiting';
import { SecurityMonitor, SecurityEventType } from '../monitoring';
import { EncryptionService } from '../encryption';

describe('Security Validation Tests', () => {
  describe('Input Validation', () => {
    it('should reject SQL injection attempts', () => {
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "admin'/*",
        "'; EXEC xp_cmdshell('format c:'); --"
      ];

      maliciousInputs.forEach(input => {
        const result = ValidationSchemas.searchFilters.safeParse({ query: input });
        expect(result.success).toBe(false);
      });
    });

    it('should accept valid Turkish text input', () => {
      const validInputs = [
        "BMW E46 alternatör",
        "Mercedes motor yağı",
        "Volkswagen fren diski çelik",
        "Renault Clio çamurluk"
      ];

      validInputs.forEach(input => {
        const result = ValidationSchemas.searchFilters.safeParse({ query: input });
        expect(result.success).toBe(true);
      });
    });

    it('should sanitize HTML to prevent XSS', () => {
      const maliciousHtml = '<script>alert("XSS")</script><img src="x" onerror="alert(1)">';
      const sanitized = InputSanitizer.sanitizeHtml(maliciousHtml);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('onerror');
      expect(sanitized).toContain('&lt;script&gt;');
    });

    it('should validate Turkish phone numbers correctly', () => {
      const validPhones = ['+90 555 123 45 67', '0555 123 45 67', '05551234567'];
      const invalidPhones = ['123456789', '+1 555 123 4567', '0123 456 78 90'];

      const phoneValidation = ValidationSchemas.userRegistration.shape.profile.shape.phone;
      
      validPhones.forEach(phone => {
        const result = phoneValidation.safeParse(phone);
        expect(result.success).toBe(true);
      });

      invalidPhones.forEach(phone => {
        const result = phoneValidation.safeParse(phone);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Rate Limiting', () => {
    let rateLimiter: RateLimiter;

    beforeEach(() => {
      rateLimiter = new RateLimiter({
        windowMs: 60000, // 1 minute
        maxRequests: 5,
      });
    });

    it('should allow requests within rate limit', async () => {
      const mockReq = { socket: { remoteAddress: '192.168.1.1' } } as any;
      const mockRes = { setHeader: jest.fn() } as any;
      let nextCalled = false;

      const middleware = rateLimiter.middleware();
      
      // Should allow first 5 requests
      for (let i = 0; i < 5; i++) {
        await middleware(mockReq, mockRes, () => { nextCalled = true; });
        expect(nextCalled).toBe(true);
        nextCalled = false;
      }
    });

    it('should block requests exceeding rate limit', async () => {
      const mockReq = { socket: { remoteAddress: '192.168.1.2' } } as any;
      const mockRes = { 
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn()
      } as any;

      const middleware = rateLimiter.middleware();
      
      // Exhaust rate limit
      for (let i = 0; i < 5; i++) {
        await middleware(mockReq, mockRes, () => {});
      }
      
      // Next request should be blocked
      await middleware(mockReq, mockRes, () => {});
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'RATE_LIMIT_EXCEEDED'
        })
      );
    });
  });

  describe('Security Monitoring', () => {
    it('should detect SQL injection patterns', () => {
      const maliciousReq = {
        url: '/api/search?q=\' UNION SELECT * FROM users--',
        body: '',
        headers: { 'user-agent': 'Mozilla/5.0' },
        socket: { remoteAddress: '192.168.1.3' }
      } as any;

      const events = SecurityMonitor.detectSuspiciousPatterns(maliciousReq);
      
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe(SecurityEventType.SQL_INJECTION_ATTEMPT);
      expect(events[0].severity).toBe('high');
    });

    it('should detect XSS attempts', () => {
      const maliciousReq = {
        url: '/api/parts',
        body: JSON.stringify({ title: '<script>alert("XSS")</script>' }),
        headers: { 'user-agent': 'Mozilla/5.0' },
        socket: { remoteAddress: '192.168.1.4' }
      } as any;

      const events = SecurityMonitor.detectSuspiciousPatterns(maliciousReq);
      
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe(SecurityEventType.XSS_ATTEMPT);
      expect(events[0].severity).toBe('high');
    });

    it('should detect suspicious user agents', () => {
      const suspiciousReq = {
        url: '/api/search',
        body: '',
        headers: { 'user-agent': 'sqlmap/1.0' },
        socket: { remoteAddress: '192.168.1.5' }
      } as any;

      const events = SecurityMonitor.detectSuspiciousPatterns(suspiciousReq);
      
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe(SecurityEventType.SUSPICIOUS_REQUEST);
      expect(events[0].severity).toBe('medium');
    });
  });

  describe('Encryption', () => {
    let encryptionService: EncryptionService;

    beforeEach(() => {
      encryptionService = new EncryptionService('test-encryption-key-32-characters-long');
    });

    it('should encrypt and decrypt sensitive data correctly', () => {
      const originalData = 'test-email@example.com';
      
      const encrypted = encryptionService.encryptSensitiveData(originalData);
      expect(encrypted.encrypted).toBeDefined();
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.authTag).toBeDefined();
      
      const decrypted = encryptionService.decryptSensitiveData(encrypted);
      expect(decrypted).toBe(originalData);
    });

    it('should mask Turkish data correctly', () => {
      const email = 'test@example.com';
      const phone = '+90 555 123 45 67';
      const name = 'Mehmet';

      expect(encryptionService.maskTurkishData(email, 'email')).toBe('te***@example.com');
      expect(encryptionService.maskTurkishData(phone, 'phone')).toBe('+90 555 *** ** **');
      expect(encryptionService.maskTurkishData(name, 'name')).toBe('Me***t');
    });

    it('should generate secure tokens', () => {
      const token1 = encryptionService.generateSecureToken(32);
      const token2 = encryptionService.generateSecureToken(32);
      
      expect(token1).toHaveLength(64); // hex encoding doubles length
      expect(token2).toHaveLength(64);
      expect(token1).not.toBe(token2); // Should be unique
    });
  });
});

// Security integration tests
describe('Security Integration Tests', () => {
  it('should handle complete attack scenario', async () => {
    // Simulate a comprehensive attack attempt
    const attackerIp = '192.168.1.100';
    const attacks = [
      { type: 'sql_injection', payload: "'; DROP TABLE users; --" },
      { type: 'xss', payload: '<script>alert("XSS")</script>' },
      { type: 'brute_force', payload: 'multiple_login_attempts' },
    ];

    attacks.forEach(attack => {
      const mockReq = {
        url: `/api/search?q=${attack.payload}`,
        body: JSON.stringify({ content: attack.payload }),
        headers: { 'user-agent': 'Mozilla/5.0' },
        socket: { remoteAddress: attackerIp }
      } as any;

      const events = SecurityMonitor.detectSuspiciousPatterns(mockReq);
      expect(events.length).toBeGreaterThan(0);
      
      // Should detect the attack
      events.forEach(event => {
        expect(['high', 'critical']).toContain(event.severity);
        SecurityMonitor.logSecurityEvent(event);
      });
    });
  });

  it('should validate Turkish marketplace business rules', () => {
    // Test business-specific security rules
    const partData = {
      title: 'BMW E46 Alternatör',
      part_reference: 'ALT12345',
      condition: 'Kullanılabilir',
      price: 850.50,
      location_city: 'İstanbul',
      brand: 'BMW',
      model: 'E46',
      year: 2003,
      description: 'Orijinal Bosch alternatör, test edildi.',
    };

    const result = ValidationSchemas.partCreation.safeParse(partData);
    expect(result.success).toBe(true);
    
    // Test with invalid Turkish city
    const invalidCityData = { ...partData, location_city: 'InvalidCity' };
    const invalidResult = ValidationSchemas.partCreation.safeParse(invalidCityData);
    expect(invalidResult.success).toBe(false);
  });
});
```

---

## Conclusion

This comprehensive security requirements document establishes a robust security framework for BanaYeni SanaEski, addressing the unique challenges of operating a Turkish automotive parts marketplace while maintaining compliance with European data protection standards.

**Security Framework Highlights:**

**Multi-Layer Protection:**
- Defense in depth strategy covering all application layers
- Turkish-optimized input validation and sanitization
- Comprehensive API security with rate limiting and monitoring
- Advanced authentication and authorization with Supabase integration

**Data Protection Excellence:**
- GDPR/KVKK compliance with automated data retention
- Advanced encryption for sensitive Turkish personal data
- Privacy-by-design architecture with row-level security
- Comprehensive audit trails and consent management

**Proactive Security Monitoring:**
- Real-time threat detection and incident response
- Turkish-localized security communications
- Automated security event correlation and alerting
- Integration with production monitoring systems

**Business-Focused Security:**
- Interest-gating system protection and anti-fraud measures
- Turkish marketplace-specific validation rules
- Mobile-optimized security for Turkish network conditions
- Business continuity and disaster recovery planning

This security framework positions BanaYeni SanaEski as a trusted platform in the Turkish automotive parts market while ensuring scalability, compliance, and user protection throughout the platform's growth.

---

*This security requirements document serves as the definitive security implementation guide for the BanaYeni SanaEski Turkish automotive parts marketplace.*