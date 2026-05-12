const BASE_URL = 'http://localhost:3000/api/v1';

async function request(method, path, body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);

    let res;
    try {
        res = await fetch(`${BASE_URL}${path}`, options);
    } catch {
        throw { type: 'NETWORK_ERROR', message: 'Сервер недоступний. Перевірте підключення.' };
    }

    if (res.status === 204) return null;

    let data;
    try {
        data = await res.json();
    } catch {
        throw { type: 'PARSE_ERROR', message: 'Помилка читання відповіді.' };
    }

    if (!res.ok) {
        throw {
            type: 'API_ERROR',
            status: res.status,
            title: data.title || 'Помилка',
            detail: data.detail || 'Невідома помилка',
            errors: data.errors || []
        };
    }

    return data;
}

export const incidents = {
    getAll: (p = {}) => request('GET', `/incidents${toQuery(p)}`),
    getById: (id) => request('GET', `/incidents/${id}`),
    create: (d) => request('POST', '/incidents', d),
    update: (id, d) => request('PUT', `/incidents/${id}`, d),
    remove: (id) => request('DELETE', `/incidents/${id}`)
};

export const comments = {
    getAll: (p = {}) => request('GET', `/comments${toQuery(p)}`),
    create: (d) => request('POST', '/comments', d),
    remove: (id) => request('DELETE', `/comments/${id}`)
};

function toQuery(params) {
    const q = new URLSearchParams(params).toString();
    return q ? '?' + q : '';
}