const apiURL = "https://api.sheetmonkey.io/form/9SzgiCYSWCZKLbnuJGwwn6"; 
let completedTasks = 0;

async function addTask() {
    const nameInput = document.getElementById('taskName');
    const tagInput = document.getElementById('taskTag');
    const name = nameInput.value;
    const tag = tagInput.value;

    if (name.trim() === '') {
        alert("Comandante, digite o nome da tarefa!");
        return;
    }

    renderizarNaTela(name, tag);

    nameInput.value = '';
    tagInput.value = '';

    try {
        await fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "Tarefa": name,
                "Categoria": tag,
                "Data": new Date().toLocaleString('pt-BR')
            })
        });
    } catch (error) {
        console.error("Erro ao salvar:", error);
    }
}

function renderizarNaTela(name, tag) {
    const taskList = document.getElementById('taskList');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    
    taskDiv.innerHTML = `
        <div class="task-info">
            <p class="t-name">${name}</p>
            <span class="t-tag">${tag}</span>
        </div>
        <div class="task-actions">
            <button class="finish-btn" onclick="completeTask(this)">Concluir</button>
            <button class="remove-btn" onclick="removeTask(this)">Remover</button>
        </div>
    `;
    taskList.appendChild(taskDiv);
}

function completeTask(btn) {
    const taskItem = btn.closest('.task-item');
    const taskName = taskItem.querySelector('.t-name');

    if (taskName) {
        taskName.style.textDecoration = "line-through";
        taskName.style.opacity = "0.5";
    }

    btn.outerHTML = '<span style="font-size: 18px; margin-right: 10px;">✅</span>';
    completedTasks++;
    document.getElementById('doneCount').innerText = completedTasks;
}

function removeTask(btn) {
    const taskItem = btn.closest('.task-item');
    taskItem.remove();
}

function clearTasks() {
    if (confirm("Deseja limpar o quadro visual?")) {
        document.getElementById('taskList').innerHTML = '';
        completedTasks = 0;
        document.getElementById('doneCount').innerText = '0';
    }

}
