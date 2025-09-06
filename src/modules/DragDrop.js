export class DragDrop {
    static init(columns, onMoveCard) {
        const containers = document.querySelectorAll('.cards-container')

        containers.forEach(container => {
            container.addEventListener('dragover', (e) => {
                e.preventDefault()
                const afterElement = DragDrop.getDragAfterElement(container, e.clientY)
                const draggable = document.querySelector('.dragging')

                if (afterElement) {
                    container.insertBefore(draggable, afterElement)
                } else {
                    container.append(draggable)
                }
            })

            container.addEventListener('drop', (e) => {
                e.preventDefault()
                const cardId = parseInt(e.dataTransfer.getData('text/plain'))
                const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
                const columnElement = e.target.closest('.column')
                const newColumnId = parseInt(columnElement.dataset.columnId)

                const container = columnElement.querySelector('.cards-container')
                const newIndex = Array.from(container.children).indexOf(cardElement)

                onMoveCard(cardId, newColumnId, newIndex)
            })
        })
    }

    static getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')]

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2

            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child }
            }
            return closest
        }, { offset: Number.NEGATIVE_INFINITY }).element
    }
}
