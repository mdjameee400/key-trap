/**
 * Monkeytype REST API Integration
 * Endpoint: GET https://api.monkeytype.com/results/last
 * Authorization: ApeKey <apeKey>
 */

export async function fetchLastMonkeytypeResult(apeKey) {
    if (!apeKey) {
        throw new Error("ApeKey is required to fetch results from Monkeytype API.");
    }

    try {
        const response = await fetch("https://api.monkeytype.com/results/last", {
            method: "GET",
            headers: {
                "Authorization": `ApeKey ${apeKey.trim()}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || `API error: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return json.data;
    } catch (err) {
        console.error("Monkeytype API fetch error:", err);
        throw err;
    }
}

export const SAMPLE_MONKEYTYPE_RESULT = {
    wpm: 84.2,
    raw: 89.5,
    acc: 98.25,
    consistency: 76.1,
    charStats: [120, 2, 0, 0],
    mode: "time",
    mode2: "30"
};
