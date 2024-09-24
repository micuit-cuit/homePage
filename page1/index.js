//switch le theme de la page
function switchTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}
//load le theme
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
    //charge l'image de fond
    document.body.style.backgroundImage = `url(${localStorage.getItem('backgroundImage')||""})`;
    document.body.style.backgroundSize = localStorage.getItem('backgroundImageOptions') || 'auto';
    //charge l'iframe
    if (localStorage.getItem('iframe')) {
        let iframe = document.createElement('iframe');
        iframe.src = localStorage.getItem('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        document.querySelector('.display').appendChild(iframe);
    }
    //charge le titre de la page
    document.title = (localStorage.getItem('title') || 'Nouvel Onglet')+' - creat by Micuit-cuit';
    document.querySelector('h1').textContent = localStorage.getItem('title') || 'Nouvel Onglet';
})
//récupert les racourcis depuis le local storage
function getShortcuts() {
    if (localStorage.getItem('shortcuts') !== null) {
        return JSON.parse(localStorage.getItem('shortcuts'));
    } else {
        return [];
    }
}
//ajoute un racourci
function addShortcut(link, name, icon,isUrl) {
    let shortcuts = getShortcuts();
    const id = Math.random().toString(36).substring(2, 15);
    shortcuts.push({ link, name, icon, isUrl , id});
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    displayShortcuts();
}
//supprime un racourci
function removeShortcut(shortcut) {
    let shortcuts = getShortcuts();
    shortcuts = shortcuts.filter(s => s !== shortcut);
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    displayShortcuts();
}
//modifie un racourci
function editShortcut(oldShortcut, newShortcut) {
    let shortcuts = getShortcuts();
    let index = shortcuts.indexOf(oldShortcut);
    shortcuts[index] = newShortcut;
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    displayShortcuts();
}
//modifie l'ordre des racourcis
function reorderShortcuts(shortcutId, newIndex) {
    let shortcuts = getShortcuts();
    let shortcut = shortcuts.find(s => s.id === shortcutId);
    let index = shortcuts.indexOf(shortcut);
    shortcuts.splice(index, 1);
    shortcuts.splice(newIndex, 0, shortcut);
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    displayShortcuts();
}


