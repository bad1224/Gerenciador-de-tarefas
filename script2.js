let doneCount = 0; 
const SHEET_MONKEY_URL = 'https://api.sheetmonkey.io/form/5LucWFff2BhkVfrbxHPgox';

// Função de envio simplificada: Tarefa, Etiqueta, Status e Horário
async function enviarConclusao(tarefa, etiqueta) {
    const formData = new FormData();
    formData.append("Tarefa", tarefa);
    formData.append("Etiqueta", etiqueta);
    formData.append("Status", "Concluída"); // Status fixo como concluída
    formData.append("Data / Horário", new Date().toLocaleString('pt-BR'));

    try {
        await fetch(SHEET_MONKEY_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });
        console.log("✅ Vitória registrada na planilha!");
    } catch (e) {
        console.error("❌ Erro ao registrar:", e);
    }
}

function addTask() {
  const name = document.getElementById("taskName").value.trim();
  const tag = document.getElementById("taskTag").value.trim();
  if (!name) return;

  // AQUI NÃO ENVIA NADA PARA A PLANILHA AINDA (SÓ NA TELA)

  const taskList = document.getElementById("taskList");
  const taskDiv = document.createElement("div");
  taskDiv.className = "task";

  const span = document.createElement("span");
  span.textContent = name;

  if (tag) {
    const tagSpan = document.createElement("span");
    tagSpan.className = "tag";
    tagSpan.textContent = tag;
    span.appendChild(tagSpan);
  }

  const concluirBtn = document.createElement("button");
  concluirBtn.textContent = "✔ Concluir";
  concluirBtn.className = "concluir-btn";
  
  concluirBtn.onclick = () => {
    taskDiv.classList.add("completed");
    concluirBtn.remove();
    
    // Remove o botão corrigir ao concluir
    const corr = taskDiv.querySelector(".corrigir-btn");
    if(corr) corr.remove();
    
    doneCount++; 
    document.getElementById("doneCount").textContent = doneCount;

    // AGORA SIM: ENVIA TUDO PARA A PLANILHA EM UMA LINHA SÓ
    enviarConclusao(name, tag);
  };

  const corrigirBtn = document.createElement("button");
  corrigirBtn.textContent = "✏ Corrigir";
  corrigirBtn.className = "corrigir-btn";
  corrigirBtn.onclick = () => {
    const inputEdit = document.createElement("input");
    inputEdit.type = "text";
    inputEdit.value = span.textContent.trim();
    inputEdit.className = "edit-input";
    taskDiv.replaceChild(inputEdit, span);
    inputEdit.focus();
    inputEdit.onblur = () => {
      span.textContent = inputEdit.value || name;
      taskDiv.replaceChild(span, inputEdit);
    };
  };

  const btnGroup = document.createElement("div");
  btnGroup.className = "btn-group";
  btnGroup.appendChild(corrigirBtn);
  btnGroup.appendChild(concluirBtn);

  taskDiv.appendChild(span);
  taskDiv.appendChild(btnGroup);
  taskList.appendChild(taskDiv);

  document.getElementById("taskName").value = "";
  document.getElementById("taskTag").value = "";
}

function clearTasks() {
  document.getElementById("taskList").innerHTML = "";
  doneCount = 0; 
  document.getElementById("doneCount").textContent = doneCount;
}

