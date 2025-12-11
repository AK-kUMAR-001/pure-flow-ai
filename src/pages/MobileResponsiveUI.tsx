/**
 * Mobile Responsive UI Optimization Component
 * Responsive design for all devices with PWA support
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { 
  Smartphone, Tablet, Monitor, Wifi, AlertCircle, Download, CheckCircle,
  ArrowRight, Lock, Zap, Share2
} from 'lucide-react';
import { toast } from 'sonner';

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  width: number;
  height: number;
  isTouchDevice: boolean;
  isOnline: boolean;
  isPWACapable: boolean;
}

const MobileResponsiveUI = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect device info
    detectDevice();

    // Listen for PWA install prompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for online/offline
    window.addEventListener('online', () => {
      setDeviceInfo(prev => prev ? { ...prev, isOnline: true } : null);
      toast.success('Connection restored');
    });
    window.addEventListener('offline', () => {
      setDeviceInfo(prev => prev ? { ...prev, isOnline: false } : null);
      toast.error('You are offline');
    });

    // Check if already installed
    checkIfInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const detectDevice = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouchDevice = () => {
      return (
        (typeof window !== 'undefined' &&
          ('ontouchstart' in window ||
            ((window as any).DocumentTouch && document instanceof (window as any).DocumentTouch))) ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      );
    };

    let deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown' = 'unknown';
    if (width < 768) deviceType = 'mobile';
    else if (width < 1024) deviceType = 'tablet';
    else deviceType = 'desktop';

    setDeviceInfo({
      type: deviceType,
      width,
      height,
      isTouchDevice: isTouchDevice(),
      isOnline: navigator.onLine,
      isPWACapable: 'serviceWorker' in navigator,
    });
  };

  const handleBeforeInstallPrompt = (e: any) => {
    e.preventDefault();
    setDeferredPrompt(e);
  };

  const handleAppInstalled = () => {
    setDeferredPrompt(null);
    setIsInstalled(true);
    toast.success('AquaAdapt app installed successfully!');
  };

  const checkIfInstalled = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      toast.error('Installation not available on this device');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstalled(true);
      toast.success('App installing...');
    } else {
      toast.error('Installation cancelled');
    }
  };

  const handleRegisterServiceWorker = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        toast.success('Service Worker registered for offline support');
        console.log('SW registration successful:', registration);
      }
    } catch (error) {
      console.error('SW registration failed:', error);
      toast.error('Failed to register service worker');
    }
  };

  const testResponsiveness = () => {
    toast.success(`Current device: ${deviceInfo?.type} (${deviceInfo?.width}x${deviceInfo?.height})`);
  };

  const downloadPWAGuide = () => {
    const guide = `
AquaAdapt - Progressive Web App Installation Guide
=====================================================

DESKTOP (Windows/Mac/Linux):
1. Open https://aquaadapt.app in Chrome, Edge, or Brave browser
2. Click the install icon (usually top-right of address bar)
3. Click "Install" in the popup
4. App will be installed and available in your applications

ANDROID PHONE:
1. Open https://aquaadapt.app in Chrome browser
2. Tap the menu (three dots) → "Install app"
3. Confirm installation
4. App will appear on your home screen

iPHONE/iPAD (iOS 16.4+):
1. Open https://aquaadapt.app in Safari
2. Tap Share → "Add to Home Screen"
3. Enter name (or use default)
4. Tap "Add"
5. App will appear on your home screen

FEATURES WHEN INSTALLED:
✓ Fullscreen experience (no browser UI)
✓ Works offline (cached content)
✓ Faster loading times
✓ Native-like feel
✓ Home screen icon
✓ Access from app launcher
✓ Notification support (when enabled)

STORAGE REQUIREMENTS:
- Minimum: 5 MB
- Recommended: 20 MB
- Data usage: Minimal (only syncs when online)

OFFLINE FEATURES:
- View cached pages
- Access bookings history
- Read saved predictions
- Use local water usage calculator

SYSTEM REQUIREMENTS:
- Android: 5.0+ (Chrome, Firefox, Edge)
- iOS: 16.4+ (Safari only)
- Windows: 10+ (Chrome, Edge)
- Mac: 10.13+ (Chrome, Safari)
- Linux: Recent versions (Chrome, Firefox)
    `.trim();

    const blob = new Blob([guide], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PWA-Installation-Guide.txt';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Guide downloaded!');
  };

  if (!deviceInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Mobile App Experience
            </h1>
            <p className="text-muted-foreground">
              Optimized responsive design for all your devices
            </p>
          </div>

          {/* Device Detection Card */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Your Device
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Device Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Type:</span>{' '}
                      <span className="capitalize">{deviceInfo.type}</span>
                    </p>
                    <p>
                      <span className="font-medium">Resolution:</span>{' '}
                      {deviceInfo.width}×{deviceInfo.height}px
                    </p>
                    <p>
                      <span className="font-medium">Touch Input:</span>{' '}
                      {deviceInfo.isTouchDevice ? '✓ Supported' : '✗ Not available'}
                    </p>
                    <p>
                      <span className="font-medium">Connection:</span>{' '}
                      <span className={deviceInfo.isOnline ? 'text-green-600' : 'text-red-600'}>
                        {deviceInfo.isOnline ? '🟢 Online' : '🔴 Offline'}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">PWA Capabilities</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">PWA Ready:</span>{' '}
                      {deviceInfo.isPWACapable ? '✓ Yes' : '✗ No'}
                    </p>
                    <p>
                      <span className="font-medium">Installation:</span>{' '}
                      {isInstalled ? (
                        <span className="text-green-600">✓ Installed</span>
                      ) : deferredPrompt ? (
                        <span className="text-blue-600">⚙ Available</span>
                      ) : (
                        <span className="text-gray-600">✗ Not available</span>
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Service Worker:</span>{' '}
                      {navigator.serviceWorker.controller ? '✓ Active' : '✗ Inactive'}
                    </p>
                    <p>
                      <span className="font-medium">Storage:</span> Local & IndexedDB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <Button 
                  onClick={testResponsiveness}
                  variant="outline"
                  className="gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  Test Responsiveness
                </Button>
                {deferredPrompt && !isInstalled && (
                  <Button 
                    onClick={handleInstallApp}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4" />
                    Install App
                  </Button>
                )}
                <Button 
                  onClick={downloadPWAGuide}
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Installation Guide
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Responsive Breakpoints */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile (320px - 767px)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p className="font-semibold mb-2">Optimizations:</p>
                  <ul className="space-y-1 text-xs">
                    <li>✓ Single column layout</li>
                    <li>✓ Large touch targets (48px minimum)</li>
                    <li>✓ Full-width buttons and inputs</li>
                    <li>✓ Simplified navigation menu</li>
                    <li>✓ Optimized images (max 1x pixel density)</li>
                    <li>✓ Vertical scrolling prioritized</li>
                    <li>✓ Readable text (16px minimum)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tablet className="h-5 w-5" />
                  Tablet (768px - 1023px)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p className="font-semibold mb-2">Optimizations:</p>
                  <ul className="space-y-1 text-xs">
                    <li>✓ Two column layout</li>
                    <li>✓ Balanced spacing</li>
                    <li>✓ Side navigation available</li>
                    <li>✓ Medium-sized touch targets (44px)</li>
                    <li>✓ Optimized images (1.5x pixel density)</li>
                    <li>✓ Multi-touch gestures supported</li>
                    <li>✓ Split view support</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Desktop (1024px+)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p className="font-semibold mb-2">Optimizations:</p>
                  <ul className="space-y-1 text-xs">
                    <li>✓ Multi-column layout</li>
                    <li>✓ Sidebar navigation</li>
                    <li>✓ Hover effects enabled</li>
                    <li>✓ Keyboard shortcuts</li>
                    <li>✓ Advanced data tables</li>
                    <li>✓ 2x/3x pixel density images</li>
                    <li>✓ Mouse and keyboard optimal</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Offline Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p className="font-semibold mb-2">Features:</p>
                  <ul className="space-y-1 text-xs">
                    <li>✓ Caches app shell (HTML/CSS/JS)</li>
                    <li>✓ Stores booking history locally</li>
                    <li>✓ Saves water predictions</li>
                    <li>✓ Syncs when back online</li>
                    <li>✓ 20 MB cache storage</li>
                    <li>✓ Offline indicator shown</li>
                    <li>✓ Graceful degradation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* PWA Features */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Progressive Web App Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">App-like Experience</h4>
                      <p className="text-sm text-muted-foreground">Installable on home screen, works like native app</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Offline Functionality</h4>
                      <p className="text-sm text-muted-foreground">Service Worker caches essential content</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Fast Loading</h4>
                      <p className="text-sm text-muted-foreground">Cached assets load instantly (&lt;1 second)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Secure (HTTPS)</h4>
                      <p className="text-sm text-muted-foreground">Encrypted communication and data protection</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Responsive Design</h4>
                      <p className="text-sm text-muted-foreground">Perfect on any device size and orientation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Share Functionality</h4>
                      <p className="text-sm text-muted-foreground">Share app link with native share sheet</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Low Data Mode</h4>
                      <p className="text-sm text-muted-foreground">Optimized images and minimal data usage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Booking confirmations and water alerts</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Touch Optimization */}
          <Card>
            <CardHeader>
              <CardTitle>Touch & Gesture Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Tap Targets</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Minimum 48×48 pixels</li>
                      <li>• Adequate spacing between targets</li>
                      <li>• Clear hover/active states</li>
                      <li>• No accidental clicks</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Gestures Supported</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Tap (single click)</li>
                      <li>• Long press (context menu)</li>
                      <li>• Swipe (navigate pages)</li>
                      <li>• Pinch (zoom images)</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>💡 Tip:</strong> Try tapping, long-pressing, and swiping on various elements to experience the full touch-optimized interface.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MobileResponsiveUI;
