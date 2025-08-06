# Error Handling Framework - BanaYeni SanaEski

**Document Type:** Comprehensive Error Handling Strategy and Implementation  
**Created:** August 6, 2025  
**Version:** 1.0  
**Status:** Error Management Framework Definition  

---

## Error Handling Overview

This document defines the comprehensive error handling framework for BanaYeni SanaEski, ensuring robust error management, graceful degradation, and exceptional user experience for Turkish automotive parts marketplace users.

**Error Philosophy:** Prevention-First with Graceful Recovery  
**User Experience:** Turkish-Localized Error Messages with Clear Actions  
**System Reliability:** Comprehensive Error Monitoring and Automated Recovery  
**Business Continuity:** Critical Path Protection with Fallback Mechanisms  

---

## Error Classification Framework

### Error Categories

#### 1. Client-Side Errors (Frontend)
```typescript
interface ClientSideErrors {
  userInputErrors: {
    category: "User Input Validation";
    examples: [
      "Invalid Turkish city selection",
      "Malformed part reference number",
      "Invalid price format for Turkish Lira",
      "Missing required Turkish marketplace fields"
    ];
    handling: "Real-time validation with Turkish error messages";
    recovery: "Clear field-specific guidance in Turkish";
  };
  
  networkErrors: {
    category: "Network and Connectivity";
    examples: [
      "API request timeout on Turkish mobile networks", 
      "Connection lost during part image upload",
      "Slow network affecting search results",
      "Offline state during critical operations"
    ];
    handling: "Retry mechanisms with Turkish network awareness";
    recovery: "Offline functionality and connection restoration";
  };
  
  uiRenderingErrors: {
    category: "User Interface Rendering";
    examples: [
      "Turkish character rendering issues",
      "Component loading failures",
      "Image loading errors for parts",
      "Mobile layout breaking on Turkish devices"
    ];
    handling: "Error boundaries with fallback UI";
    recovery: "Graceful degradation maintaining functionality";
  };
  
  authenticationErrors: {
    category: "User Authentication";
    examples: [
      "Session timeout during part listing",
      "Invalid credentials on Turkish user login",
      "Authorization failure for seller features",
      "Token refresh failures"
    ];
    handling: "Seamless re-authentication flow";
    recovery: "Preserve user state and redirect appropriately";
  };
}
```

#### 2. Server-Side Errors (Backend)
```typescript
interface ServerSideErrors {
  databaseErrors: {
    category: "Database Operations";
    examples: [
      "Turkish text search query failures",
      "Connection pool exhaustion",
      "Data consistency violations in parts table",
      "Slow query performance affecting Turkish searches"
    ];
    handling: "Database connection retry with circuit breaker";
    recovery: "Cached results and graceful degradation";
  };
  
  businessLogicErrors: {
    category: "Turkish Marketplace Logic";
    examples: [
      "Interest-gating rule violations",
      "Turkish part validation failures",
      "Seller authorization errors",
      "Duplicate interest prevention failures"
    ];
    handling: "Business rule validation and clear messaging";
    recovery: "Alternative actions and user guidance";
  };
  
  integrationErrors: {
    category: "External Service Integration";
    examples: [
      "Supabase authentication service failures",
      "File storage upload failures",
      "Email notification service errors",
      "Third-party API integration failures"
    ];
    handling: "Service health monitoring and fallbacks";
    recovery: "Queued operations and retry mechanisms";
  };
  
  systemErrors: {
    category: "System Infrastructure";
    examples: [
      "Memory exhaustion during Turkish text processing",
      "CPU overload affecting search performance",
      "Disk space issues affecting image uploads",
      "Network connectivity issues to external services"
    ];
    handling: "System monitoring and automatic scaling";
    recovery: "Load balancing and resource optimization";
  };
}
```

#### 3. Turkish Market-Specific Errors
```typescript
interface TurkishMarketErrors {
  localizationErrors: {
    category: "Turkish Language and Culture";
    examples: [
      "Turkish character encoding failures (çğıöşü)",
      "Currency formatting errors for Turkish Lira",
      "Date/time formatting issues for Turkish locale",
      "Turkish city validation failures"
    ];
    handling: "UTF-8 validation and Turkish locale processing";
    recovery: "Fallback to safe encoding with error reporting";
  };
  
  businessRuleErrors: {
    category: "Turkish Commerce Rules";
    examples: [
      "Turkish automotive part reference validation",
      "Turkish tax calculation errors",
      "Turkish address format validation",
      "Turkish mobile phone format validation"
    ];
    handling: "Turkish-specific validation with local experts";
    recovery: "Manual review queue and customer support";
  };
  
  performanceErrors: {
    category: "Turkish Network Performance";
    examples: [
      "Slow loading on Turkish mobile networks",
      "Image optimization failures for Turkish bandwidth",
      "Database query timeout in Turkish peak hours",
      "CDN performance issues in Turkish regions"
    ];
    handling: "Turkish network monitoring and optimization";
    recovery: "Adaptive performance and cached fallbacks";
  };
}
```

---

## Error Handling Architecture

### Frontend Error Handling

