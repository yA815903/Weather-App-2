const form = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const notesList = document.getElementById('notes');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const searchInput = document.getElementById('search-input');
let editingNote = null;

// Load notes from local storage
document.addEventListener('DOMContentLoaded', loadNotes);

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (editingNote) {
        updateNote();
    } else {
        addNote();
    }
});

darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

searchInput.addEventListener('input', filterNotes);

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => {
        displayNote(note);
    });
}

function addNote() {
    const noteText = noteInput.value;
    if (noteText) {
        const note = { text: noteText };
        displayNote(note);
        saveNoteToLocalStorage(note);
        noteInput.value = '';
    }
}

function displayNote(note) {
    const li = document.createElement('li');
    li.classList.add('note');
    li.textContent = note.text;
    li.appendChild(createEditButton(note));
    li.appendChild(createDeleteButton());
    notesList.appendChild(li);
    
    // Trigger animation for adding note
    setTimeout(() => {
        li.classList.add('show');
    }, 10);
}

function createEditButton(note) {
    const button = document.createElement('button');
    button.textContent = 'Edit';
    button.onclick = () => {
        noteInput.value = note.text;
        editingNote = note;
    };
    return button;
}

function createDeleteButton() {
    const button = document.createElement('button');
    button.textContent = 'Delete';
    button.onclick = () => {
        const noteItem = button.parentElement;
        noteItem.classList.add('delete'); // Trigger delete animation
        setTimeout(() => {
            noteItem.remove();
            removeNoteFromLocalStorage(noteItem.textContent);
        }, 300); // Match the duration of the CSS transition
    };
    return button;
}

function updateNote() {
    const noteText = noteInput.value;
    if (noteText && editingNote) {
        editingNote.text = noteText;
        notesList.innerHTML = ''; // Clear the list
        loadNotes(); // Reload notes to display updated note
        noteInput.value = '';
        editingNote = null; // Reset editing note
    }
}

function filterNotes() {
    const searchText = searchInput.value.toLowerCase();
    const notes = document.querySelectorAll('#notes li');
    notes.forEach(note => {
        const noteText = note.textContent.toLowerCase();
        note.style.display = noteText.includes(searchText) ? '' : 'none';
    });
}

function saveNoteToLocalStorage(note) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function removeNoteFromLocalStorage(noteText) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.text !== noteText);
    localStorage.setItem('notes', JSON.stringify(notes));
}