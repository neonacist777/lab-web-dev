let users = [];
let nextId = 1;

function toDTO(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
}

function getAll() {
    return users.map(toDTO);
}

function getById(id) {
    const user = users.find(u => u.id === id);
    return user ? toDTO(user) : null;
}

function create(data) {
    const newUser = {
        id: nextId++,
        name: data.name,
        email: data.email
    };
    users.push(newUser);
    return toDTO(newUser);
}

function update(id, data) {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = {
        id: id,
        name: data.name,
        email: data.email
    };
    return toDTO(users[index]);
}

function remove(id) {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
}

module.exports = { getAll, getById, create, update, remove };