#### 1. React Error Boundaries
```typescript
// Error boundary for Turkish marketplace components
class TurkishMarketplaceErrorBoundary extends React.Component {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Generate unique error ID for tracking
    const errorId = `TR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error with Turkish context
    this.logTurkishMarketplaceError(error, errorInfo);
    
    // Send to monitoring service
    this.reportErrorToMonitoring(error, errorInfo);
    
    this.setState({
      errorInfo
    });
  }

  logTurkishMarketplaceError(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Turkish Marketplace Error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      turkishLocale: navigator.language === 'tr-TR'
    });
  }

  reportErrorToMonitoring(error: Error, errorInfo: React.ErrorInfo) {
    // Send to Sentry or similar monitoring service
    const errorReport = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context: {
        component: errorInfo.componentStack,
        turkish_marketplace: true,
        user_locale: navigator.language,
        timestamp: new Date().toISOString()
      },
      tags: {
        section: 'turkish_marketplace',
        environment: process.env.NODE_ENV,
        version: process.env.NEXT_PUBLIC_APP_VERSION
      }
    };
    
    // Send to monitoring service
    window.errorReporting?.captureException(errorReport);
  }

  render() {
    if (this.state.hasError) {
      return (
        <TurkishErrorFallback 
          error={this.state.error}
          errorId={this.state.errorId}
          onRetry={() => this.setState({ hasError: false })}
          onReportProblem={() => this.reportProblemToSupport()}
        />
      );
    }

    return this.props.children;
  }
}

// Turkish-localized error fallback component
const TurkishErrorFallback: React.FC<TurkishErrorFallbackProps> = ({
  error,
  errorId,
  onRetry,
  onReportProblem
}) => {
  return (
    <div className="error-boundary bg-red-50 border border-red-200 rounded-lg p-6 m-4">
      <div className="flex items-center mb-4">
        <AlertTriangleIcon className="text-red-500 w-8 h-8 mr-3" />
        <h2 className="text-xl font-semibold text-red-800">
          Bir sorun oluştu
        </h2>
      </div>
      
      <p className="text-red-700 mb-4">
        Üzgünüz, beklenmeyen bir hata meydana geldi. Lütfen tekrar deneyin 
        veya devam eden sorun için destek ekibimizle iletişime geçin.
      </p>
      
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Tekrar Dene
        </button>
        
        <button
          onClick={onReportProblem}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Sorunu Bildir
        </button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-red-600">
            Teknik Detaylar (Error ID: {errorId})
          </summary>
          <pre className="mt-2 bg-red-100 p-2 rounded text-xs overflow-auto">
            {error?.stack}
          </pre>
        </details>
      )}
    </div>
  );
};
```

#### 2. API Error Handling
```typescript
// Centralized API error handling for Turkish marketplace
class TurkishMarketplaceAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode: string,
    public turkishMessage: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'TurkishMarketplaceAPIError';
  }
}

