console.log("Starting...");
document.addEventListener('DOMContentLoaded', () => {
 const inputValue = document.getElementById('form-id');
 const addTaskbtn = document.getElementById('add-btn');
 const taskList = document.getElementById('Task-List');
 const emptyImage = document.querySelector('.image-sec');
 const taskContainer = document.querySelector('.task-container');
 const progressbar = document.querySelector('#progress');
 const progressNumbers = document.querySelector('#numbers');


 
const imageSection = () => {
  emptyImage.style.display = taskList.children.length === 0 ? 'block':'none';
  taskContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
}

const updateProgress = (checkCompletion = true ) => {
  const totalTasks = taskList.children.length;
  const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
  progressbar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
   progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

   if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
    Confetti();
   }

};
const saveToLocalStorage = () => {
  const tasks = Array.from(taskList.querySelectorAll("li")).map(li => ({
    text: li.querySelector('span').textContent,
    completed: li.querySelector('.checkbox').checked
  }));
  localStorage.setItem('tasks',JSON.stringify(tasks));
  
};

const loadFromLocalStorage = () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks'))||[];
  savedTasks.forEach(({text, completed }) =>
    addTask(text, completed, false));
    imageSection();
    updateProgress();
  };  


 const addTask = (task, completed = false, checkCompletion = true) => {
  const taskInput = task || inputValue.value.trim();
  if (!taskInput) {
    return;
  }
  const li = document.createElement('li');
  li.innerHTML =`
  <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}/>
  <span>${taskInput}</span>
  <div class="input-buttons">
  <button class="edit-btn"><i        
        class="fa-solid fa-pen"></i></button>
  <button class="delete-btn"><i 
        class="fa-solid fa-trash"></i></button>
  
  </div>`;

  const checkbox = li.querySelector('.checkbox');
  const editBtn = li.querySelector('.edit-btn');
  if (completed) {
    li.classList.add('completed');
    editBtn.disabled = true;
    editBtn.style.opacity = '0.5';
  }
  checkbox.addEventListener('change', () => {
    const isChecked = checkbox.checked;
    li.classList.toggle('completed',isChecked);

    editBtn.disabled = isChecked;
    editBtn.style.opacity = isChecked ? '0.5' : '1';
    editBtn.style.pointerEvents = isChecked ? 'none':'auto';

    updateProgress();
    saveToLocalStorage();


  });
  editBtn.addEventListener('click', () => {
      if(!checkbox.checked) {
        inputValue.value = li.querySelector('span').textContent;
        li.remove();
        imageSection();
        updateProgress(false);
        saveToLocalStorage();
      };
  });
  li.querySelector('.delete-btn').addEventListener('click', () => {
    li.remove();
    imageSection();
    updateProgress();
    saveToLocalStorage();

  });


  taskList.appendChild(li);
  inputValue.value = '';
  imageSection();
  updateProgress(checkCompletion);
  saveToLocalStorage();


 };
 

 addTaskbtn.addEventListener('click', (e) => {

    e.preventDefault();
    addTask();
  });
 inputValue.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTask();
  };
 });
 loadFromLocalStorage();
});

const Confetti = () => {
    const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
    confetti (
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});


fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
  };