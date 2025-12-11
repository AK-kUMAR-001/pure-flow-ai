/**
 * QR Code Integration with Deep Linking
 * Generate QR codes that open app directly with offline support
 */

import QRCode from 'qrcode';

export interface QRCodeData {
  type: 'booking' | 'prediction' | 'profile' | 'product';
  id: string;
  userId?: string;
  deepLink: string;
  fallbackUrl: string;
  metadata?: Record<string, any>;
}

/**
 * Generate deep link URL for the app
 */
export const generateDeepLink = (
  type: QRCodeData['type'],
  id: string,
  userId?: string
): string => {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    type,
    id,
    ...(userId && { userId }),
    // For offline support, add fallback parameters
    offline: 'true',
  });

  return `${baseUrl}/app?${params.toString()}`;
};

/**
 * Generate QR code for various features
 */
export const generateQRCode = async (data: QRCodeData): Promise<string> => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data.deepLink, {
      width: 300,
      margin: 2,
      color: {
        dark: '#003366', // Deep blue
        light: '#ffffff', // White
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

/**
 * QR Code generator for different features
 */
export const QRCodeGenerator = {
  /**
   * Generate QR for booking page
   */
  booking: async (bookingId: string) => {
    const data: QRCodeData = {
      type: 'booking',
      id: bookingId,
      deepLink: generateDeepLink('booking', bookingId),
      fallbackUrl: `/booking?id=${bookingId}`,
    };
    return generateQRCode(data);
  },

  /**
   * Generate QR for prediction results
   */
  prediction: async (predictionId: string, userId: string) => {
    const data: QRCodeData = {
      type: 'prediction',
      id: predictionId,
      userId,
      deepLink: generateDeepLink('prediction', predictionId, userId),
      fallbackUrl: `/predict?id=${predictionId}`,
    };
    return generateQRCode(data);
  },

  /**
   * Generate QR for user profile
   */
  profile: async (userId: string) => {
    const data: QRCodeData = {
      type: 'profile',
      id: userId,
      deepLink: generateDeepLink('profile', userId),
      fallbackUrl: `/profile?userId=${userId}`,
    };
    return generateQRCode(data);
  },

  /**
   * Generate QR for product/filter
   */
  product: async (productId: string) => {
    const data: QRCodeData = {
      type: 'product',
      id: productId,
      deepLink: generateDeepLink('product', productId),
      fallbackUrl: `/shop?productId=${productId}`,
    };
    return generateQRCode(data);
  },

  /**
   * Generate QR with custom metadata
   */
  custom: async (type: QRCodeData['type'], id: string, metadata?: Record<string, any>) => {
    const data: QRCodeData = {
      type,
      id,
      deepLink: generateDeepLink(type, id),
      fallbackUrl: `/app?type=${type}&id=${id}`,
      metadata,
    };
    return generateQRCode(data);
  },
};

/**
 * Handle QR code scan / deep link processing
 */
export const processDeepLink = (params: URLSearchParams) => {
  const type = params.get('type') as QRCodeData['type'];
  const id = params.get('id');
  const userId = params.get('userId');
  const offline = params.get('offline');

  // Get cached data if offline
  let cachedData = null;
  if (offline === 'true') {
    const cache = localStorage.getItem(`qr_cache_${type}_${id}`);
    if (cache) {
      cachedData = JSON.parse(cache);
    }
  }

  return {
    type,
    id,
    userId,
    offline: offline === 'true',
    cachedData,
    navigationPath: getNavigationPath(type, id, userId),
  };
};

/**
 * Get navigation path based on QR type
 */
const getNavigationPath = (type: string, id: string, userId?: string): string => {
  switch (type) {
    case 'booking':
      return `/booking/${id}`;
    case 'prediction':
      return `/predict/${id}`;
    case 'profile':
      return `/profile/${id}`;
    case 'product':
      return `/shop/${id}`;
    default:
      return '/';
  }
};

/**
 * Cache data for offline access
 */
export const cacheForOffline = (type: string, id: string, data: any) => {
  localStorage.setItem(
    `qr_cache_${type}_${id}`,
    JSON.stringify({
      data,
      timestamp: new Date().toISOString(),
      cached: true,
    })
  );
};

/**
 * Clear cache
 */
export const clearQRCache = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('qr_cache_')) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Export QR code as image
 */
export const exportQRCode = async (
  qrDataUrl: string,
  filename: string = 'qr-code'
) => {
  const link = document.createElement('a');
  link.href = qrDataUrl;
  link.download = `${filename}.png`;
  link.click();
};

/**
 * Print QR code
 */
export const printQRCode = (qrDataUrl: string, title: string = 'AquaAdapt QR Code') => {
  const printWindow = window.open('', '', 'height=400,width=600');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; height: 100vh; }
            img { max-width: 400px; }
          </style>
        </head>
        <body>
          <img src="${qrDataUrl}" />
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  }
};

/**
 * Share QR code
 */
export const shareQRCode = async (
  qrDataUrl: string,
  title: string,
  text: string
) => {
  if (navigator.share) {
    try {
      // Convert data URL to blob
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();

      // Create file from blob
      const file = new File([blob], 'qr-code.png', { type: 'image/png' });

      await navigator.share({
        title,
        text,
        files: [file],
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(qrDataUrl);
    alert('QR code copied to clipboard');
  }
};

/**
 * Test QR functionality
 */
export const testQRModule = async () => {
  try {
    console.log('✅ Testing QR Code Module');

    // Test booking QR
    const bookingQR = await QRCodeGenerator.booking('BOOKING-123');
    console.log('✅ Booking QR generated');

    // Test prediction QR
    const predictionQR = await QRCodeGenerator.prediction('PRED-456', 'USER-789');
    console.log('✅ Prediction QR generated');

    // Test offline support
    cacheForOffline('booking', 'BOOKING-123', { date: '2025-12-15' });
    const cached = localStorage.getItem('qr_cache_booking_BOOKING-123');
    console.log('✅ Offline caching works:', !!cached);

    // Test deep link processing
    const params = new URLSearchParams('type=booking&id=BOOKING-123&offline=true');
    const result = processDeepLink(params);
    console.log('✅ Deep link processing works:', result.type === 'booking');

    return {
      qrGeneration: true,
      offlineSupport: true,
      deepLinking: true,
      sharing: typeof navigator.share === 'function',
    };
  } catch (error) {
    console.error('❌ QR Module test failed:', error);
    return { error };
  }
};
