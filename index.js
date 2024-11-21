const apiUrl = 'https://jsonplaceholder.typicode.com/users';
let localData = [];

$('#fetchData').on('click', function () {
    $.get(apiUrl)
        .done(function (data) {
            localData = data;
            renderTable(localData);
        })
        .fail(function (error) {
            console.error('Error fetching data:', error);
        });
});

$('#toggleAddData').on('click', function () {
    const $formContainer = $('#addUserFormContainer');
    $formContainer.toggle();
});

$('#addUserForm').on('submit', function (event) {
    event.preventDefault();

    const username = $('#username').val();
    const name = $('#name').val();
    const email = $('#email').val();

    if (username && name && email) {
        const newUser = {
            id: localData.length + 1,
            username,
            name,
            email,
        };
        localData.push(newUser);
        renderTable(localData);

        $('#username').val('');
        $('#name').val('');
        $('#email').val('');
        $('#addUserFormContainer').hide();
    } else {
        alert('Please fill out all fields.');
    }
});

function updateUser(id) {
    const user = localData.find(user => user.id === id);
    if (!user) return;

    const row = $(`#row-${id}`);
    row.html(`
        <td>${user.id}</td>
        <td><input type="text" id="edit-username-${id}" value="${user.username}"></td>
        <td><input type="text" id="edit-name-${id}" value="${user.name}"></td>
        <td><input type="email" id="edit-email-${id}" value="${user.email}"></td>
        <td>
            <button class="save-btn" onclick="saveUser(${id})">Save</button>
            <button class="delete-btn" onclick="deleteUser(${id})">Delete</button>
        </td>
    `);
}

function saveUser(id) {
    const username = $(`#edit-username-${id}`).val();
    const name = $(`#edit-name-${id}`).val();
    const email = $(`#edit-email-${id}`).val();

    if (username && name && email) {
        const userIndex = localData.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            localData[userIndex] = { id, username, name, email };
            renderTable(localData);
        }
    } else {
        alert('Please fill out all fields before saving.');
    }
}

function deleteUser(id) {
    localData = localData.filter(user => user.id !== id);
    renderTable(localData);
}

function renderTable(data) {
    const tableBody = $('#dataTable tbody');
    tableBody.empty();

    data.forEach(user => {
        const row = `
            <tr id="row-${user.id}">
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <div class="action-buttons">
                        <button class="update-btn" onclick="updateUser(${user.id})">Update</button>
                        <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
        tableBody.append(row);
    });
}
