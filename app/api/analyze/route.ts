import { analyzeContractWithAMD } from '@/lib/amd_ai_engine';
import { calculateRiskMetrics } from '@/lib/risk_engine';

export async function POST(request: Request) {
  try {
    const { contractText, contractName } = await request.json();

    if (!contractText) {
      return Response.json(
        { error: 'Contract text is required' },
        { status: 400 }
      );
    }

    // Analyze contract
    const amdResult = await analyzeContractWithAMD(contractText);

    // Calculate risk metrics
    const riskMetrics = calculateRiskMetrics(
      contractText,
      amdResult.clauses,
      amdResult.risks
    );

    return Response.json({
      success: true,
      contractName,
      analysis: amdResult,
      metrics: riskMetrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json(
      { error: 'Failed to analyze contract' },
      { status: 500 }
    );
  }
}
