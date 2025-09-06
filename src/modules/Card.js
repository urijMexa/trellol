export class Card {
    constructor(data, onDelete) {
        this.id = data.id
        this.text = data.text
        this.onDelete = onDelete
        this.element = null
    }

    render() {
        this.element = document.createElement('div')
        this.element.className = 'card'
        this.element.draggable = true
        this.element.dataset.cardId = this.id

        const cardText = document.createElement('p')
        cardText.textContent = this.text

        const deleteButton = document.createElement('span')
        deleteButton.className = 'delete-card'
        deleteButton.innerHTML = '×'
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation()
            this.onDelete(this.id)
        })

        this.element.append(cardText, deleteButton)
        return this.element
    }
}
