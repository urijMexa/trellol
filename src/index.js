import './styles.css'
import { Storage } from './modules/Storage.js'
import { Column } from './modules/Column.js'
import { DragDrop } from './modules/DragDrop.js'

class Trellol {
    constructor() {
        this.columns = [
            { id: 1, title: 'TODO', cards: [] },
            { id: 2, title: 'IN PROGRESS', cards: [] },
            { id: 3, title: 'DONE', cards: [] }
        ]

        this.init()
    }

    init() {
        this.loadState()
        this.render()
        this.setupEventListeners()
    }

    loadState() {
        const savedState = Storage.loadState()
        if (savedState) {
            this.columns = savedState.columns
        } else {
            this.setDemoData()
            this.saveState()
        }
    }

    setDemoData() {
        this.columns[0].cards = [
            { id: Date.now() + 1, text: 'Welcome to Trellol' },
            { id: Date.now() + 2, text: 'This is a card.' },
            { id: Date.now() + 3, text: 'Click on a card to see what\'s behind it.' },
            { id: Date.now() + 4, text: '- 💬 1' },
            { id: Date.now() + 5, text: '- 💬 2' },
            { id: Date.now() + 6, text: 'You can attach pictures and files...' },
            { id: Date.now() + 7, text: '... any kind of hyperlink ...' },
            { id: Date.now() + 8, text: '- 💬 1' },
            { id: Date.now() + 9, text: '... or checklists.' },
            { id: Date.now() + 10, text: '- 💬 1/3' }
        ]

        this.columns[1].cards = [
            { id: Date.now() + 11, text: 'Invite your team to this board using the Add Members button' },
            { id: Date.now() + 12, text: 'Drag people onto a card to indicate that they\'re responsible for it.' },
            { id: Date.now() + 13, text: 'Use color-coded labels for organization' },
            { id: Date.now() + 14, text: 'Make as many lists as you need!' },
            { id: Date.now() + 15, text: 'Try dragging cards anywhere.' },
            { id: Date.now() + 16, text: 'Finished with a card? Archive it.' }
        ]

        this.columns[2].cards = [
            { id: Date.now() + 17, text: 'To learn more tricks, check out the guide.' },
            { id: Date.now() + 18, text: 'Use as many boards as you want. We\'ll make more!' },
            { id: Date.now() + 19, text: 'Want to use keyboard shortcuts? We have them!' },
            { id: Date.now() + 20, text: 'Want updates on new features?' },
            { id: Date.now() + 21, text: 'Need help?' },
            { id: Date.now() + 22, text: '☐' },
            { id: Date.now() + 23, text: 'Want current tips, usage examples, or API info?' },
            { id: Date.now() + 24, text: '☐' }
        ]
    }

    saveState() {
        Storage.saveState(this.columns)
    }

    render() {
        const app = document.getElementById('app')
        app.innerHTML = ''

        this.columns.forEach(columnData => {
            const column = new Column(
                columnData,
                (columnId, text) => this.addCard(columnId, text),
                (cardId) => this.deleteCard(cardId)
            )
            app.append(column.render())
        })
    }

    setupEventListeners() {
        DragDrop.init(this.columns, (cardId, newColumnId, newIndex) => {
            this.moveCard(cardId, newColumnId, newIndex)
        })

        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', card.dataset.cardId)
                setTimeout(() => {
                    card.classList.add('dragging')
                }, 0)
            })

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging')
            })
        })
    }

    addCard(columnId, text) {
        if (text.trim()) {
            const newCard = { id: Date.now(), text: text.trim() }
            const column = this.columns.find(col => col.id === columnId)
            column.cards.push(newCard)
            this.saveState()
            this.render()
            this.setupEventListeners()
        }
    }

    deleteCard(cardId) {
        for (const column of this.columns) {
            const index = column.cards.findIndex(card => card.id === cardId)
            if (index !== -1) {
                column.cards.splice(index, 1)
                this.saveState()
                this.render()
                this.setupEventListeners()
                break
            }
        }
    }

    moveCard(cardId, newColumnId, newIndex) {
        let card = null
        let oldColumnId = null

        for (const column of this.columns) {
            const cardIndex = column.cards.findIndex(c => c.id === cardId)
            if (cardIndex !== -1) {
                card = column.cards[cardIndex]
                oldColumnId = column.id
                column.cards.splice(cardIndex, 1)
                break
            }
        }

        if (card) {
            const newColumn = this.columns.find(col => col.id === newColumnId)
            newColumn.cards.splice(newIndex, 0, card)
            this.saveState()
        }
    }
}

new Trellol()
