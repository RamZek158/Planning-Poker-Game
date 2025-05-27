
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
