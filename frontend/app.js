import { incidents as api, comments as commentsApi } from './apiClient.js';

// DOM
const form           = document.getElementById('incidentForm');
const list           = document.getElementById('incidentList');
const emptyMessage   = document.getElementById('emptyMessage');
const statusMessage  = document.getElementById('statusMessage');
const loadingOverlay = document.getElementById('loadingOverlay');
const submitBtn      = document.querySelector('button[type="submit"]');

const titleInput    = document.getElementById('titleInput');
const typeSelect    = document.getElementById('typeSelect');
const dateInput     = document.getElementById('dateInput');
const severityInput = document.getElementById('severityInput');
const titleError    = document.getElementById('titleError');
const typeError     = document.getElementById('typeError');
const dateError     = document.getElementById('dateError');
const severityError = document.getElementById('severityError');

const searchInput = document.getElementById('searchInput');
const filterType  = document.getElementById('filterType');
const sortSelect  = document.getElementById('sortSelect');

const detailsPanel   = document.getElementById('detailsPanel');
const detailsContent = document.getElementById('detailsContent');
const detailsClose   = document.getElementById('detailsClose');
const commentsList   = document.getElementById('commentsList');
const commentForm    = document.getElementById('commentForm');
const commentAuthor  = document.getElementById('commentAuthor');
const commentText    = document.getElementById('commentText');
const commentAuthorErr = document.getElementById('commentAuthorError');
const commentTextErr   = document.getElementById('commentTextError');

// Стан
const state = {
    incidents: [],
    error: null,
    editingId: null,
    selectedId: null
};

// ---- Утиліти ----

function setLoading(on) {
    loadingOverlay.style.display = on ? 'flex' : 'none';
    submitBtn.disabled = on;
}

function showStatus(msg, type = '') {
    statusMessage.textContent = msg;
    statusMessage.className = 'status-msg' + (type ? ' status-' + type : '');
    if (type === 'ok') setTimeout(() => { statusMessage.textContent = ''; }, 3000);
}

function badgeClass(s) {
    return s >= 8 ? 'badge-high' : s >= 5 ? 'badge-medium' : 'badge-low';
}

// ---- Валідація інциденту ----

function clearFormErrors() {
    [titleInput, typeSelect, dateInput, severityInput].forEach(el => el.classList.remove('input-error'));
    [titleError, typeError, dateError, severityError].forEach(el => el.textContent = '');
}

function validateIncident(d) {
    clearFormErrors();
    let ok = true;

    if (!d.title || d.title.length < 3) {
        titleError.textContent = d.title ? 'Мінімум 3 символи.' : "Назва обов'язкова.";
        titleInput.classList.add('input-error');
        ok = false;
    }
    if (!d.type) {
        typeError.textContent = 'Оберіть тип.';
        typeSelect.classList.add('input-error');
        ok = false;
    }
    if (!d.date) {
        dateError.textContent = 'Оберіть дату.';
        dateInput.classList.add('input-error');
        ok = false;
    }
    const s = Number(d.severity);
    if (!d.severity || isNaN(s) || s < 1 || s > 10) {
        severityError.textContent = 'Від 1 до 10.';
        severityInput.classList.add('input-error');
        ok = false;
    }
    return ok;
}

function applyServerErrors(errors) {
    const map = {
        title:    [titleInput, titleError],
        type:     [typeSelect, typeError],
        date:     [dateInput, dateError],
        severity: [severityInput, severityError]
    };
    errors.forEach(({ field, message }) => {
        if (map[field]) {
            map[field][0].classList.add('input-error');
            map[field][1].textContent = message;
        }
    });
}

function readForm() {
    return {
        title:    titleInput.value.trim(),
        type:     typeSelect.value,
        date:     dateInput.value,
        severity: Number(severityInput.value)
    };
}

function clearForm() {
    titleInput.value = '';
    typeSelect.selectedIndex = 0;
    dateInput.value = '';
    severityInput.value = '';
    clearFormErrors();
    state.editingId = null;
    submitBtn.textContent = 'Додати інцидент';
    showStatus('');
}

// ---- Обробка помилок ----

