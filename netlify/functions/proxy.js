const FLOWS = {
  dienste_lesen:        'https://default402c9414f0694259b541a689de4691.1b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/089cdb32ad4b40baa07b950a8da5a40d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fLKCyIZHorCD4QkOOSTf1N4rX33-k2U72_orsk-_GN0',
  eintragung_speichern: 'https://default402c9414f0694259b541a689de4691.1b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/a261c180b768463f98782405327aa85d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0t86RNJttmtlhCY-Jk7QFF4J4aC2TlcjWLcssyy09wQ',
  eintragung_loeschen:  'https://default402c9414f0694259b541a689de4691.1b.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/757f64a34641445aaa1902cbf2c3dbdb/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=bsCsoXTX_dmPFTJzFi1MfPNZ3Kh2MWK5tqgdmMaFAzg',
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { flow, ...payload } = body;

  if (!flow || !FLOWS[flow]) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown flow: ' + flow }) };
  }

  try {
    const response = await fetch(FLOWS[flow], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
