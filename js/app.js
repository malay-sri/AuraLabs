console.log("App Started");
fetch("Assets/data/customer.json")
    .then(response => response.json())
    .then(data => {

        const result = calculateLifeScore(data.customer);

        const notificationList = document.getElementById("notificationList");

        if (notificationList) {

            let notifications = [];

            // Emergency Fund
            const emergencyMonths =
                data.customer.emergency_fund / data.customer.monthly_expenses;

            if (emergencyMonths < 6) {
                notifications.push({
                    color: "red",
                    icon: "🚨",
                    text: `Emergency fund covers only ${emergencyMonths.toFixed(1)} months.`
                });
            }

            // LifeScore
            notifications.push({
                color: "green",
                icon: "✅",
                text: `LifeScore updated to ${result.score}.`
            });

            // SIP
            notifications.push({
                color: "purple",
                icon: "📈",
                text: "Aura AI recommends increasing your SIP by ₹2,000/month."
            });

            notificationList.innerHTML = "";

            notifications.forEach((n, index) => {

                setTimeout(() => {

                    notificationList.innerHTML += `
            <div class="p-3 rounded-xl bg-${n.color}-50 opacity-0 translate-y-3 transition-all duration-500 notificationItem">
                ${n.icon} ${n.text}
            </div>
        `;

                    const items = document.querySelectorAll(".notificationItem");
                    const latest = items[items.length - 1];

                    requestAnimationFrame(() => {
                        latest.classList.remove("opacity-0", "translate-y-3");
                    });

                }, index * 250);

            });

            const badge = document.getElementById("notificationBadge");

            if (badge) {

                badge.textContent = notifications.length;

                if (notifications.length > 0) {
                    badge.classList.remove("hidden");
                }

            }

        }

        const recommendation = generateRecommendation(data.customer, result);
        document.getElementById("recommendationText").textContent =
            recommendation.recommendation;

        document.getElementById("insightScore").textContent =
            `${result.score} → ${recommendation.projectedScore}`;

        document.getElementById("goalImprovement").textContent =
            recommendation.goalImprovement;

        document.getElementById("confidenceScore").textContent =
            `${recommendation.confidence}%`;

        const emergencyMonths =
            (data.customer.emergency_fund / data.customer.monthly_expenses).toFixed(1);

        document.getElementById("aiReasoning").innerHTML = `
Your monthly surplus is <strong>₹${(data.customer.monthly_income - data.customer.monthly_expenses).toLocaleString()}</strong>,
which indicates a healthy cash flow.<br><br>

However, your emergency fund currently covers only
<strong>${emergencyMonths} months</strong> of expenses.

Aura AI recommends strengthening your emergency reserve before increasing long-term investments.
`;

        animateLifeScore(result.score);
        animateLifeRing(result.score);
        document.getElementById("lifeScoreLevel").textContent = result.message;

        console.log(result);

        // Monthly Income
        document.getElementById("monthlyIncome").textContent =
            "₹" + data.customer.monthly_income.toLocaleString();

        // Monthly Surplus
        const surplus =
            data.customer.monthly_income -
            data.customer.monthly_expenses;

        document.getElementById("monthlySurplus").textContent =
            "₹" + surplus.toLocaleString();

        // Total Investmentsffetch
        const investments =
            data.customer.investments.mutual_funds +
            data.customer.investments.fixed_deposit +
            data.customer.investments.gold;

        document.getElementById("investmentValue").textContent =
            "₹" + investments.toLocaleString();

        // Emergency Fund
        const months =
            (data.customer.emergency_fund /
                data.customer.monthly_expenses).toFixed(1);

        document.getElementById("emergencyCoverage").textContent =
            months + " Months";

        const alerts = document.getElementById("aiAlerts");

        if (alerts) {

            const emergencyMonths =
                (data.customer.emergency_fund / data.customer.monthly_expenses).toFixed(1);

            const goal =
                Math.round((data.customer.goals[0].current /
                    data.customer.goals[0].target) * 100);

            alerts.innerHTML = `

<div class="absolute left-[19px] top-6 bottom-6 w-px bg-surface-variant"></div>

<div class="flex items-start gap-4 py-4 relative">

<div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center z-10 ring-4 ring-white">

<span class="material-symbols-outlined text-red-600">warning</span>

</div>

<div>

<span class="font-semibold">
Emergency Fund
</span>

<p class="text-sm text-gray-500">
Only ${emergencyMonths} months covered.
Aura AI recommends building 6 months.
</p>

</div>

</div>

<div class="flex items-start gap-4 py-4 relative">

<div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center z-10 ring-4 ring-white">

<span class="material-symbols-outlined text-purple-700">trending_up</span>

</div>

<div>

<span class="font-semibold">
Investment Opportunity
</span>

<p class="text-sm text-gray-500">
Increase your SIP by ₹2,000/month to improve your LifeScore.
</p>

</div>

</div>

<div class="flex items-start gap-4 py-4 relative">

<div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center z-10 ring-4 ring-white">

<span class="material-symbols-outlined text-green-600">flag</span>

</div>

<div>

<span class="font-semibold">
${data.customer.goals[0].title}
</span>

<p class="text-sm text-gray-500">
${goal}% completed.
Aura AI predicts faster completion with higher SIP.
</p>

</div>

</div>

`;

        }

        const wealthJourney = document.getElementById("wealthJourney");

        if (wealthJourney) {

            const carProgress = Math.round(
                (data.customer.goals[0].current /
                    data.customer.goals[0].target) * 100
            );

            const tripProgress = Math.round(
                (data.customer.goals[1].current /
                    data.customer.goals[1].target) * 100
            );

            const lifeProgress = Math.round(result.score / 10);

            wealthJourney.innerHTML = `

<div class="snap-start shrink-0 w-[170px] bg-green-50 rounded-xl p-5 ring-2 ring-green-200">

    <span class="material-symbols-outlined text-green-600 text-3xl">
        directions_car
    </span>

    <h3 class="font-bold mt-3">${data.customer.goals[0].title}</h3>

    <p class="text-sm text-gray-500 mt-1">${carProgress}% Complete</p>

    <div class="w-full h-2 bg-gray-200 rounded-full mt-3">

        <div class="h-2 bg-green-500 rounded-full"
            style="width:${carProgress}%">
        </div>

    </div>

</div>

<div class="snap-start shrink-0 w-[170px] bg-blue-50 rounded-xl p-5 ring-2 ring-blue-200">

    <span class="material-symbols-outlined text-blue-600 text-3xl">
        flight_takeoff
    </span>

    <h3 class="font-bold mt-3">${data.customer.goals[1].title}</h3>

    <p class="text-sm text-gray-500 mt-1">${tripProgress}% Complete</p>

    <div class="w-full h-2 bg-gray-200 rounded-full mt-3">

        <div class="h-2 bg-blue-500 rounded-full"
            style="width:${tripProgress}%">
        </div>

    </div>

</div>

<div class="snap-start shrink-0 w-[170px] bg-purple-50 rounded-xl p-5 ring-2 ring-purple-200">

    <span class="material-symbols-outlined text-purple-600 text-3xl">
        workspace_premium
    </span>

    <h3 class="font-bold mt-3">LifeScore Target</h3>

    <p class="text-sm text-gray-500 mt-1">${lifeProgress}% Complete</p>

    <div class="w-full h-2 bg-gray-200 rounded-full mt-3">

        <div class="h-2 bg-purple-600 rounded-full"
            style="width:${lifeProgress}%">
        </div>

    </div>

</div>

`;

        }

    })
    .catch(error => {
        console.error(error);
    });

function
    animateLifeScore(targetScore) {
    const scoreElement = document.getElementById("lifeScoreValue");

    let current = 0;
    const duration = 1200; // 1.2 seconds
    const stepTime = 15; // Update every 15 milliseconds
    const increment = targetScore / (duration / stepTime);

    const counter = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
            current = targetScore;
            clearInterval(counter);
        }
        scoreElement.textContent = Math.round(current);
    }, stepTime);
}

function animateLifeRing(score) {

    const ring = document.getElementById("lifeScoreRing");

    const circumference = 264;

    const targetOffset = circumference - (score / 1000) * circumference;

    let currentOffset = circumference;

    function animate() {

        currentOffset += (targetOffset - currentOffset) * 0.08;

        ring.setAttribute("stroke-dashoffset", currentOffset);

        if (Math.abs(currentOffset - targetOffset) > 0.5) {
            requestAnimationFrame(animate);
        } else {
            ring.setAttribute("stroke-dashoffset", targetOffset);
        }
    }

    animate();

}