// API client with comprehensive Turkish error handling
class TurkishAPIClient {
  private baseURL: string;
  private retryConfig: RetryConfig;
  private circuitBreaker: CircuitBreaker;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2,
      maxRetryDelay: 10000
    };
    this.circuitBreaker = new CircuitBreaker();
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const requestId = this.generateRequestId();
    
    try {
      // Check circuit breaker state
      if (this.circuitBreaker.isOpen()) {
        throw new TurkishMarketplaceAPIError(
          'Service temporarily unavailable',
          503,
          'CIRCUIT_BREAKER_OPEN',
          'Servis şu anda kullanılamıyor. Lütfen bir süre sonra tekrar deneyin.',
          true
        );
      }

      const response = await this.executeWithRetry(endpoint, options, requestId);
      
      // Record successful request for circuit breaker
      this.circuitBreaker.recordSuccess();
      
      return await this.processResponse<T>(response, requestId);
    } catch (error) {
      // Record failure for circuit breaker
      this.circuitBreaker.recordFailure();
      
      // Process and throw structured error
      throw this.processError(error, endpoint, requestId);
    }
  }

  private async executeWithRetry(
    endpoint: string,
    options: RequestOptions,
    requestId: string
  ): Promise<Response> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          await this.delay(this.calculateRetryDelay(attempt));
        }
        
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
            'X-Turkish-Locale': 'tr-TR',
            ...options.headers
          }
        });

        // Don't retry on 4xx errors (except 429)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          return response;
        }

        // Return successful responses
        if (response.ok) {
          return response;
        }

        // Log retry attempt
        console.warn(`API request retry ${attempt + 1}/${this.retryConfig.maxRetries}`, {
          endpoint,
          status: response.status,
          requestId
        });

        lastError = new Error(`HTTP ${response.status}`);
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on network errors for the last attempt
        if (attempt === this.retryConfig.maxRetries) {
          break;
        }
      }
    }

    throw lastError!;
  }

  private async processResponse<T>(response: Response, requestId: string): Promise<T> {
    if (!response.ok) {
      const errorData = await this.extractErrorData(response);
      
      throw new TurkishMarketplaceAPIError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData.code || 'UNKNOWN_ERROR',
        errorData.turkishMessage || this.getDefaultTurkishErrorMessage(response.status),
        this.isRetryableError(response.status)
      );
    }

    try {
      const data = await response.json();
      return data;
    } catch (error) {
      throw new TurkishMarketplaceAPIError(
        'Invalid response format',
        500,
        'INVALID_RESPONSE',
        'Sunucudan geçersiz yanıt alındı',
        true
      );
    }
  }

  private processError(error: any, endpoint: string, requestId: string): TurkishMarketplaceAPIError {
    // If already a TurkishMarketplaceAPIError, just return it
    if (error instanceof TurkishMarketplaceAPIError) {
      return error;
    }

    // Network or other errors
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      return new TurkishMarketplaceAPIError(
        'Network error',
        0,
        'NETWORK_ERROR',
        'İnternet bağlantınızı kontrol edin ve tekrar deneyin',
        true
      );
    }

    // Timeout errors
    if (error.name === 'AbortError') {
      return new TurkishMarketplaceAPIError(
        'Request timeout',
        408,
        'TIMEOUT',
        'İstek zaman aşımına uğradı. Lütfen tekrar deneyin',
        true
      );
    }

    // Generic error
    return new TurkishMarketplaceAPIError(
      error.message || 'Unknown error',
      500,
      'UNKNOWN_ERROR',
      'Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin',
      false
    );
  }

  private getDefaultTurkishErrorMessage(statusCode: number): string {
    const errorMessages: Record<number, string> = {
      400: 'Geçersiz istek. Lütfen girdilerinizi kontrol edin',
      401: 'Oturum açmanız gerekiyor',
      403: 'Bu işlem için yetkiniz bulunmuyor',
      404: 'Aradığınız sayfa veya içerik bulunamadı',
      409: 'Bu işlem şu anda gerçekleştirilemiyor',
      429: 'Çok fazla istek gönderildi. Lütfen bekleyin',
      500: 'Sunucu hatası oluştu. Lütfen tekrar deneyin',
      502: 'Sunucu geçici olarak kullanılamıyor',
      503: 'Servis şu anda bakımda. Lütfen daha sonra tekrar deneyin'
    };

    return errorMessages[statusCode] || 'Bilinmeyen bir hata oluştu';
  }

  private calculateRetryDelay(attempt: number): number {
    const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt);
    return Math.min(delay, this.retryConfig.maxRetryDelay);
  }

  private isRetryableError(statusCode: number): boolean {
    return [429, 500, 502, 503, 504].includes(statusCode);
  }

  private generateRequestId(): string {
    return `tr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Backend Error Handling

#### 3. API Route Error Handling
```typescript
// Next.js API route error handler for Turkish marketplace
export function withTurkishErrorHandling(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const requestId = req.headers['x-request-id'] as string || generateRequestId();
    const startTime = Date.now();

    try {
      // Add request ID to response headers
      res.setHeader('X-Request-ID', requestId);
      res.setHeader('X-Turkish-Marketplace', 'true');

      // Log request start
      console.log(`[${requestId}] API Request started: ${req.method} ${req.url}`);

      // Execute the handler
      await handler(req, res);

      // Log successful completion
      const duration = Date.now() - startTime;
      console.log(`[${requestId}] API Request completed successfully in ${duration}ms`);

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${requestId}] API Request failed after ${duration}ms:`, error);

      // Send error response
      await sendTurkishErrorResponse(res, error, requestId);
    }
  };
}

async function sendTurkishErrorResponse(
  res: NextApiResponse,
  error: any,
  requestId: string
): Promise<void> {
  // Determine error type and status code
  const errorInfo = categorizeError(error);
  
  // Log error details
  logTurkishAPIError(error, errorInfo, requestId);
  
  // Send monitoring alert if needed
  if (errorInfo.severity === 'high') {
    await sendErrorAlert(error, errorInfo, requestId);
  }

  // Prepare Turkish error response
  const errorResponse: TurkishAPIErrorResponse = {
    success: false,
    error: {
      code: errorInfo.code,
      message: errorInfo.message,
      turkishMessage: errorInfo.turkishMessage,
      requestId,
      timestamp: new Date().toISOString(),
      retryable: errorInfo.retryable
    }
  };

  // Add debug information in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.debug = {
      stack: error.stack,
      details: error.message
    };
  }

  res.status(errorInfo.statusCode).json(errorResponse);
}

function categorizeError(error: any): ErrorInfo {
  // Database errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return {
      code: 'DATABASE_CONNECTION_ERROR',
      message: 'Database connection failed',
      turkishMessage: 'Veritabanı bağlantısı kurulamadı. Lütfen tekrar deneyin',
      statusCode: 503,
      severity: 'high',
      retryable: true
    };
  }

  // PostgreSQL errors
  if (error.code === '23505') { // Unique constraint violation
    return {
      code: 'DUPLICATE_ENTRY',
      message: 'Duplicate entry',
      turkishMessage: 'Bu kayıt zaten mevcut',
      statusCode: 409,
      severity: 'low',
      retryable: false
    };
  }

  // Supabase auth errors
  if (error.message?.includes('JWT')) {
    return {
      code: 'INVALID_TOKEN',
      message: 'Invalid authentication token',
      turkishMessage: 'Oturum süresi doldu. Lütfen tekrar giriş yapın',
      statusCode: 401,
      severity: 'medium',
      retryable: false
    };
  }

  // Turkish text processing errors
  if (error.message?.includes('encoding') || error.message?.includes('Turkish')) {
    return {
      code: 'TURKISH_TEXT_ERROR',
      message: 'Turkish text processing failed',
      turkishMessage: 'Türkçe metin işlenirken hata oluştu',
      statusCode: 400,
      severity: 'medium',
      retryable: true
    };
  }

  // Business rule violations
  if (error instanceof BusinessRuleError) {
    return {
      code: error.code,
      message: error.message,
      turkishMessage: error.turkishMessage,
      statusCode: 400,
      severity: 'low',
      retryable: false
    };
  }

  // Generic server error
  return {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error',
    turkishMessage: 'Sunucu hatası oluştu. Lütfen tekrar deneyin',
    statusCode: 500,
    severity: 'high',
    retryable: true
  };
}
```

#### 4. Business Logic Error Handling
```typescript
// Turkish marketplace business rule errors
export class BusinessRuleError extends Error {
  constructor(
    message: string,
    public code: string,
    public turkishMessage: string,
    public field?: string
  ) {
    super(message);
    this.name = 'BusinessRuleError';
  }
}

// Interest-gating business logic with error handling
export class InterestGatingService {
  async expressInterest(userId: string, partId: string): Promise<InterestResult> {
    try {
      // Validate user authentication
      const user = await this.validateUser(userId);
      if (!user) {
        throw new BusinessRuleError(
          'User not authenticated',
          'USER_NOT_AUTHENTICATED',
          'Oturum açmanız gerekiyor'
        );
      }

      // Validate part existence
      const part = await this.validatePart(partId);
      if (!part) {
        throw new BusinessRuleError(
          'Part not found',
          'PART_NOT_FOUND',
          'Aradığınız parça bulunamadı'
        );
      }

      // Check if user is the seller
      if (part.seller_id === userId) {
        throw new BusinessRuleError(
          'Cannot express interest in own part',
          'SELF_INTEREST_FORBIDDEN',
          'Kendi parçanıza ilgi gösteremezsiniz'
        );
      }

      // Check for existing interest
      const existingInterest = await this.checkExistingInterest(userId, partId);
      if (existingInterest) {
        throw new BusinessRuleError(
          'Interest already expressed',
          'DUPLICATE_INTEREST',
          'Bu parçaya zaten ilgi göstermişsiniz'
        );
      }

      // Check rate limiting
      const rateLimitCheck = await this.checkRateLimit(userId);
      if (!rateLimitCheck.allowed) {
        throw new BusinessRuleError(
          'Rate limit exceeded',
          'RATE_LIMIT_EXCEEDED',
          `Çok fazla istek gönderildi. ${rateLimitCheck.resetTime} dakika sonra tekrar deneyin`,
          'interest'
        );
      }

      // Create interest record
      const interest = await this.createInterest(userId, partId);
      
      // Send notification to seller (async)
      this.notifySeller(part.seller_id, interest).catch(error => {
        console.error('Failed to notify seller:', error);
      });

      return {
        success: true,
        interestId: interest.id,
        message: 'İlginiz başarıyla iletildi'
      };

    } catch (error) {
      // Log error with Turkish context
      console.error('Interest expression failed:', {
        userId,
        partId,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      // Re-throw business rule errors
      if (error instanceof BusinessRuleError) {
        throw error;
      }

      // Handle database errors
      if (error.code === '23505') { // Unique constraint
        throw new BusinessRuleError(
          'Duplicate interest',
          'DUPLICATE_INTEREST',
          'Bu parçaya zaten ilgi göstermişsiniz'
        );
      }

      // Generic database error
      throw new BusinessRuleError(
        'Database error',
        'DATABASE_ERROR',
        'Veritabanı hatası oluştu. Lütfen tekrar deneyin'
      );
    }
  }
}
```

---

## Turkish Text Processing Error Handling

### Character Encoding and Localization

#### 5. Turkish Character Processing
```typescript
// Turkish text processing with comprehensive error handling
export class TurkishTextProcessor {
  private static readonly TURKISH_CHARS = 'çğıöşüÇĞIÖŞÜ';
  private static readonly ASCII_REPLACEMENTS: Record<string, string> = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G', 
    'ı': 'i', 'I': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };

  static validateTurkishText(text: string, field: string): ValidationResult {
    try {
      // Check for null or empty
      if (!text || text.trim().length === 0) {
        return {
          isValid: false,
          error: new BusinessRuleError(
            `${field} is required`,
            'FIELD_REQUIRED',
            `${field} alanı zorunludur`,
            field
          )
        };
      }

      // Check encoding
      const encodingCheck = this.checkEncoding(text);
      if (!encodingCheck.isValid) {
        return {
          isValid: false,
          error: new BusinessRuleError(
            'Invalid character encoding',
            'ENCODING_ERROR',
            'Geçersiz karakter kodlaması. Türkçe karakterleri kontrol edin',
            field
          )
        };
      }

      // Check for SQL injection patterns
      const sqlInjectionCheck = this.checkSQLInjection(text);
      if (!sqlInjectionCheck.isValid) {
        return {
          isValid: false,
          error: new BusinessRuleError(
            'Invalid characters detected',
            'INVALID_CHARACTERS',
            'Geçersiz karakterler tespit edildi',
            field
          )
        };
      }

      // Check text length
      const lengthCheck = this.checkLength(text, field);
      if (!lengthCheck.isValid) {
        return {
          isValid: false,
          error: lengthCheck.error
        };
      }

      return { isValid: true };

    } catch (error) {
      console.error(`Turkish text validation failed for field ${field}:`, error);
      
      return {
        isValid: false,
        error: new BusinessRuleError(
          'Text validation failed',
          'VALIDATION_ERROR',
          'Metin doğrulaması başarısız oldu',
          field
        )
      };
    }
  }

  static sanitizeForSearch(text: string): string {
    try {
      if (!text) return '';

      // Normalize Turkish characters for search
      let normalized = text.toLowerCase().trim();
      
      // Replace Turkish characters with search-friendly versions
      for (const [turkishChar, replacement] of Object.entries(this.ASCII_REPLACEMENTS)) {
        normalized = normalized.replace(new RegExp(turkishChar.toLowerCase(), 'g'), replacement);
      }

      // Remove special characters except alphanumeric and spaces
      normalized = normalized.replace(/[^a-z0-9\s]/g, '');
      
      // Collapse multiple spaces
      normalized = normalized.replace(/\s+/g, ' ').trim();

      return normalized;

    } catch (error) {
      console.error('Turkish text sanitization failed:', error);
      
      // Return original text as fallback
      return text.toLowerCase().trim();
    }
  }

  static formatTurkishPrice(amount: number): string {
    try {
      if (typeof amount !== 'number' || isNaN(amount)) {
        throw new BusinessRuleError(
          'Invalid price amount',
          'INVALID_PRICE',
          'Geçersiz fiyat tutarı'
        );
      }

      if (amount < 0) {
        throw new BusinessRuleError(
          'Price cannot be negative',
          'NEGATIVE_PRICE',
          'Fiyat negatif olamaz'
        );
      }

      if (amount > 1000000) {
        throw new BusinessRuleError(
          'Price too high',
          'PRICE_TOO_HIGH',
          'Fiyat çok yüksek'
        );
      }

      // Format with Turkish locale
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);

    } catch (error) {
      console.error('Turkish price formatting failed:', error);
      
      // Fallback formatting
      return `${amount.toLocaleString('tr-TR')} TL`;
    }
  }

  private static checkEncoding(text: string): { isValid: boolean; error?: string } {
    try {
      // Try to encode and decode the text
      const encoded = encodeURIComponent(text);
      const decoded = decodeURIComponent(encoded);
      
      if (decoded !== text) {
        return { isValid: false, error: 'Encoding mismatch' };
      }

      // Check for valid UTF-8 sequence
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        
        // Check for valid Unicode ranges
        if (charCode > 0xFFFF) {
          return { isValid: false, error: 'Invalid Unicode character' };
        }
      }

      return { isValid: true };

    } catch (error) {
      return { isValid: false, error: 'Encoding validation failed' };
    }
  }

  private static checkSQLInjection(text: string): { isValid: boolean } {
    const dangerousPatterns = [
      /(\b(select|insert|update|delete|drop|create|alter|exec|union|script)\b)/i,
      /(--|\/\*|\*\/)/,
      /[';].*[';]/,
      /<script/i,
      /javascript:/i
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(text)) {
        return { isValid: false };
      }
    }

    return { isValid: true };
  }

  private static checkLength(text: string, field: string): ValidationResult {
    const fieldLimits: Record<string, { min: number; max: number }> = {
      'title': { min: 5, max: 100 },
      'description': { min: 10, max: 1000 },
      'part_reference': { min: 3, max: 20 },
      'brand': { min: 2, max: 50 },
      'model': { min: 1, max: 50 }
    };

    const limits = fieldLimits[field] || { min: 1, max: 255 };
    
    if (text.length < limits.min) {
      return {
        isValid: false,
        error: new BusinessRuleError(
          `${field} too short`,
          'FIELD_TOO_SHORT',
          `${field} en az ${limits.min} karakter olmalıdır`,
          field
        )
      };
    }

    if (text.length > limits.max) {
      return {
        isValid: false,
        error: new BusinessRuleError(
          `${field} too long`,
          'FIELD_TOO_LONG',
          `${field} en fazla ${limits.max} karakter olabilir`,
          field
        )
      };
    }

    return { isValid: true };
  }
}
```

---

## Error Monitoring and Alerting

### Real-time Error Tracking

#### 6. Error Monitoring System
```typescript
// Comprehensive error monitoring for Turkish marketplace
export class TurkishMarketplaceErrorMonitor {
  private static instance: TurkishMarketplaceErrorMonitor;
  private errorQueue: ErrorReport[] = [];
  private alertRules: AlertRule[] = [];
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();

  constructor() {
    this.initializeAlertRules();
    this.startErrorProcessing();
  }

  static getInstance(): TurkishMarketplaceErrorMonitor {
    if (!TurkishMarketplaceErrorMonitor.instance) {
      TurkishMarketplaceErrorMonitor.instance = new TurkishMarketplaceErrorMonitor();
    }
    return TurkishMarketplaceErrorMonitor.instance;
  }

  reportError(error: Error, context: ErrorContext): string {
    const errorId = this.generateErrorId();
    
    const errorReport: ErrorReport = {
      id: errorId,
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context: {
        ...context,
        turkishMarketplace: true,
        userAgent: context.userAgent || 'unknown',
        url: context.url || 'unknown',
        userId: context.userId,
        sessionId: context.sessionId
      },
      severity: this.calculateSeverity(error, context),
      category: this.categorizeError(error),
      tags: this.generateTags(error, context)
    };

    // Add to processing queue
    this.errorQueue.push(errorReport);

    // Immediate alert for critical errors
    if (errorReport.severity === 'critical') {
      this.sendImmediateAlert(errorReport);
    }

    // Update circuit breaker
    this.updateCircuitBreaker(errorReport);

    return errorId;
  }

  private initializeAlertRules(): void {
    this.alertRules = [
      {
        id: 'turkish_text_processing_failure',
        condition: (report) => 
          report.category === 'turkish_text_processing' && 
          report.severity === 'high',
        threshold: 5,
        timeWindow: 300, // 5 minutes
        action: 'immediate_alert'
      },
      {
        id: 'database_connection_failures',
        condition: (report) => 
          report.context.errorCode === 'DATABASE_CONNECTION_ERROR',
        threshold: 3,
        timeWindow: 60, // 1 minute
        action: 'escalate_to_devops'
      },
      {
        id: 'turkish_user_authentication_issues',
        condition: (report) => 
          report.category === 'authentication' && 
          report.context.turkishUser === true,
        threshold: 10,
        timeWindow: 600, // 10 minutes
        action: 'notify_support_team'
      },
      {
        id: 'mobile_performance_degradation',
        condition: (report) => 
          report.category === 'performance' && 
          report.context.deviceType === 'mobile' &&
          report.context.networkType === 'turkish_mobile',
        threshold: 20,
        timeWindow: 300,
        action: 'performance_team_alert'
      }
    ];
  }

  private startErrorProcessing(): void {
    setInterval(() => {
      this.processErrorQueue();
      this.evaluateAlertRules();
      this.updateCircuitBreakerStates();
    }, 30000); // Process every 30 seconds
  }

  private processErrorQueue(): void {
    const batchSize = 50;
    const batch = this.errorQueue.splice(0, batchSize);
    
    if (batch.length === 0) return;

    // Send to external monitoring service
    this.sendToExternalMonitoring(batch);
    
    // Store in local analytics
    this.storeErrorAnalytics(batch);
    
    // Generate insights for Turkish marketplace
    this.generateTurkishMarketplaceInsights(batch);
  }

  private evaluateAlertRules(): void {
    const currentTime = Date.now();
    
    for (const rule of this.alertRules) {
      const timeWindowStart = currentTime - (rule.timeWindow * 1000);
      
      // Get recent errors matching the condition
      const recentErrors = this.getRecentErrors(timeWindowStart);
      const matchingErrors = recentErrors.filter(rule.condition);
      
      if (matchingErrors.length >= rule.threshold) {
        this.triggerAlert(rule, matchingErrors);
      }
    }
  }

  private calculateSeverity(error: Error, context: ErrorContext): ErrorSeverity {
    // Critical errors
    if (
      context.errorCode === 'DATABASE_CONNECTION_ERROR' ||
      context.errorCode === 'AUTHENTICATION_SERVICE_DOWN' ||
      error.message.includes('Cannot connect')
    ) {
      return 'critical';
    }

    // High severity errors
    if (
      context.errorCode === 'TURKISH_TEXT_ERROR' ||
      context.errorCode === 'PAYMENT_PROCESSING_ERROR' ||
      context.endpoint?.includes('/api/parts')
    ) {
      return 'high';
    }

    // Medium severity errors
    if (
      context.errorCode === 'VALIDATION_ERROR' ||
      context.errorCode === 'BUSINESS_RULE_ERROR' ||
      context.statusCode === 400
    ) {
      return 'medium';
    }

    // Default to low severity
    return 'low';
  }

  private categorizeError(error: Error): ErrorCategory {
    if (error.name === 'TurkishTextProcessingError') {
      return 'turkish_text_processing';
    }
    
    if (error.name === 'BusinessRuleError') {
      return 'business_logic';
    }
    
    if (error.message.includes('authentication') || error.message.includes('auth')) {
      return 'authentication';
    }
    
    if (error.message.includes('database') || error.message.includes('connection')) {
      return 'database';
    }
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'network';
    }
    
    return 'unknown';
  }

  private async sendImmediateAlert(errorReport: ErrorReport): Promise<void> {
    const alertMessage = {
      title: 'Critical Error in Turkish Marketplace',
      message: `Critical error occurred: ${errorReport.error.message}`,
      errorId: errorReport.id,
      timestamp: errorReport.timestamp,
      context: errorReport.context,
      severity: errorReport.severity
    };

    // Send to multiple channels
    await Promise.all([
      this.sendSlackAlert(alertMessage),
      this.sendEmailAlert(alertMessage),
      this.sendSMSAlert(alertMessage), // For critical errors only
    ]);
  }

  private generateErrorId(): string {
    return `TR-ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

---

## Error Recovery and Resilience

### Graceful Degradation Strategies

#### 7. Circuit Breaker Implementation
```typescript
// Circuit breaker for Turkish marketplace services
export class TurkishMarketplaceCircuitBreaker {
  private state: CircuitBreakerState = 'CLOSED';
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number = 0;
  private nextAttemptTime: number = 0;

  constructor(
    private serviceName: string,
    private config: CircuitBreakerConfig = {
      failureThreshold: 5,
      recoveryTimeout: 60000, // 60 seconds
      halfOpenMaxCalls: 3,
      monitoringWindow: 300000 // 5 minutes
    }
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttemptTime) {
        throw new TurkishMarketplaceAPIError(
          `Service ${this.serviceName} temporarily unavailable`,
          503,
          'CIRCUIT_BREAKER_OPEN',
          `${this.serviceName} servisi geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin`,
          true
        );
      } else {
        // Move to half-open state
        this.state = 'HALF_OPEN';
        console.log(`Circuit breaker for ${this.serviceName} moved to HALF_OPEN state`);
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      
      if (this.successCount >= this.config.halfOpenMaxCalls) {
        this.state = 'CLOSED';
        this.successCount = 0;
        console.log(`Circuit breaker for ${this.serviceName} CLOSED - service recovered`);
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      this.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
      console.log(`Circuit breaker for ${this.serviceName} OPEN - half-open test failed`);
    } else if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
      console.log(`Circuit breaker for ${this.serviceName} OPEN - failure threshold exceeded`);
    }
  }

  getState(): CircuitBreakerState {
    return this.state;
  }

  getStats(): CircuitBreakerStats {
    return {
      serviceName: this.serviceName,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime
    };
  }
}
```

#### 8. Fallback Mechanisms
```typescript
// Fallback strategies for Turkish marketplace operations
export class TurkishMarketplaceFallbacks {
  static async searchParts(
    filters: SearchFilters,
    primarySearchService: PartsSearchService,
    cacheService: CacheService
  ): Promise<SearchResult> {
    try {
      // Primary search attempt
      return await primarySearchService.search(filters);
    } catch (error) {
      console.warn('Primary search failed, attempting fallbacks:', error);
      
      try {
        // Fallback 1: Use cached results
        const cachedResults = await cacheService.getCachedSearch(filters);
        if (cachedResults) {
          return {
            ...cachedResults,
            fromCache: true,
            warning: 'Sonuçlar önbellekten getiriliyor'
          };
        }
      } catch (cacheError) {
        console.warn('Cache fallback failed:', cacheError);
      }

      try {
        // Fallback 2: Simple text search without advanced features
        const simpleResults = await this.performSimpleSearch(filters);
        return {
          ...simpleResults,
          degraded: true,
          warning: 'Basitleştirilmiş arama sonuçları gösteriliyor'
        };
      } catch (simpleError) {
        console.warn('Simple search fallback failed:', simpleError);
      }

      // Final fallback: Return popular parts
      try {
        const popularParts = await cacheService.getPopularParts(filters.location_city);
        return {
          parts: popularParts,
          total: popularParts.length,
          fromFallback: true,
          warning: 'Arama servisinde sorun yaşanıyor. Popüler parçalar gösteriliyor'
        };
      } catch (popularError) {
        console.error('All search fallbacks failed:', popularError);
        throw new TurkishMarketplaceAPIError(
          'Search service completely unavailable',
          503,
          'SEARCH_UNAVAILABLE',
          'Arama servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin',
          true
        );
      }
    }
  }

  static async uploadPartImages(
    images: File[],
    partId: string,
    primaryUploadService: ImageUploadService,
    fallbackUploadService: FallbackImageService
  ): Promise<UploadResult> {
    const results: ImageUploadResult[] = [];
    const errors: Error[] = [];

    for (const image of images) {
      try {
        // Try primary upload service
        const result = await primaryUploadService.upload(image, partId);
        results.push(result);
      } catch (error) {
        console.warn(`Primary upload failed for image ${image.name}:`, error);
        
        try {
          // Fallback to alternative service
          const fallbackResult = await fallbackUploadService.upload(image, partId);
          results.push({
            ...fallbackResult,
            fromFallback: true
          });
        } catch (fallbackError) {
          console.error(`Fallback upload failed for image ${image.name}:`, fallbackError);
          errors.push(fallbackError);
        }
      }
    }

    if (results.length === 0) {
      throw new TurkishMarketplaceAPIError(
        'All image uploads failed',
        500,
        'UPLOAD_FAILED',
        'Resim yükleme başarısız oldu. Lütfen tekrar deneyin',
        true
      );
    }

    return {
      successful: results,
      failed: errors.length,
      warning: errors.length > 0 ? 
        `${errors.length} resim yüklenemedi. Diğerleri başarıyla yüklendi.` : 
        undefined
    };
  }

  private static async performSimpleSearch(filters: SearchFilters): Promise<SearchResult> {
    // Implement simple database query without complex text processing
    // This is a degraded version that still provides basic functionality
    const query = `
      SELECT id, title, part_reference, price, location_city, condition, brand, model
      FROM parts 
      WHERE location_city = $1 
      AND condition = $2
      ORDER BY created_at DESC 
      LIMIT 20
    `;

    const result = await database.query(query, [
      filters.location_city,
      filters.condition || 'Kullanılabilir'
    ]);

    return {
      parts: result.rows,
      total: result.rows.length,
      degraded: true
    };
  }
}
```

---

## User Experience Error Handling

### Turkish User Error Communication

#### 9. User-Friendly Error Messages
```typescript
// Turkish user error message system
export class TurkishUserErrorMessages {
  private static errorMessages: Record<string, TurkishErrorMessage> = {
    // Authentication errors
    'USER_NOT_AUTHENTICATED': {
      title: 'Giriş Yapmanız Gerekiyor',
      message: 'Bu işlemi yapmak için hesabınıza giriş yapmanız gerekiyor.',
      action: 'Giriş Yap',
      actionUrl: '/login',
      type: 'warning'
    },
    'INVALID_CREDENTIALS': {
      title: 'Giriş Bilgileri Hatalı',
      message: 'E-posta adresiniz veya şifreniz hatalı. Lütfen kontrol ederek tekrar deneyin.',
      action: 'Tekrar Dene',
      type: 'error'
    },
    'SESSION_EXPIRED': {
      title: 'Oturum Süresi Doldu',
      message: 'Güvenliğiniz için oturumunuz sonlandırıldı. Lütfen tekrar giriş yapın.',
      action: 'Giriş Yap',
      actionUrl: '/login',
      type: 'info'
    },

    // Parts and marketplace errors
    'PART_NOT_FOUND': {
      title: 'Parça Bulunamadı',
      message: 'Aradığınız parça bulunamadı. Parça satıştan kaldırılmış olabilir.',
      action: 'Parça Ara',
      actionUrl: '/search',
      type: 'warning'
    },
    'DUPLICATE_INTEREST': {
      title: 'Zaten İlgi Göstermişsiniz',
      message: 'Bu parçaya daha önce ilgi göstermişsiniz. Satıcının size dönmesini bekleyebilirsiniz.',
      action: 'İsteklerim',
      actionUrl: '/my-requests',
      type: 'info'
    },
    'SELF_INTEREST_FORBIDDEN': {
      title: 'Kendi Parçanıza İlgi Gösteremezsiniz',
      message: 'Kendi listelediğiniz parçalara ilgi gösteremezsiniz.',
      action: 'Diğer Parçalar',
      actionUrl: '/search',
      type: 'warning'
    },

    // Network and system errors
    'NETWORK_ERROR': {
      title: 'Bağlantı Sorunu',
      message: 'İnternet bağlantınızda sorun var. Lütfen bağlantınızı kontrol ederek tekrar deneyin.',
      action: 'Tekrar Dene',
      type: 'error'
    },
    'SERVICE_UNAVAILABLE': {
      title: 'Servis Geçici Olarak Kullanılamıyor',
      message: 'Sistemimizde geçici bir sorun yaşanıyor. Lütfen birkaç dakika sonra tekrar deneyin.',
      action: 'Tekrar Dene',
      type: 'error'
    },
    'UPLOAD_FAILED': {
      title: 'Resim Yüklenemedi',
      message: 'Resim yükleme işlemi başarısız oldu. Lütfen resim boyutunu kontrol ederek tekrar deneyin.',
      action: 'Tekrar Dene',
      type: 'error'
    },

    // Validation errors
    'INVALID_PHONE_FORMAT': {
      title: 'Geçersiz Telefon Numarası',
      message: 'Lütfen geçerli bir Türk telefon numarası girin. Örnek: 0532 123 4567',
      action: 'Düzelt',
      type: 'warning'
    },
    'INVALID_PRICE_FORMAT': {
      title: 'Geçersiz Fiyat',
      message: 'Lütfen geçerli bir fiyat girin. Fiyat 0 ile 1,000,000 TL arasında olmalıdır.',
      action: 'Düzelt',
      type: 'warning'
    },
    'INVALID_CITY': {
      title: 'Geçersiz Şehir',
      message: 'Lütfen listeden geçerli bir Türk şehri seçin.',
      action: 'Düzelt',
      type: 'warning'
    }
  };

  static getErrorMessage(errorCode: string): TurkishErrorMessage {
    return this.errorMessages[errorCode] || {
      title: 'Beklenmeyen Hata',
      message: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin veya destek ekibiyle iletişime geçin.',
      action: 'Tekrar Dene',
      type: 'error'
    };
  }

  static formatErrorForUser(error: TurkishMarketplaceAPIError): UserError {
    const errorMessage = this.getErrorMessage(error.errorCode);
    
    return {
      ...errorMessage,
      errorId: error.requestId || 'unknown',
      timestamp: new Date().toLocaleString('tr-TR'),
      details: process.env.NODE_ENV === 'development' ? {
        originalMessage: error.message,
        statusCode: error.statusCode,
        retryable: error.retryable
      } : undefined
    };
  }
}

// Error display component for Turkish users
const TurkishErrorDisplay: React.FC<TurkishErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  showDetails = false
}) => {
  const errorMessage = TurkishUserErrorMessages.formatErrorForUser(error);
  
  const getErrorIcon = (type: ErrorType) => {
    switch (type) {
      case 'error': return <AlertCircleIcon className="w-6 h-6 text-red-500" />;
      case 'warning': return <AlertTriangleIcon className="w-6 h-6 text-yellow-500" />;
      case 'info': return <InfoIcon className="w-6 h-6 text-blue-500" />;
      default: return <AlertCircleIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getErrorStyles = (type: ErrorType) => {
    const baseStyles = "border rounded-lg p-4 mb-4";
    switch (type) {
      case 'error': return `${baseStyles} bg-red-50 border-red-200`;
      case 'warning': return `${baseStyles} bg-yellow-50 border-yellow-200`;
      case 'info': return `${baseStyles} bg-blue-50 border-blue-200`;
      default: return `${baseStyles} bg-gray-50 border-gray-200`;
    }
  };

  return (
    <div className={getErrorStyles(errorMessage.type)}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getErrorIcon(errorMessage.type)}
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            {errorMessage.title}
          </h3>
          
          <p className="mt-1 text-sm text-gray-700">
            {errorMessage.message}
          </p>
          
          {showDetails && errorMessage.details && (
            <details className="mt-3">
              <summary className="text-sm text-gray-600 cursor-pointer">
                Teknik Detaylar
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(errorMessage.details, null, 2)}
              </pre>
            </details>
          )}
          
          <div className="mt-4 flex gap-3">
            {errorMessage.action && (
              <button
                onClick={onRetry}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                {errorMessage.action}
              </button>
            )}
            
            {errorMessage.actionUrl && (
              <Link
                href={errorMessage.actionUrl}
                className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
              >
                {errorMessage.action}
              </Link>
            )}
            
            <button
              onClick={onDismiss}
              className="text-gray-600 text-sm hover:text-gray-800"
            >
              Kapat
            </button>
          </div>
        </div>
        
        <div className="ml-4 text-xs text-gray-500">
          Hata ID: {errorMessage.errorId}
        </div>
      </div>
    </div>
  );
};
```

---

## Conclusion

This comprehensive Error Handling Framework ensures robust, user-friendly error management throughout the BanaYeni SanaEski Turkish marketplace. The framework provides:

**Complete Error Coverage:**
- **Client-Side Errors:** React error boundaries, API failures, network issues
- **Server-Side Errors:** Database problems, business logic violations, system issues
- **Turkish-Specific Errors:** Language processing, cultural appropriateness, local compliance

**Resilient Error Recovery:**
- **Circuit Breakers:** Service protection and automatic recovery
- **Fallback Mechanisms:** Graceful degradation with alternative functionality
- **Retry Strategies:** Intelligent retry logic with exponential backoff
- **Error Monitoring:** Real-time error tracking and alerting

**Turkish User Experience:**
- **Localized Messages:** All error messages in clear, helpful Turkish
- **Cultural Appropriateness:** Error handling respects Turkish communication style
- **Action-Oriented:** Every error provides clear next steps for users
- **Context-Aware:** Errors consider Turkish market and mobile usage patterns

**Production Reliability:**
- **Monitoring Integration:** Comprehensive error tracking and analysis
- **Performance Protection:** Error handling optimized for Turkish networks
- **Business Continuity:** Critical path protection with backup strategies
- **Continuous Improvement:** Error pattern analysis for system enhancement

This error handling framework positions BanaYeni SanaEski to provide exceptional reliability and user experience, even when facing unexpected challenges in the Turkish automotive parts marketplace.

---

*This Error Handling Framework serves as the complete guide for managing all types of errors in the BanaYeni SanaEski marketplace platform.*