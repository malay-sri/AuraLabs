/**
 * AURA LifeScore Engine
 * Calculates a financial wellness score out of 1000.
 */

console.log("LifeScore Loaded");
function calculateLifeScore(customer) {
    let score = 0;

    const breakdown = {
        incomeStability: 0,
        savingsRatio: 0,
        investmentDiscipline: 0,
        emergencyFund: 0,
        goalProgress: 0,
        spendingBehaviour: 0,
    };

    // 1. Income Stability (200)
    if (customer.monthly_income >= 50000) {
        breakdown.incomeStability = 200;
    } else if (customer.monthly_income >= 30000) {
        breakdown.incomeStability = 150;
    } else {
        breakdown.incomeStability = 100;
    }

    // 2. Savings Ratio (200)
    const savingsRatio =
        (customer.monthly_savings / customer.monthly_income) * 100;

    if (savingsRatio >= 30) {
        breakdown.savingsRatio = 200;
    } else if (savingsRatio >= 20) {
        breakdown.savingsRatio = 170;
    } else if (savingsRatio >= 10) {
        breakdown.savingsRatio = 120;
    } else {
        breakdown.savingsRatio = 60;
    }

    // 3. Investment Discipline (200)
    const totalInvestments =
        customer.investments.mutual_funds +
        customer.investments.fixed_deposit +
        customer.investments.gold;

    if (totalInvestments >= 250000) {
        breakdown.investmentDiscipline = 200;
    } else if (totalInvestments >= 150000) {
        breakdown.investmentDiscipline = 170;
    } else {
        breakdown.investmentDiscipline = 120;
    }

    // 4. Emergency Fund (150)
    if (customer.emergency_fund >= 100000) {
        breakdown.emergencyFund = 150;
    } else if (customer.emergency_fund >= 50000) {
        breakdown.emergencyFund = 120;
    } else {
        breakdown.emergencyFund = 70;
    }

    // 5. Goal Progress (150)
    let totalProgress = 0;

    customer.goals.forEach((goal) => {
        totalProgress += goal.current / goal.target;
    });

    const averageProgress = totalProgress / customer.goals.length;

    if (averageProgress >= 0.7) {
        breakdown.goalProgress = 150;
    } else if (averageProgress >= 0.4) {
        breakdown.goalProgress = 120;
    } else {
        breakdown.goalProgress = 80;
    }

    // 6. Spending Behaviour (100)
    if (customer.monthly_expenses <= customer.monthly_income * 0.6) {
        breakdown.spendingBehaviour = 100;
    } else if (customer.monthly_expenses <= customer.monthly_income * 0.8) {
        breakdown.spendingBehaviour = 70;
    } else {
        breakdown.spendingBehaviour = 40;
    }

    score = Object.values(breakdown).reduce((a, b) => a + b, 0);

    let level = "";

    if (score >= 900) {
        level = "Excellent";
    } else if (score >= 750) {
        level = "Good";
    } else if (score >= 600) {
        level = "Stable";
    } else if (score >= 400) {
        level = "Needs Attention";
    } else {
        level = "Critical";
    }

    return {
        score,
        level,
        message: getLifeScoreMessage(level),
        breakdown,
    };
}
function generateRecommendation(customer, lifeScore) {
    console.log("Aura AI Recommendation Engine Activated");

    // Available monthly surplus

    let sipIncrease = 0;
    let confidence = 90;
    let improvement = 0;
    let recommendation = "";
    let goalImprovement = "No Change";

    // Customer metrics
    const surplus = customer.monthly_income - customer.monthly_expenses;
    const savingsRatio = (customer.monthly_savings / customer.monthly_income) * 100;
    const emergencyMonths = customer.emergency_fund / customer.monthly_expenses;

    // Priority 1: Emergency Fund
    if (emergencyMonths < 3) {

        recommendation =
            "Build your emergency fund to at least 6 months of expenses before increasing investments.";

        confidence = 98;
        improvement = 10;
        goalImprovement = "Better Financial Safety";

        // Priority 2: Increase SIP
    } else if (surplus >= 100000) {

        sipIncrease = 5000;

        recommendation =
            `Increase your IDBI Mutual Fund SIP by ₹${sipIncrease}/month.`;

        confidence = 96;
        improvement = 18;
        goalImprovement = "12 Months Earlier";

        // Priority 3: Improve Savings
    } else if (savingsRatio < 20) {

        recommendation =
            "Reduce discretionary spending and improve your monthly savings rate.";

        confidence = 93;
        improvement = 12;
        goalImprovement = "6 Months Earlier";

        // Default Recommendation
    } else {

        sipIncrease = 2000;

        recommendation =
            `Increase your IDBI Mutual Fund SIP by ₹${sipIncrease}/month.`;

        confidence = 92;
        improvement = 14;
        goalImprovement = "8 Months Earlier";
    }

    const projectedScore = Math.min(lifeScore.score + improvement, 1000);

    console.log( {
        recommendation,
        confidence,
        projectedScore,
        goalImprovement,
    });

    return {
        recommendation,
        confidence,
        projectedScore,
        goalImprovement,
        sipIncrease
    };
}

function getLifeScoreMessage(level) {
    switch (level) {
        case "Excellent":
            return "Top 5% Financial Health";

        case "Good":
            return "Top 15% Financial Health";

        case "Stable":
            return "Growing Financial Health";

        case "Needs Attention":
            return "Improvement Recommended";

        default:
            return "Financial Recovery Needed";
    }
}