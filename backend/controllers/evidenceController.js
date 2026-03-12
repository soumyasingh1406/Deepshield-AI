let evidenceStore = [];
let idCounter = 1;

const addEvidence = (record) => {
    record.id = idCounter++;
    evidenceStore.push(record);
    return record;
};

const getEvidence = (req, res) => {
    res.json(evidenceStore);
};

const getDashboardStats = (req, res) => {
    const totalFilesAnalyzed = evidenceStore.length;
    const highRiskMediaDetected = evidenceStore.filter(record => record.riskLevel === 'HIGH').length;
    const evidenceStored = evidenceStore.length;

    res.json({
        totalFilesAnalyzed,
        highRiskMediaDetected,
        evidenceStored,
        systemStatus: 'ONLINE'
    });
};

module.exports = {
    addEvidence,
    getEvidence,
    getDashboardStats
};