function handleError(err) {
    if (err.type === 'NETWORK_ERROR') { showStatus(err.message, 'error'); return; }
    if (err.type === 'API_ERROR') {
        if (err.status === 400 && err.errors?.length) {
            applyServerErrors(err.errors);
            showStatus(err.detail, 'error');
        } else {
            showStatus(`${err.title}: ${err.detail}`, 'error');
        }
        return;
    }
    showStatus('Невідома помилка.', 'error');
}

// ---- CRUD Incidents ----

async function loadIncidents() {
    setLoading(true);
    showStatus('Завантаження…', 'loading');
    try {
        state.incidents = await api.getAll();
        state.error = null;
        showStatus('');
    } catch (err) {
        state.error = err;
        handleError(err);
    } finally {
        setLoading(false);
        render();
    }
}

async function addIncident(data) {
    setLoading(true);
    try {
        const saved = await api.create(data);
        state.incidents.push(saved);
        showStatus('Інцидент додано!', 'ok');
        clearForm();
        render();
    } catch (err) {
        handleError(err);
    } finally {
        setLoading(false);
    }
}

async function updateIncident(id, data) {
    setLoading(true);
    try {
        const updated = await api.update(id, data);
        const i = state.incidents.findIndex(x => x.id === Number(id));
        if (i !== -1) state.incidents[i] = updated;
        showStatus('Зміни збережено!', 'ok');
        clearForm();
        if (state.selectedId === Number(id)) openDetails(Number(id));
        render();
    } catch (err) {
        handleError(err);
    } finally {
        setLoading(false);
    }
}

async function deleteIncident(id) {
    if (!confirm('Видалити цей інцидент?')) return;
    setLoading(true);
    try {
        await api.remove(id);
        state.incidents = state.incidents.filter(x => x.id !== Number(id));
        if (state.selectedId === Number(id)) closeDetails();
        showStatus('Інцидент видалено.', 'ok');
        render();
    } catch (err) {
        handleError(err);
    } finally {
        setLoading(false);
    }
}

function startEdit(id) {
    const inc = state.incidents.find(x => x.id === Number(id));
    if (!inc) return;
    titleInput.value    = inc.title;
    typeSelect.value    = inc.type;
    dateInput.value     = inc.date;
    severityInput.value = inc.severity;
    state.editingId = id;
    submitBtn.textContent = 'Зберегти зміни';
    clearFormErrors();
    form.scrollIntoView({ behavior: 'smooth' });
}

// ---- Деталі + Коментарі ----

async function openDetails(id) {
    state.selectedId = Number(id);
    detailsPanel.style.display = 'block';

    const inc = state.incidents.find(x => x.id === Number(id));
    if (!inc) return;

    detailsContent.innerHTML = `
        <div class="details-grid">
            <div class="detail-item">
                <span class="detail-label">Назва</span>
                <span class="detail-value">${inc.title}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Тип</span>
                <span class="detail-value">${inc.type}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Дата</span>
                <span class="detail-value">${inc.date}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Критичність</span>
                <span class="detail-value">
                    <span class="badge ${badgeClass(inc.severity)}">${inc.severity}</span>
                </span>
            </div>
        </div>
    `;

    await loadComments(id);
    detailsPanel.scrollIntoView({ behavior: 'smooth' });
}

function closeDetails() {
    state.selectedId = null;
    detailsPanel.style.display = 'none';
    commentAuthor.value = '';
    commentText.value = '';
    commentAuthorErr.textContent = '';
    commentTextErr.textContent = '';
    render();
}

async function loadComments(incidentId) {
    commentsList.innerHTML = '<p class="empty-msg">Завантаження…</p>';
    try {
        const data = await commentsApi.getAll({ incidentId });
        if (!data || data.length === 0) {
            commentsList.innerHTML = '<p class="empty-msg">Коментарів поки немає</p>';
            return;
        }
        commentsList.innerHTML = '';
        data.forEach(c => {
            const div = document.createElement('div');
            div.className = 'comment-item';
            div.innerHTML = `
                <div class="comment-body">
                    <span class="comment-author">${c.author}</span>
                    <span class="comment-date">${c.created_at ? c.created_at.slice(0,10) : ''}</span>
                    <p class="comment-text">${c.text}</p>
                </div>
                <button class="btn-delete" data-comment-id="${c.id}">Видалити</button>
            `;
            commentsList.appendChild(div);
        });
    } catch {
        commentsList.innerHTML = '<p class="empty-msg" style="color:#c62828">Помилка завантаження коментарів.</p>';
    }
}

