import './styles.css';

class Trellol {
    constructor() {
        this.columns = [
            { id: 1, title: 'TODO', cards: [] },
            { id: 2, title: 'IN PROGRESS', cards: [] },
            { id: 3, title: 'DONE', cards: [] }
        ];

        this.init();
    }

    init() {
        this.loadState();
        this.render();
        this.setupEventListeners();
    }

    loadState() {
        const savedState = localStorage.getItem('trellolState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.columns = state.columns;
        } else {
            // Initial demo data
            this.columns[0].cards = [
                { id: Date.now() + 1, text: 'Welcome to Trellol' },
                { id: Date.now() + 2, text: 'This is a card.' },
                { id: Date.now() + 3, text: 'Click on a card to see what\'s behind it.' }
            ];
            this.columns[1].cards = [
                { id: Date.now() + 4, text: 'Invite your team to this board using the Add Members button' },
                { id: Date.now() + 5, text: 'Drag people onto a card to indicate that they\'re responsible for it.' }
            ];
            this.columns[2].cards = [
                { id: Date.now() + 6, text: 'To learn more tricks, check out the guide.' },
                { id: Date.now() + 7, text: 'Use as many boards as you want. We\'ll make more!' }
            ];
            this.saveState();
        }
    }

    saveState() {
        localStorage.setItem('trellolState', JSON.stringify({
            columns: this.columns
        }));
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = '';

        this.columns.forEach(column => {
            const columnElement = this.createColumnElement(column);
            app.appendChild(columnElement);
        });
    }

    createColumnElement(column) {
        const columnElement = document.createElement('div');
        columnElement.className = 'column';
        columnElement.dataset.columnId = column.id;

        const titleElement = document.createElement('h2');
        titleElement.textContent = column.title;

        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'cards-container';

        column.cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            cardsContainer.appendChild(cardElement);
        });

        const addCardButton = document.createElement('button');
        addCardButton.className = 'add-card-btn';
        addCardButton.textContent = '+ Add another card';
        addCardButton.addEventListener('click', () => {
            this.addCard(column.id);
        });

        columnElement.appendChild(titleElement);
        columnElement.appendChild(cardsContainer);
        columnElement.appendChild(addCardButton);

        return columnElement;
    }

    createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.draggable = true;
        cardElement.dataset.cardId = card.id;

        const cardText = document.createElement('p');
        cardText.textContent = card.text;

        const deleteButton = document.createElement('span');
        deleteButton.className = 'delete-card';
        deleteButton.innerHTML = '&#xE951;';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteCard(card.id);
        });

        cardElement.appendChild(cardText);
        cardElement.appendChild(deleteButton);

        // Drag and drop events
        cardElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', card.id.toString());
            setTimeout(() => {
                cardElement.classList.add('dragging');
            }, 0);
        });

        cardElement.addEventListener('dragend', () => {
            cardElement.classList.remove('dragging');
        });

        return cardElement;
    }

    setupEventListeners() {
        const app = document.getElementById('app');

        // Setup drop zones for columns
        app.querySelectorAll('.column .cards-container').forEach(container => {
            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = this.getDragAfterElement(container, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (afterElement == null) {
                    container.appendChild(draggable);
                } else {
                    container.insertBefore(draggable, afterElement);
                }
            });

            container.addEventListener('drop', (e) => {
                e.preventDefault();
                const cardId = parseInt(e.dataTransfer.getData('text/plain'));
                const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
                const columnElement = e.target.closest('.column');
                const newColumnId = parseInt(columnElement.dataset.columnId);

                this.moveCard(cardId, newColumnId, this.getCardIndex(columnElement.querySelector('.cards-container'), cardElement));
            });
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    getCardIndex(container, cardElement) {
        return Array.from(container.children).indexOf(cardElement);
    }

    addCard(columnId) {
        const text = prompt('Enter card text:');
        if (text) {
            const newCard = { id: Date.now(), text };
            const column = this.columns.find(col => col.id === columnId);
            column.cards.push(newCard);
            this.saveState();
            this.render();
            this.setupEventListeners();
        }
    }

    deleteCard(cardId) {
        for (const column of this.columns) {
            const index = column.cards.findIndex(card => card.id === cardId);
            if (index !== -1) {
                column.cards.splice(index, 1);
                this.saveState();
                this.render();
                this.setupEventListeners();
                break;
            }
        }
    }

    moveCard(cardId, newColumnId, newIndex) {
        let card = null;
        let oldColumnId = null;

        // Find the card and its current column
        for (const column of this.columns) {
            const cardIndex = column.cards.findIndex(c => c.id === cardId);
            if (cardIndex !== -1) {
                card = column.cards[cardIndex];
                oldColumnId = column.id;
                column.cards.splice(cardIndex, 1);
                break;
            }
        }

        if (card && oldColumnId !== newColumnId) {
            const newColumn = this.columns.find(col => col.id === newColumnId);
            newColumn.cards.splice(newIndex, 0, card);
            this.saveState();
            this.render();
            this.setupEventListeners();
        }
    }
}

// Initialize the app
new Trellol();