//affiche les racourcis
function displayShortcuts() {
    let shortcuts = getShortcuts();
    let shortcutsContainer = document.querySelector('.shortcuts');
    shortcutsContainer.innerHTML = '';
    shortcuts.forEach(s => {
        let shortcut = document.createElement('div');
        shortcut.classList.add('shortcut');
        shortcut.innerHTML = `
            <a href="${s.link}" class="shortcut-link">
                ${s.isUrl ? '<img src="'+s.icon+'" alt="'+s.name+'">' : '<i class="shortcut-icon '+s.icon+' fa-solide"></i>'}
                <span class="shortcut-name">${s.name}</span>
            </a>
        `;
        shortcutsContainer.appendChild(shortcut);
    });
}
displayShortcuts();
let settingsIsOppened = false;
//crée un menu pour les paramètres
function createSettingsMenu() {
    if (settingsIsOppened) {closeSettingsMenu(); return;}
    settingsIsOppened = true;
    let settingsMenu = document.createElement('div');
    settingsMenu.classList.add('settings-menu');
    settingsMenu.innerHTML = `
<div class="popup-overlay">
    <div class="settings-popup">
        <div>
            <h4>Thème</h4>
            <button class="switch-theme" onclick="switchTheme()">Changer de thème</button>
            <h4>Titre</h4>
            <input type="text" class="title" oninput="updateTitle()" placeholder="Titre de la page" value="${localStorage.getItem('title')||""}">
        </div>
        <div>
            <h4>fond d'écran</h4>
            <input type="text" class="background-image" placeholder="URL de l'image" value="${localStorage.getItem('backgroundImage')||""}">
            <label for="options-background-image">option d'affichage</label>
            <select name="options-background-image" id="options-background-image">
                <option value="cover" ${localStorage.getItem('backgroundImageOptions') === 'cover' ? 'selected' : ''}>Cover</option>
                <option value="contain" ${localStorage.getItem('backgroundImageOptions') === 'contain' ? 'selected' : ''}>Contain</option>
                <option value="auto" ${localStorage.getItem('backgroundImageOptions') === 'auto' ? 'selected' : ''}>Auto</option>
                <option value="initial" ${localStorage.getItem('backgroundImageOptions') === 'initial' ? 'selected' : ''}>Initial</option>
                <option value="inherit" ${localStorage.getItem('backgroundImageOptions') === 'inherit' ? 'selected' : ''}>Inherit</option>
                <option value="unset" ${localStorage.getItem('backgroundImageOptions') === 'unset' ? 'selected' : ''}>Unset</option>
            </select>
            <button class="apply-background-image" onclick="applyBackgroundImage()">Appliquer l'image de fond</button>
            <button class="remove-background-image" onclick="removeBackgroundImage()">Supprimer l'image de fond</button>
        </div>
        <div>
            <h4>Raccourcis</h4>
            <button class="add-shortcut" onclick="createShortcutEditor()">Modifier les raccourci</button>
            <h4>iframe</h4>
            <input type="text" class="iframe" placeholder="URL de l'iframe" value="${localStorage.getItem('iframe')||""}">
            <button class="apply-iframe" onclick="applyIframe()">Appliquer l'iframe</button>
            <button class="remove-iframe" onclick="removeIframe()">Supprimer l'iframe</button>
        </div>
        <button class="save-settings">Sauvegarder</button>
    </div>
</div>
        `;
    document.body.appendChild(settingsMenu);
    //ajoute un event listener pour le bouton de mise a jour de l'image de fond
    let eventListener = []
    eventListener.push(document.querySelector('#options-background-image').addEventListener('click', updateBackgroundImageOptions));
    //ajoute un event listener pour le changement de l'image de fond
    eventListener.push(document.querySelector('.background-image').addEventListener('change', applyBackgroundImage));
    //ajoute un event listener pour la touche echap et le bouton save settings
    document.querySelector('.save-settings').addEventListener('click', closeSettingsMenu);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSettingsMenu();
            //suprime les event listener
            eventListener.forEach(e => {
                e.removeEventListener();
            }
            )
            window.removeEventListener('keydown', this);
        }
    })
    function closeSettingsMenu() {
        settingsIsOppened = false;
        //recharge les raccourcis
        displayShortcuts();
        //supprime le menu
        document.querySelector('.settings-menu').remove();
    }
    
}
function updateBackgroundImageOptions() {
    let options = document.getElementById('options-background-image');
    applyBackgroundImage();
    options.addEventListener('change', () => {
        document.body.style.backgroundSize = options.value;
    })
}
function updateTitle() {
    let title = document.querySelector('.title').value;
    document.title = title+' - creat by Micuit-cuit';
    document.querySelector('h1').textContent = title;
    localStorage.setItem('title', title);
}
function applyBackgroundImage() {
    console.log('applyBackgroundImage');
    let url = document.querySelector('.background-image').value;
    document.body.style.backgroundImage = `url(${url})`;
    localStorage.setItem('backgroundImage', url);
    localStorage.setItem('backgroundImageOptions', document.getElementById('options-background-image').value);
}
//supprime l'image de fond
function removeBackgroundImage() {
    document.body.style.backgroundImage = 'none';
    localStorage.removeItem('backgroundImage');
}
//applique l'iframe
function applyIframe() {
    let url = document.querySelector('.iframe').value;
    //suprime l'iframe actuel si il y en a un
    if (document.querySelector('iframe')) {
        document.querySelectorAll('iframe').forEach(iframe => {
            iframe.remove();
        })
    }
    let iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    document.querySelector('.display').appendChild(iframe);
    localStorage.setItem('iframe', url);
}
//supprime l'iframe
function removeIframe() {
    document.querySelector('iframe').remove();
    localStorage.removeItem('iframe');
}

let shortcutEditorIsOppened = false;
//crée un éditeur de racourci
function createShortcutEditor() {
    if (shortcutEditorIsOppened) {closeShortcutEditor(); return;}
    shortcutEditorIsOppened = true;
    //affiche la popup
    const shortcutEditor = document.createElement('div');
    shortcutEditor.classList.add('shortcut-editor');
    shortcutEditor.innerHTML = `
        <div class="popup-overlay">
            <div class="shortcuts-editor">
                <h3>Éditeur de raccourcis</h3>
                <div class="shortcuts-list">
                    <!-- Les raccourcis seront affichés ici dynamiquement -->
                </div>
                <h4>Ajouter un nouveau raccourci</h4>
                <input type="text" id="shortcut-name" placeholder="Nom du raccourci">
                <input type="text" id="shortcut-link" placeholder="Lien du raccourci">
                <input type="text" id="shortcut-icon" placeholder="Icône (fa-home)">
                <p>Vous pouvez trouver des icônes sur <a href="https://fontawesome.com/search?o=r&m=free" target="_blank">FontAwesome</a>, copiez simplement le code et collez le ici.</p>
                <button onclick="handleAddShortcut()">Ajouter un raccourci</button>
                <button onclick="closeShortcutEditor()">Fermer</button>
            </div>
        </div>
    `;
    document.body.appendChild(shortcutEditor);
    displayShortcutsEditor();
}
function displayShortcutsEditor() {
    const shortcuts = getShortcuts();
    const shortcutsList = document.querySelector('.shortcuts-list');
    shortcutsList.innerHTML = ''; // Réinitialise la liste avant de la redessiner

    shortcuts.forEach((shortcut, index) => {
        const shortcutItem = document.createElement('div');
        shortcutItem.classList.add('shortcut-item');
        shortcutItem.innerHTML = `
            <div class="shortcut-item-content">
                ${shortcut.isUrl ? '<img src="'+shortcut.icon+'" alt="'+shortcut.name+'">' : '<i class="shortcut-icon '+shortcut.icon+' fa-solide"></i>'}
                <span>${shortcut.name}</span>
            </div>
            <div >
                <button class="shortcut-button" onclick="handleEditShortcut('${shortcut.id}')">Modifier</button>
                <button class="shortcut-button" onclick="handleRemoveShortcut('${shortcut.id}')">Supprimer</button>
                <button class="shortcut-button" onclick="handleMoveShortcut('${shortcut.id}', ${index - 1})">⬆️</button>
                <button class="shortcut-button" onclick="handleMoveShortcut('${shortcut.id}', ${index + 1})">⬇️</button>
            </div>
        `;
        shortcutsList.appendChild(shortcutItem);
    });
}
function closeShortcutEditor() {
    shortcutEditorIsOppened = false;
    document.querySelector('.shortcut-editor').remove();
}

