const analyzeMessage = (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    const text = message.toLowerCase();

    let category = "Safe";
    let riskLevel = "LOW";
    let explanation = "No malicious intent detected.";
    let recommendedAction = "No action required.";

    // Simple keyword detection
    const threatKeywords = ["kill", "die", "murder", "hurt", "beat", "destroy"];
    const blackmailKeywords = ["pay", "bitcoin", "expose", "leak", "nudes", "ruin", "secret"];
    const harassmentKeywords = ["bitch", "slut", "ugly", "whore", "hate", "loser", "dumb"];

    const hasThreat = threatKeywords.some(keyword => text.includes(keyword));
    const hasBlackmail = blackmailKeywords.some(keyword => text.includes(keyword));
    const hasHarassment = harassmentKeywords.some(keyword => text.includes(keyword));

    if (hasThreat) {
        category = "Threat";
        riskLevel = "CRITICAL";
        explanation = "Message contains direct threats of physical harm or violence.";
        recommendedAction = "Contact law enforcement immediately and do not engage.";
    } else if (hasBlackmail) {
        category = "Blackmail";
        riskLevel = "HIGH";
        explanation = "Message contains attempts at extortion or threats to release private information.";
        recommendedAction = "Do not pay. Document the evidence and report to authorities.";
    } else if (hasHarassment) {
        category = "Harassment";
        riskLevel = "MEDIUM";
        explanation = "Message contains abusive, degrading, or insulting language.";
        recommendedAction = "Block the sender and report the account to the platform.";
    }

    res.json({
        category,
        riskLevel,
        explanation,
        recommendedAction
    });
};

module.exports = {
    analyzeMessage
};
