/**
 * QR Code Display Component
 * Shows QR code for bookings, predictions, and products
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeGenerator, exportQRCode, printQRCode, shareQRCode, cacheForOffline } from '@/lib/qrCodeIntegration';
import { Download, Printer, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeDisplayProps {
  type: 'booking' | 'prediction' | 'profile' | 'product';
  id: string;
  title: string;
  description?: string;
  data?: Record<string, any>;
  userId?: string;
}

const QRCodeDisplay = ({
  type,
  id,
  title,
  description,
  data,
  userId,
}: QRCodeDisplayProps) => {
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      try {
        let qrData;

        // Generate QR based on type
        switch (type) {
          case 'booking':
            qrData = await QRCodeGenerator.booking(id);
            break;
          case 'prediction':
            qrData = await QRCodeGenerator.prediction(id, userId || '');
            break;
          case 'profile':
            qrData = await QRCodeGenerator.profile(id);
            break;
          case 'product':
            qrData = await QRCodeGenerator.product(id);
            break;
          default:
            qrData = await QRCodeGenerator.custom(type, id, data);
        }

        setQRCode(qrData);

        // Cache for offline access
        if (data) {
          cacheForOffline(type, id, data);
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
        toast.error('Failed to generate QR code');
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [type, id, userId, data]);

  const handleCopy = async () => {
    if (qrCode) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  const handleDownload = async () => {
    if (qrCode) {
      try {
        await exportQRCode(qrCode, `${type}-${id}`);
        toast.success('QR code downloaded!');
      } catch (error) {
        toast.error('Failed to download QR code');
      }
    }
  };

  const handlePrint = () => {
    if (qrCode) {
      printQRCode(qrCode, `${title} - QR Code`);
      toast.success('Opening print dialog...');
    }
  };

  const handleShare = async () => {
    if (qrCode) {
      try {
        await shareQRCode(
          qrCode,
          title,
          `Scan this QR code to access ${title} on AquaAdapt`
        );
      } catch (error) {
        toast.error('Failed to share QR code');
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          🔗 {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* QR Code Display */}
        {loading ? (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="animate-spin">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          </div>
        ) : qrCode ? (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <img src={qrCode} alt={title} className="w-64 h-64" />
            </div>

            <p className="text-xs text-muted-foreground text-center">
              📱 Scan with phone camera or QR code reader<br/>
              🌐 Works even if app is offline
            </p>
          </div>
        ) : (
          <div className="text-center text-red-500">Failed to generate QR code</div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
            disabled={!qrCode}
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
            disabled={!qrCode}
          >
            <Download className="w-4 h-4" />
            Download
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-2"
            disabled={!qrCode}
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
            disabled={!qrCode}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-sm mb-2">💡 How to Use:</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>✓ Share QR code via WhatsApp, Email, or SMS</li>
            <li>✓ Print for physical cards or posters</li>
            <li>✓ Works offline - data cached on first scan</li>
            <li>✓ Valid indefinitely - no expiration</li>
          </ul>
        </div>

        {/* ID Display */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-muted-foreground mb-1">ID:</p>
          <p className="text-sm font-mono break-all">{id}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
