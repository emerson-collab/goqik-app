const el = (sel) => document.querySelector(sel);
const list = el('#taskList');
const input = el('#taskInput');
const addBtn = el('#addBtn');
const themeToggle = el('#themeToggle');

async function fetchTasks(){
  const res = await fetch('/api/tasks');
  const data = await res.json();
  render(data);
}
function render(tasks){
  list.innerHTML = '';
  tasks.forEach(t=>{
    const li = document.createElement('li');
    li.className = 'task' + (t.done ? ' done':'');
    li.innerHTML = `
      <input type="checkbox" ${t.done ? 'checked':''} />
      <span class="title">${escapeHtml(t.title)}</span>
      <span class="spacer"></span>
      <button class="del">删除</button>
    `;
    li.querySelector('input').addEventListener('change', async (e)=>{
      await fetch('/api/tasks/'+t.id, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({done:e.target.checked})});
      fetchTasks();
    });
    li.querySelector('.del').addEventListener('click', async ()=>{
      await fetch('/api/tasks/'+t.id, {method:'DELETE'});
      fetchTasks();
    });
    list.appendChild(li);
  });
}
addBtn.addEventListener('click', async ()=>{
  const title = input.value.trim();
  if (!title) return;
  await fetch('/api/tasks', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({title})});
  input.value=''; fetchTasks();
});
themeToggle.addEventListener('click', ()=>{
  const root = document.documentElement;
  root.classList.toggle('light');
});
function escapeHtml(s){ return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
fetchTasks();