async function addComment() {
    commentAuthorErr.textContent = '';
    commentTextErr.textContent = '';
    commentAuthor.classList.remove('input-error');
    commentText.classList.remove('input-error');

    let ok = true;
    if (!commentAuthor.value.trim()) {
        commentAuthorErr.textContent = "Автор обов'язковий.";
        commentAuthor.classList.add('input-error');
        ok = false;
    }
    if (!commentText.value.trim()) {
        commentTextErr.textContent = "Текст обов'язковий.";
        commentText.classList.add('input-error');
        ok = false;
    }
    if (!ok) return;

    try {
        await commentsApi.create({
            incidentId: state.selectedId,
            author: commentAuthor.value.trim(),
            text: commentText.value.trim()
        });
        commentAuthor.value = '';
        commentText.value = '';
        await loadComments(state.selectedId);
    } catch (err) {
        commentTextErr.textContent = err.detail || 'Помилка при додаванні.';
    }
}

async function deleteComment(id) {
    if (!confirm('Видалити коментар?')) return;
    try {
        await commentsApi.remove(id);
        await loadComments(state.selectedId);
    } catch {
        commentTextErr.textContent = 'Помилка при видаленні.';
    }
}

// ---- Рендер списку ----

function render() {
    list.innerHTML = '';

    if (state.error) {
        emptyMessage.style.display = 'block';
        emptyMessage.style.color = '#c62828';
        emptyMessage.textContent = '⚠️ Не вдалося завантажити дані. Оновіть сторінку.';
        return;
    }

    let items = [...state.incidents];

    const q = searchInput.value.toLowerCase();
    if (q) items = items.filter(x => x.title.toLowerCase().includes(q));

    const t = filterType.value;
    if (t) items = items.filter(x => x.type === t);

    const s = sortSelect.value;
    if (s === 'dateAsc')       items.sort((a,b) => a.date.localeCompare(b.date));
    else if (s === 'dateDesc') items.sort((a,b) => b.date.localeCompare(a.date));
    else if (s === 'severityAsc')  items.sort((a,b) => a.severity - b.severity);
    else if (s === 'severityDesc') items.sort((a,b) => b.severity - a.severity);

    if (items.length === 0) {
        emptyMessage.style.display = 'block';
        emptyMessage.style.color = '';
        emptyMessage.textContent = 'Записів поки немає';
        return;
    }
    emptyMessage.style.display = 'none';

    items.forEach(inc => {
        const li = document.createElement('li');
        li.className = 'incident-item' + (inc.id === state.selectedId ? ' active' : '');
        li.innerHTML = `
            <div class="incident-info">
                <strong>${inc.title}</strong>
                <div class="meta">
                    ${inc.type} &nbsp;·&nbsp; ${inc.date} &nbsp;·&nbsp;
                    Критичність: <span class="badge ${badgeClass(inc.severity)}">${inc.severity}</span>
                </div>
            </div>
            <div class="incident-actions">
                <button class="btn-view"   data-id="${inc.id}">Деталі</button>
                <button class="btn-edit"   data-id="${inc.id}">Редагувати</button>
                <button class="btn-delete" data-id="${inc.id}">Видалити</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// ---- Події ----

list.addEventListener('click', e => {
    const id = e.target.dataset.id;
    if (!id) return;
    if (e.target.classList.contains('btn-view'))   openDetails(id);
    if (e.target.classList.contains('btn-edit'))   startEdit(id);
    if (e.target.classList.contains('btn-delete')) deleteIncident(id);
});

commentsList.addEventListener('click', e => {
    const id = e.target.dataset.commentId;
    if (id && e.target.classList.contains('btn-delete')) deleteComment(Number(id));
});

form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = readForm();
    if (!validateIncident(data)) return;
    if (state.editingId) await updateIncident(state.editingId, data);
    else await addIncident(data);
});

commentForm.addEventListener('submit', e => {
    e.preventDefault();
    addComment();
});

detailsClose.addEventListener('click', closeDetails);

searchInput.addEventListener('input', render);
filterType.addEventListener('change', render);
sortSelect.addEventListener('change', render);

// Старт
loadIncidents();