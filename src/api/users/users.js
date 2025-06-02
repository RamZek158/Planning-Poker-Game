
export const getUsers = fetch('/api/users', { method: 'GET' })
    .then((res) => res.json())
    .then((data) => data);

export const addUser = (user) => fetch('/api/addUser', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(user)
})
    .then((res) => res.json())
    .then((data) => data);

export const deleteUser = (userId) => fetch(`/api/users?id=${userId}`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'text/html; charset=utf-8'
    }
})
    .then((res) => res.json())
    .then((data) => data);