function getShortcuts() {
    return JSON.parse(localStorage.getItem('shortcuts')) || [];
}

function handleAddShortcut() {
    const name = document.getElementById('shortcut-name').value;
    const link = document.getElementById('shortcut-link').value;
    const icon = document.getElementById('shortcut-icon').value;
    //esseille de comprendre si l'icone est valide ou non
    //test si l'icone est une url
    let isUrl = false;
    if (!icon.startsWith('http')) {
        //test si l'icone est une icone fontawesome
        if (!icon.startsWith('fa-')) {
            //test si l'icone est une icone fontawesome en entier
            if (!icon.startsWith('<i class="fa')) {
                alert('L\'icone n\'est pas valide');
                return;
            }else{  
                //recupere le nom de l'icone
                icon = icon.match(/fa-[a-z-]+/)[0];
            }
        }
        isUrl = true;
    }

    if (name && link && icon) {
        addShortcut(link, name, icon, isUrl);
        displayShortcuts();
        //update le rendu des raccourcis dans l'editeur
        displayShortcutsEditor();
        //vide les champs
        document.getElementById('shortcut-name').value = '';
        document.getElementById('shortcut-link').value = '';
        document.getElementById('shortcut-icon').value = 'fa-home';
    } else {
        alert('Veuillez remplir tous les champs !');
    }
}

function handleRemoveShortcut(id) {
    const shortcuts = getShortcuts();
    const updatedShortcuts = shortcuts.filter(shortcut => shortcut.id !== id);
    localStorage.setItem('shortcuts', JSON.stringify(updatedShortcuts));
    displayShortcuts();
    displayShortcutsEditor();

}

function handleEditShortcut(id) {
    const shortcuts = getShortcuts();
    const shortcut = shortcuts.find(shortcut => shortcut.id === id);
    
    const newName = prompt('Nouveau nom:', shortcut.name);
    const newLink = prompt('Nouveau lien:', shortcut.link);
    const newIcon = prompt('Nouvelle icône (URL):', shortcut.icon);
    
    if (newName && newLink && newIcon) {
        editShortcut(shortcut, { name: newName, link: newLink, icon: newIcon, id: shortcut.id });
        displayShortcuts();
        displayShortcutsEditor();
    } else {
        alert('Veuillez entrer des informations valides pour le raccourci.');
    }
}

function handleMoveShortcut(id, newIndex) {
    let shortcuts = getShortcuts();
    const currentIndex = shortcuts.findIndex(shortcut => shortcut.id === id);
    
    if (newIndex < 0 || newIndex >= shortcuts.length) {
        return; // Ignore si l'index est en dehors des limites
    }

    reorderShortcuts(id, newIndex);
    displayShortcuts();
    displayShortcutsEditor();

}

function reorderShortcuts(shortcutId, newIndex) {
    const shortcuts = getShortcuts();
    const currentIndex = shortcuts.findIndex(shortcut => shortcut.id === shortcutId);
    const [movedShortcut] = shortcuts.splice(currentIndex, 1);
    shortcuts.splice(newIndex, 0, movedShortcut);
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
}

function editShortcut(oldShortcut, newShortcut) {
    const shortcuts = getShortcuts();
    const index = shortcuts.findIndex(shortcut => shortcut.id === oldShortcut.id);
    shortcuts[index] = newShortcut;
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    displayShortcuts();
}