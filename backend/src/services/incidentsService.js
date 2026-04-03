let incidents = [];
let nextId = 1;

const ALLOWED_TYPES = ["DDoS", "Malware", "Phishing", "Data Leak"];

function toDTO(incident) {
    return {
        id: incident.id,
        title: incident.title,
        type: incident.type,
        date: incident.date,
        severity: incident.severity,
        tags: incident.tags,
        comments: incident.comments
    };
}

function getAll() {
    return incidents.map(toDTO);
}

function getById(id) {
    const incident = incidents.find(i => i.id === id);
    return incident ? toDTO(incident) : null;
}

function create(data) {
    const newIncident = {
        id: nextId++,
        title: data.title,
        type: data.type,
        date: data.date,
        severity: Number(data.severity),
        tags: data.tags || [],
        comments: data.comments || []
    };
    incidents.push(newIncident);
    return toDTO(newIncident);
}

function update(id, data) {
    const index = incidents.findIndex(i => i.id === id);
    if (index === -1) return null;

    incidents[index] = {
        id: id,
        title: data.title,
        type: data.type,
        date: data.date,
        severity: Number(data.severity),
        tags: data.tags || [],
        comments: data.comments || []
    };
    return toDTO(incidents[index]);
}

function remove(id) {
    const index = incidents.findIndex(i => i.id === id);
    if (index === -1) return false;

    incidents.splice(index, 1);
    return true;
}

module.exports = { getAll, getById, create, update, remove, ALLOWED_TYPES };
