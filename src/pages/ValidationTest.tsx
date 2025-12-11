/**
 * ML Model Validation & Testing Page
 * Run comprehensive tests, generate reports, and visualize model accuracy
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { 
  validationTestCases,
  generateValidationReport,
  generateComprehensiveReport,
  exportComprehensiveReportJSON,
  exportComprehensiveReportCSV,
  type ValidationResult,
  type ComprehensiveReport,
} from '@/lib/mlValidation';
import { predictGreywater, type HouseholdInput } from '@/lib/mlPrediction';
import { Download, Play, BarChart3, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function ValidationTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [report, setReport] = useState<ComprehensiveReport | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const runValidationTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    setReport(null);

    try {
      const validationResults: ValidationResult[] = [];
      const totalTests = validationTestCases.length;

      for (let i = 0; i < totalTests; i++) {
        const testCase = validationTestCases[i];

        try {
          // Prepare input for prediction
          const input: HouseholdInput = {
            state: testCase.state,
            district: testCase.district,
            bhk: testCase.bhk.toString(),
            bathrooms: testCase.bathrooms,
            children: testCase.children,
            midAge: testCase.midAge,
            older: testCase.older,
            tankCapacity: 1000,
            filterInstallDate: new Date(),
            currentFilterUsage: 0,
          };

          // Get prediction
          const prediction = predictGreywater(input);
          const predicted = prediction.dailyGreyWaterProduction;
          const actual = testCase.actualDailyGreyWater;

          // Calculate metrics
          const errorMargin = Math.abs(predicted - actual);
          const errorPercentage = (errorMargin / actual) * 100;
          const accuracy = Math.max(0, 100 - errorPercentage);
          const passed = errorPercentage <= 10; // 10% tolerance

          validationResults.push({
            testCaseId: testCase.id,
            testCaseName: testCase.name,
            predictedDailyGreyWater: Math.round(predicted * 100) / 100,
            actualDailyGreyWater: actual,
            errorMargin: Math.round(errorMargin * 100) / 100,
            errorPercentage: Math.round(errorPercentage * 100) / 100,
            accuracy: Math.round(accuracy * 100) / 100,
            passed,
            notes: errorPercentage > 15 
              ? 'Significant deviation - review model for region' 
              : errorPercentage > 10 
              ? 'Minor deviation - acceptable' 
              : 'Excellent match',
          });

          // Update progress
          setProgress(((i + 1) / totalTests) * 100);
        } catch (error) {
          console.error(`Error testing ${testCase.id}:`, error);
          validationResults.push({
            testCaseId: testCase.id,
            testCaseName: testCase.name,
            predictedDailyGreyWater: 0,
            actualDailyGreyWater: testCase.actualDailyGreyWater,
            errorMargin: 0,
            errorPercentage: 0,
            accuracy: 0,
            passed: false,
            notes: 'Test execution error',
          });
        }
      }

      setResults(validationResults);

      // Generate comprehensive report
      const comprehensiveReport = generateComprehensiveReport(validationResults, validationTestCases);
      setReport(comprehensiveReport);

      toast.success(`✅ Validation complete! ${validationResults.filter(r => r.passed).length}/${totalTests} tests passed`);
    } catch (error) {
      console.error('Error running validation tests:', error);
      toast.error('Error running validation tests');
    } finally {
      setIsRunning(false);
      setProgress(0);
    }
  };

  const exportJSON = () => {
    if (!report) {
      toast.error('No report generated yet');
      return;
    }

    const json = exportComprehensiveReportJSON(report);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported as JSON');
  };

  const exportCSV = () => {
    if (!report) {
      toast.error('No report generated yet');
      return;
    }

    const csv = exportComprehensiveReportCSV(report);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported as CSV');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 text-primary text-sm mb-4">
              <BarChart3 className="w-4 h-4" />
              ML Model Validation
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Model Accuracy Testing
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Run comprehensive validation tests on {validationTestCases.length} real-world household scenarios to verify model accuracy
            </p>
          </div>

          {/* Control Section */}
          {!report && (
            <Card className="mb-8 border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Test Coverage</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-2xl font-bold text-primary">{validationTestCases.length}</div>
                        <div className="text-muted-foreground">Test Cases</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-500">28</div>
                        <div className="text-muted-foreground">States</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-500">3</div>
                        <div className="text-muted-foreground">Regions</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-500">1-8</div>
                        <div className="text-muted-foreground">Family Size</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={runValidationTests}
                      disabled={isRunning}
                      className="gap-2"
                      size="lg"
                    >
                      <Play className="w-4 h-4" />
                      {isRunning ? `Running... ${Math.round(progress)}%` : 'Run Validation Tests'}
                    </Button>
                  </div>

                  {isRunning && (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Processing {Math.round(progress)}% of tests...
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Report Section */}
          {report && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {report.summary.totalTests}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Tests</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2 flex items-center justify-center gap-2">
                        <CheckCircle className="w-6 h-6" />
                        {report.summary.passedTests}
                      </div>
                      <div className="text-sm text-green-700">Passed</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2 flex items-center justify-center gap-2">
                        <AlertCircle className="w-6 h-6" />
                        {report.summary.failedTests}
                      </div>
                      <div className="text-sm text-orange-700">Failed</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-2">
                        <Zap className="w-6 h-6" />
                        {report.summary.averageAccuracy}
                      </div>
                      <div className="text-sm text-blue-700">Avg Accuracy</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Model Status Badge */}
              <Card className={`border-2 ${
                report.modelStatus === 'production-ready' ? 'border-green-200 bg-green-50' :
                report.modelStatus === 'needs-improvement' ? 'border-yellow-200 bg-yellow-50' :
                'border-orange-200 bg-orange-50'
              }`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${
                      report.modelStatus === 'production-ready' ? 'bg-green-500' :
                      report.modelStatus === 'needs-improvement' ? 'bg-yellow-500' :
                      'bg-orange-500'
                    }`} />
                    <h3 className="font-semibold text-lg">
                      {report.modelStatus === 'production-ready' ? '✅ Production Ready' :
                       report.modelStatus === 'needs-improvement' ? '⚠️ Needs Improvement' :
                       '🔬 Experimental'}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {report.modelStatus === 'production-ready' && 'Model demonstrates excellent accuracy and is ready for production deployment.'}
                    {report.modelStatus === 'needs-improvement' && 'Model shows good potential but requires further optimization for production use.'}
                    {report.modelStatus === 'experimental' && 'Model is still in experimental phase and needs significant improvements.'}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Pass Rate</div>
                      <div className="font-semibold">{report.summary.passRate}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Confidence Level</div>
                      <div className="font-semibold">{report.summary.confidenceLevel}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Accuracy Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Mean Absolute Error (L)</p>
                        <p className="text-2xl font-bold">{report.metrics.mae}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Mean Absolute % Error</p>
                        <p className="text-2xl font-bold">{report.metrics.mape}%</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">RMSE (L)</p>
                        <p className="text-2xl font-bold">{report.metrics.rmse}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Median Error (L)</p>
                        <p className="text-2xl font-bold">{report.metrics.medianError}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">R² Score</p>
                        <p className="text-2xl font-bold">{report.metrics.r2Score}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Std Deviation (L)</p>
                        <p className="text-2xl font-bold">{report.metrics.stdDeviation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Regional Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Regional Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">State</th>
                          <th className="text-center py-2">Passed</th>
                          <th className="text-center py-2">Total</th>
                          <th className="text-right py-2">Accuracy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(report.regionAnalysis).map(([state, data]) => (
                          <tr key={state} className="border-b hover:bg-muted/50">
                            <td className="py-2">{state}</td>
                            <td className="text-center">{data.passed}</td>
                            <td className="text-center">{data.total}</td>
                            <td className="text-right font-semibold">{data.accuracy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Category Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(report.categoryAnalysis).map(([category, data]) => (
                      <div key={category} className="p-4 rounded-lg bg-muted">
                        <h4 className="font-semibold mb-2">{category}</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Passed</div>
                            <div className="font-bold">{data.passed}/{data.total}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Accuracy</div>
                            <div className="font-bold">{data.accuracy}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-blue-900 flex gap-2">
                        <span>•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Test Results Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs md:text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2">Test Case</th>
                          <th className="text-right py-2 px-2">Predicted (L)</th>
                          <th className="text-right py-2 px-2">Actual (L)</th>
                          <th className="text-right py-2 px-2">Error %</th>
                          <th className="text-right py-2 px-2">Accuracy %</th>
                          <th className="text-center py-2 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.testResults.map((result) => (
                          <tr
                            key={result.testCaseId}
                            className={`border-b hover:bg-muted/50 cursor-pointer ${
                              selectedTest === result.testCaseId ? 'bg-primary/10' : ''
                            }`}
                            onClick={() => setSelectedTest(selectedTest === result.testCaseId ? null : result.testCaseId)}
                          >
                            <td className="py-2 px-2 font-medium">{result.testCaseName}</td>
                            <td className="py-2 px-2 text-right">{result.predictedDailyGreyWater}</td>
                            <td className="py-2 px-2 text-right">{result.actualDailyGreyWater}</td>
                            <td className="py-2 px-2 text-right">{result.errorPercentage.toFixed(2)}%</td>
                            <td className="py-2 px-2 text-right font-semibold">{result.accuracy.toFixed(2)}%</td>
                            <td className="py-2 px-2 text-center">
                              {result.passed ? (
                                <span className="text-green-600 font-bold">✓</span>
                              ) : (
                                <span className="text-red-600 font-bold">✗</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Export Buttons */}
              <div className="flex gap-4 justify-center pb-8">
                <Button onClick={exportJSON} variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export JSON
                </Button>
                <Button onClick={exportCSV} variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
                <Button
                  onClick={() => {
                    setReport(null);
                    setResults([]);
                  }}
                  className="gap-2"
                >
                  <Play className="w-4 h-4" />
                  Run Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
