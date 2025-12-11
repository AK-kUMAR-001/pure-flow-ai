/**
 * Home Test Analyzer Page
 * Allows users to manually enter water quality parameters
 * and get filter material recommendations
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import ContactButtons from "@/components/ContactButtons";
import PaymentGateway from "@/components/PaymentGateway";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Droplets,
  FlaskConical,
  Activity,
  Gauge,
  HardDrive,
  Cpu,
  CheckCircle2,
  Sparkles,
  Leaf,
  CircleDot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

// Filter material recommendations based on water quality
interface FilterRecommendation {
  material: string;
  percentage: number;
  purpose: string;
  icon: React.ElementType;
}

const HomeTest = () => {
  const { t } = useLanguage();
  
  // Form state
  const [ph, setPh] = useState<string>("");
  const [tds, setTds] = useState<string>("");
  const [turbidity, setTurbidity] = useState<"low" | "medium" | "high" | "">("");
  const [hasHardness, setHasHardness] = useState<"yes" | "no" | "">("");
  const [hasSoftness, setHasSoftness] = useState<"yes" | "no" | "">("");
  const [hasBiological, setHasBiological] = useState<"yes" | "no" | "">("");
  
  // Results state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<FilterRecommendation[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  
  // Payment state
  const [showPayment, setShowPayment] = useState(false);
  const [selectedFilterPrice, setSelectedFilterPrice] = useState(100);

  /**
   * Validate pH input (0-14 range)
   */
  const handlePhChange = (value: string) => {
    const numValue = parseFloat(value);
    if (value === "" || (numValue >= 0 && numValue <= 14)) {
      setPh(value);
    } else if (numValue > 14) {
      setPh("14");
      toast.error("pH cannot exceed 14");
    } else if (numValue < 0) {
      setPh("0");
      toast.error("pH cannot be less than 0");
    }
  };

  /**
   * Analyze water quality and generate filter recommendations
   * Using: Water Hyacinth, Banana Fiber, Activated Carbon, Alumina Nano Beads
   */
  const analyzeWater = () => {
    // Validate inputs
    if (!ph || !tds || !turbidity || !hasHardness || !hasSoftness || !hasBiological) {
      toast.error("Please fill all parameters");
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);

    // Simulate analysis delay
    setTimeout(() => {
      const phValue = parseFloat(ph);
      const tdsValue = parseInt(tds);
      
      // Initialize percentages for each material
      let waterHyacinthScore = 0;
      let bananaFiberScore = 0;
      let activatedCarbonScore = 0;
      let aluminaNanoBeadsScore = 0;
      let score = 100;

      // pH analysis (ideal: 6.5-8.5)
      if (phValue < 6.5) {
        // Acidic water - Alumina helps neutralize
        aluminaNanoBeadsScore += 30;
        activatedCarbonScore += 15;
        score -= 15;
      } else if (phValue > 8.5) {
        // Alkaline water - Natural fibers help
        waterHyacinthScore += 25;
        bananaFiberScore += 20;
        score -= 10;
      } else {
        // Balanced pH - equal distribution
        waterHyacinthScore += 10;
        activatedCarbonScore += 10;
      }

      // TDS analysis (ideal: <500 ppm)
      if (tdsValue > 500) {
        // High TDS - Activated carbon and alumina
        activatedCarbonScore += 35;
        aluminaNanoBeadsScore += 25;
        score -= 20;
      } else if (tdsValue > 300) {
        activatedCarbonScore += 25;
        waterHyacinthScore += 15;
        score -= 10;
      } else {
        activatedCarbonScore += 15;
        waterHyacinthScore += 10;
      }

      // Turbidity analysis
      if (turbidity === "high") {
        // High turbidity - Natural fibers excel
        waterHyacinthScore += 35;
        bananaFiberScore += 30;
        score -= 25;
      } else if (turbidity === "medium") {
        waterHyacinthScore += 20;
        bananaFiberScore += 15;
        score -= 10;
      } else {
        waterHyacinthScore += 10;
        bananaFiberScore += 10;
      }

      // Hardness analysis
      if (hasHardness === "yes") {
        // Hard water - Alumina nano beads effective
        aluminaNanoBeadsScore += 30;
        activatedCarbonScore += 15;
        score -= 15;
      }

      // Softness analysis
      if (hasSoftness === "yes") {
        // Soft water - Natural fibers balance
        waterHyacinthScore += 20;
        bananaFiberScore += 15;
        score -= 10;
      }

      // Biological contaminants analysis
      if (hasBiological === "yes") {
        // Biological issues - Activated carbon primary
        activatedCarbonScore += 40;
        waterHyacinthScore += 20;
        score -= 20;
      }

      // Calculate total and normalize to 100%
      const totalScore = waterHyacinthScore + bananaFiberScore + activatedCarbonScore + aluminaNanoBeadsScore;
      
      // Round to nearest 5% for clean display
      const roundToFive = (num: number) => Math.round(num / 5) * 5;
      
      let waterHyacinthPct = roundToFive((waterHyacinthScore / totalScore) * 100);
      let bananaFiberPct = roundToFive((bananaFiberScore / totalScore) * 100);
      let activatedCarbonPct = roundToFive((activatedCarbonScore / totalScore) * 100);
      let aluminaNanoBeadsPct = roundToFive((aluminaNanoBeadsScore / totalScore) * 100);
      
      // Adjust to ensure total is 100%
      const total = waterHyacinthPct + bananaFiberPct + activatedCarbonPct + aluminaNanoBeadsPct;
      if (total !== 100) {
        const diff = 100 - total;
        // Add difference to the largest percentage
        const max = Math.max(waterHyacinthPct, bananaFiberPct, activatedCarbonPct, aluminaNanoBeadsPct);
        if (waterHyacinthPct === max) waterHyacinthPct += diff;
        else if (bananaFiberPct === max) bananaFiberPct += diff;
        else if (activatedCarbonPct === max) activatedCarbonPct += diff;
        else aluminaNanoBeadsPct += diff;
      }

      const recs: FilterRecommendation[] = [
        {
          material: t.homeTest.waterHyacinth,
          percentage: waterHyacinthPct,
          purpose: "Natural absorption of organic matter and heavy metals",
          icon: Leaf,
        },
        {
          material: t.homeTest.bananaFiber,
          percentage: bananaFiberPct,
          purpose: "Biodegradable filtration for particles and sediments",
          icon: Leaf,
        },
        {
          material: t.homeTest.activatedCarbon,
          percentage: activatedCarbonPct,
          purpose: "Removes chlorine, odor, and organic compounds",
          icon: CircleDot,
        },
        {
          material: t.homeTest.aluminaNanoBeads,
          percentage: aluminaNanoBeadsPct,
          purpose: "Advanced filtration for fluoride and arsenic removal",
          icon: Sparkles,
        },
      ];

      // Sort by percentage descending
      recs.sort((a, b) => b.percentage - a.percentage);

      setRecommendations(recs);
      setOverallScore(Math.max(score, 20));
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  /**
   * Reset form and results
   */
  const resetForm = () => {
    setPh("");
    setTds("");
    setTurbidity("");
    setHasHardness("");
    setHasSoftness("");
    setHasBiological("");
    setShowResults(false);
    setRecommendations([]);
  };

  /**
   * Get quality status based on score
   */
  const getQualityStatus = () => {
    if (overallScore >= 80) return { label: "Good", color: "text-leaf-green", bg: "bg-leaf-green" };
    if (overallScore >= 60) return { label: "Moderate", color: "text-warning-orange", bg: "bg-warning-orange" };
    return { label: "Poor", color: "text-error-red", bg: "bg-error-red" };
  };

  const isFormValid = ph && tds && turbidity && hasHardness && hasSoftness && hasBiological;

  return (
    <div className="min-h-screen bg-light-blue/20">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-primary water-bg relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <FlaskConical className="h-5 w-5 text-aqua-accent" />
              <span className="text-white text-sm">Home Water Test Kit</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t.homeTest.title}
            </h1>
            <p className="text-white/80">
              {t.homeTest.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-aqua-accent" />
                    Enter Test Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* pH Level */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-ocean-blue" />
                      {t.homeTest.phLabel}
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      placeholder={t.homeTest.phPlaceholder}
                      value={ph}
                      onChange={(e) => handlePhChange(e.target.value)}
                      className="neumorphic-input"
                    />
                    <p className="text-xs text-muted-foreground">{t.homeTest.phIdeal}</p>
                  </div>

                  {/* TDS */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-ocean-blue" />
                      {t.homeTest.tdsLabel}
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder={t.homeTest.tdsPlaceholder}
                      value={tds}
                      onChange={(e) => setTds(e.target.value)}
                      className="neumorphic-input"
                    />
                    <p className="text-xs text-muted-foreground">{t.homeTest.tdsIdeal}</p>
                  </div>

                  {/* Turbidity */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-ocean-blue" />
                      {t.homeTest.turbidity}
                    </Label>
                    <RadioGroup
                      value={turbidity}
                      onValueChange={(val) => setTurbidity(val as "low" | "medium" | "high")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="turb-low" />
                        <Label htmlFor="turb-low" className="cursor-pointer">{t.homeTest.low}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="turb-medium" />
                        <Label htmlFor="turb-medium" className="cursor-pointer">{t.homeTest.medium}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="turb-high" />
                        <Label htmlFor="turb-high" className="cursor-pointer">{t.homeTest.high}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Hardness */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-ocean-blue" />
                      {t.homeTest.hardness}
                      <span className="text-xs text-muted-foreground">{t.homeTest.hardnessHint}</span>
                    </Label>
                    <RadioGroup
                      value={hasHardness}
                      onValueChange={(val) => setHasHardness(val as "yes" | "no")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="hard-yes" />
                        <Label htmlFor="hard-yes" className="cursor-pointer">{t.homeTest.yes}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="hard-no" />
                        <Label htmlFor="hard-no" className="cursor-pointer">{t.homeTest.no}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Softness */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-ocean-blue" />
                      {t.homeTest.softness}
                      <span className="text-xs text-muted-foreground">{t.homeTest.softnessHint}</span>
                    </Label>
                    <RadioGroup
                      value={hasSoftness}
                      onValueChange={(val) => setHasSoftness(val as "yes" | "no")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="soft-yes" />
                        <Label htmlFor="soft-yes" className="cursor-pointer">{t.homeTest.yes}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="soft-no" />
                        <Label htmlFor="soft-no" className="cursor-pointer">{t.homeTest.no}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Biological Contaminants */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-ocean-blue" />
                      {t.homeTest.biological}
                      <span className="text-xs text-muted-foreground">{t.homeTest.biologicalHint}</span>
                    </Label>
                    <RadioGroup
                      value={hasBiological}
                      onValueChange={(val) => setHasBiological(val as "yes" | "no")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="bio-yes" />
                        <Label htmlFor="bio-yes" className="cursor-pointer">{t.homeTest.yes}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="bio-no" />
                        <Label htmlFor="bio-no" className="cursor-pointer">{t.homeTest.no}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="cta"
                      onClick={analyzeWater}
                      disabled={!isFormValid || isAnalyzing}
                      className="flex-1 gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          {t.homeTest.analyzing}
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          {t.homeTest.analyze}
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      {t.homeTest.reset}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {!showResults ? (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card variant="elevated" className="h-full flex items-center justify-center min-h-[500px]">
                      <CardContent className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-aqua-accent/10 rounded-full flex items-center justify-center">
                          <Droplets className="h-12 w-12 text-aqua-accent animate-float" />
                        </div>
                        <h3 className="text-xl font-semibold text-deep-blue mb-2">
                          {t.homeTest.ready}
                        </h3>
                        <p className="text-muted-foreground max-w-sm">
                          {t.homeTest.readyDesc}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card variant="elevated">
                      <CardHeader className="bg-gradient-primary text-white rounded-t-xl">
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            {t.homeTest.results}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm ${getQualityStatus().bg}`}>
                            {getQualityStatus().label}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        {/* Quality Score */}
                        <div className="text-center">
                          <div className="relative inline-flex">
                            <svg className="w-32 h-32 transform -rotate-90">
                              <circle
                                cx="64"
                                cy="64"
                                r="56"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="8"
                              />
                              <circle
                                cx="64"
                                cy="64"
                                r="56"
                                fill="none"
                                stroke="hsl(var(--aqua-accent))"
                                strokeWidth="8"
                                strokeDasharray={`${(overallScore / 100) * 352} 352`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-3xl font-bold text-deep-blue">{overallScore}%</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">Water Quality Score</p>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <h4 className="font-semibold text-deep-blue mb-4 flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-leaf-green" />
                            {t.homeTest.recommendations}
                          </h4>
                          <div className="space-y-4">
                            {recommendations.map((rec, index) => (
                              <motion.div
                                key={rec.material}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-light-blue/30 rounded-xl p-4"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                      <rec.icon className="h-5 w-5 text-leaf-green" />
                                    </div>
                                    <span className="font-medium text-deep-blue">{rec.material}</span>
                                  </div>
                                  <span className="text-2xl font-bold text-aqua-accent">{rec.percentage}%</span>
                                </div>
                                <div className="w-full bg-white rounded-full h-2 mb-2">
                                  <div
                                    className="bg-gradient-cta h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${rec.percentage}%` }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground">{rec.purpose}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                          {!showPayment ? (
                            <>
                              <Button 
                                variant="cta" 
                                className="flex-1"
                                onClick={() => {
                                  setShowPayment(true);
                                  setSelectedFilterPrice(100); // Default cartridge price
                                }}
                              >
                                {t.common?.orderCartridge || "Order Your Cartridge"}
                              </Button>
                              <Button variant="outline" onClick={resetForm}>
                                {t.common?.newTest || "New Test"}
                              </Button>
                            </>
                          ) : (
                            <>
                              <PaymentGateway
                                amount={selectedFilterPrice}
                                filterId={`filter-${overallScore}`}
                                onPaymentSuccess={() => {
                                  setShowPayment(false);
                                  toast.success(t.common?.paymentSuccess || "Payment Successful! Your cartridge order has been confirmed. Our team will contact you shortly for setup.");
                                  resetForm();
                                }}
                                onClose={() => setShowPayment(false)}
                              />
                              <Button variant="outline" onClick={() => setShowPayment(false)}>
                                {t.common?.cancel || "Cancel"}
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
      <ContactButtons />
    </div>
  );
};

export default HomeTest;
