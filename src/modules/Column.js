import { Card } from './Card.js'

export class Column {
    constructor(data, onAddCard, onDeleteCard) {
        this.id = data.id
        this.title = data.title
        this.cards = data.cards
        this.onAddCard = onAddCard
        this.onDeleteCard = onDeleteCard
        this.element = null
    }

    render() {
        this.element = document.createElement('div')
        this.element.className = 'column'
        this.element.dataset.columnId = this.id

        const titleElement = document.createElement('h2')
        titleElement.textContent = this.title

        const cardsContainer = document.createElement('div')
        cardsContainer.className = 'cards-container'

        this.cards.forEach(cardData => {
            const card = new Card(cardData, this.onDeleteCard)
            cardsContainer.append(card.render())
        })

        const addCardButton = document.createElement('button')
        addCardButton.className = 'add-card-btn'
        addCardButton.textContent = '+ Add another card'
        addCardButton.addEventListener('click', () => {
            this.showAddCardForm()
        })

        this.element.append(titleElement, cardsContainer, addCardButton)
        return this.element
    }

    showAddCardForm() {
        const addCardButton = this.element.querySelector('.add-card-btn')
        addCardButton.style.display = 'none'

        const form = document.createElement('div')
        form.className = 'add-card-form'

        const textarea = document.createElement('textarea')
        textarea.placeholder = 'Enter a title for this card...'

        const actions = document.createElement('div')
        actions.className = 'add-card-actions'

        const addButton = document.createElement('button')
        addButton.className = 'add-card-confirm'
        addButton.textContent = 'Add Card'

        const cancelButton = document.createElement('button')
        cancelButton.className = 'add-card-cancel'
        cancelButton.innerHTML = '✗'

        actions.append(addButton, cancelButton)
        form.append(textarea, actions)
        this.element.append(form)

        textarea.focus()

        // Обработчики событий
        const confirmAdd = () => {
            const text = textarea.value.trim()
            if (text) {
                this.onAddCard(this.id, text)
            }
            this.removeAddCardForm()
        }

        const cancelAdd = () => {
            this.removeAddCardForm()
        }

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                confirmAdd()
            }
        })

        addButton.addEventListener('click', confirmAdd)
        cancelButton.addEventListener('click', cancelAdd)
    }

    removeAddCardForm() {
        const form = this.element.querySelector('.add-card-form')
        if (form) form.remove()

        const addCardButton = this.element.querySelector('.add-card-btn')
        if (addCardButton) addCardButton.style.display = 'block'
    }
}
