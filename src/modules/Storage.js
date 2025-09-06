export class Storage {
    static saveState(columns) {
        localStorage.setItem('trellolState', JSON.stringify({ columns }))
    }

    static loadState() {
        const savedState = localStorage.getItem('trellolState')
        return savedState ? JSON.parse(savedState) : null
    }
}
