export async function saveDesign(sessionId: string, elements: any[]) {
    return fetch(`/api/design/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ elements }),
    }).then(res => res.json());
  }
  
  export async function loadDesign(sessionId: string) {
    return fetch(`/api/design/${sessionId}`).then(res => res.json());
  }

  export async function fetchDesignById(sessionId: string) {
    return fetch(`/api/design/${sessionId}`).then(res => res.json());
  }

  export async function createNewDesign(sessionId: string) {
    return fetch(`/api/design/${sessionId}`).then(res => res.json());
  }

  