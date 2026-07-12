fetch("Assets/data/customer.json")
    .then(response => response.json())
    .then(data => {

        const result = calculateLifeScore(data.customer);

        console.log("Analysis JS is running");
        console.log(result);
        console.log(document.getElementById("animatedScore"));

        const scoreElement = document.getElementById("heroLifeScore");

        if (scoreElement) {

            let score = 0;

            const timer = setInterval(() => {

                score += Math.ceil((result.score - score) / 12);

                console.log(score);

                scoreElement.textContent = score;

                if (score >= result.score) {

                    scoreElement.textContent = result.score;
                    clearInterval(timer);

                }

            }, 40);

        }

        // Hero LifeScore
        // document.getElementById("heroLifeScore").textContent = result.score;

        // Score Label
        document.getElementById("heroScoreLabel").textContent = result.message;

        // Improvement
        document.getElementById("heroImprovement").textContent = "▲ +" + Math.round(result.score * 0.03) + " this quarter";

        // Percentile
        let percentile = Math.min(99, Math.round((result.score / 1000) * 100));

        document.getElementById("heroPercentile").textContent = percentile + "%";
        // Emergency fund coverage
        const emergencyMonths =
            (data.customer.emergency_fund / data.customer.monthly_expenses).toFixed(1);

        document.getElementById("emergencyMonths").textContent =
            emergencyMonths + " months";

        // Monthly surplus
        const surplus =
            data.customer.monthly_income - data.customer.monthly_expenses;

        let surplusText = "";

        if (surplus >= 100000) {

            surplusText =
                "Excellent cash flow. Aura AI recommends increasing investments while maintaining liquidity.";

        } else if (surplus >= 50000) {

            surplusText =
                "Healthy surplus detected. You can safely increase your monthly SIP.";

        } else {

            surplusText =
                "Limited monthly surplus. Focus on reducing expenses before increasing investments.";

        }

        document.getElementById("surplusAnalysis").textContent = surplusText;

        // ---------------- WHAT IF SIMULATOR ----------------

        const slider = document.getElementById("sipSlider");

        if (slider) {

            const sipValue = document.getElementById("sipValue");
            const currentScore = document.getElementById("currentScore");
            const projectedScore = document.getElementById("projectedScore");
            const scoreGain = document.getElementById("scoreGain");

            currentScore.textContent = result.score;
            console.log("Current Score:", result.score);

            // currentScore.textContent = result.score;

            function updateSimulator() {

                const sipIncrease = parseInt(slider.value);

                sipValue.textContent = "₹" + sipIncrease.toLocaleString();

                // Every ₹500 SIP = +2 LifeScore points
                const gain = Math.floor(sipIncrease / 500) * 2;

                const newScore = Math.min(result.score + gain, 1000);

                projectedScore.textContent = newScore;

                scoreGain.textContent = "+" + gain;
                const projectionText = document.getElementById("projectionText");
                if (!projectionText) return;
                if (sipIncrease === 0) {

                    projectionText.innerHTML =
                        "💤 No additional investment selected. Your financial outlook remains unchanged.";

                }

                else if (sipIncrease <= 2000) {

                    projectionText.innerHTML =
                        "🟢 <strong>Good Start.</strong> Increasing your SIP by <strong>₹" +
                        sipIncrease.toLocaleString() +
                        "</strong> strengthens your long-term financial health while keeping risk low.";

                }

                else if (sipIncrease <= 5000) {

                    projectionText.innerHTML =
                        "🚀 <strong>Strong Choice.</strong> Aura AI predicts faster wealth creation, improved LifeScore, and quicker achievement of your financial goals.";

                }

                else {

                    projectionText.innerHTML =
                        "⭐ <strong>Excellent Decision.</strong> This investment strategy significantly improves your future financial resilience and maximizes long-term wealth creation.";

                }

            }

            updateSimulator();

            slider.addEventListener("input", updateSimulator);

        }

    })
    .catch(console.error);