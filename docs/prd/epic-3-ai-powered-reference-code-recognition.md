# Epic 3: AI-Powered Reference Code Recognition

**Epic Goal:** Integrate AI-powered image recognition to automatically extract reference codes from part photos, making it easier for non-technical sellers to list parts accurately. This removes the technical barrier of knowing reference codes while maintaining the precision that makes our matching system valuable.

## Story 3.1: Google Vision API Integration

As a platform developer,
I want to integrate Google Vision API for OCR capabilities,
so that we can extract text from automotive part images.

### Acceptance Criteria

1: Google Cloud account setup with Vision API enabled and API keys configured
2: Serverless function endpoint that accepts image uploads and returns OCR results
3: Support for common image formats: JPEG, PNG, WebP with max size 10MB
4: Response includes all detected text with bounding box coordinates
5: Error handling for API limits, network failures, and invalid images
6: Fallback to Azure Cognitive Services if Google API fails
7: API response caching to avoid duplicate processing of same images

## Story 3.2: Reference Code Pattern Recognition

As a seller uploading part photos,
I want the system to identify and extract reference codes from the detected text,
so that I don't have to manually type complex codes.

### Acceptance Criteria

1: Pattern matching algorithm that identifies automotive reference code formats
2: Support for major manufacturer code patterns (alphanumeric combinations)
3: Confidence scoring for each detected reference code (0-100%)
4: Handle multiple potential codes in single image with ranking
5: Validation against known reference code database when available
6: Special handling for commonly confused characters (0/O, 1/I, etc.)
7: Return top 3 most likely reference codes for user selection

## Story 3.3: AI-Assisted Part Listing Flow

As a seller listing individual parts,
I want AI assistance to identify reference codes from photos,
so that I can list parts accurately without technical knowledge.

### Acceptance Criteria

1: "Scan Reference Code" button in part listing form triggers camera/upload
2: Loading state while AI processes image with progress indication
3: Display extracted reference codes with confidence scores for user selection
4: Allow manual editing of AI-suggested reference codes
5: "Try Another Photo" option if results are unsatisfactory
6: Guidance overlay showing where to find reference codes on common parts
7: Success/failure metrics tracked for continuous improvement

## Story 3.4: Bulk Reference Code Extraction

As an industrial seller with many parts,
I want to upload multiple photos and extract reference codes in batch,
so that I can efficiently list large inventories.

### Acceptance Criteria

1: Batch upload interface accepting up to 20 images simultaneously
2: Progress bar showing processing status for each image
3: Results table showing image thumbnail, extracted codes, and confidence
4: Ability to assign each code to a new part listing with one click
5: Export results to CSV for inventory management
6: Pause/resume capability for large batch processing
7: Automatic retry for failed images with exponential backoff

## Story 3.5: AI Confidence and Manual Override

As a platform user,
I want transparency about AI accuracy and ability to correct errors,
so that I can trust the system while maintaining control.

### Acceptance Criteria

1: Confidence scores displayed as visual indicators (green >90%, yellow 70-90%, red <70%)
2: "Report Incorrect Code" button to flag AI errors for improvement
3: Manual reference code entry always available as primary option
4: AI suggestions appear as optional assistance, not mandatory step
5: User corrections stored to improve future recognition accuracy
6: Monthly accuracy reports available for industrial sellers
7: Tooltip explanations for how confidence scores are calculated
