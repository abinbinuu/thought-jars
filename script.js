// Fresh Thought Jar App - Clean & Simple
class ThoughtJar {
    constructor() {
        this.thoughts = this.loadThoughts();
        this.drawCount = parseInt(localStorage.getItem('thoughtJarDrawCount') || '0');
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateStats();
    }

    bindEvents() {
        document.getElementById('addBtn').addEventListener('click', () => this.addThought());
        document.getElementById('drawBtn').addEventListener('click', () => this.drawThought());
        document.getElementById('showAllBtn').addEventListener('click', () => this.toggleAllThoughts());
        
        // Enter key support
        document.getElementById('thoughtInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.addThought();
            }
        });
    }

    addThought() {
        const input = document.getElementById('thoughtInput');
        const text = input.value.trim();
        
        if (!text) {
            alert('Please write something first!');
            return;
        }

        const thought = {
            id: Date.now(),
            text: text,
            created: new Date().toISOString()
        };

        this.thoughts.push(thought);
        this.saveThoughts();
        input.value = '';
        this.updateStats();
        
        this.showNotification('Thought saved! 🌟');
    }

    drawThought() {
        if (this.thoughts.length === 0) {
            alert('No thoughts in your jar yet! Add some first.');
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.thoughts.length);
        const selectedThought = this.thoughts[randomIndex];
        
        document.getElementById('thoughtDisplay').textContent = selectedThought.text;
        
        this.drawCount++;
        localStorage.setItem('thoughtJarDrawCount', this.drawCount.toString());
        this.updateStats();
        
        this.showNotification("Here's your thought! 💭");
    }

    toggleAllThoughts() {
        const container = document.getElementById('allThoughtsContainer');
        const btn = document.getElementById('showAllBtn');
        
        if (container.classList.contains('hidden')) {
            this.showAllThoughts();
            container.classList.remove('hidden');
            btn.textContent = 'Hide Thoughts';
        } else {
            container.classList.add('hidden');
            btn.textContent = 'Manage All Thoughts';
        }
    }

    showAllThoughts() {
        const container = document.getElementById('allThoughtsContainer');
        
        if (this.thoughts.length === 0) {
            container.innerHTML = '<p>No thoughts saved yet.</p>';
            return;
        }

        container.innerHTML = this.thoughts.map(thought => `
            <div class="thought-item">
                <div class="thought-text">${this.escapeHtml(thought.text)}</div>
                <div class="thought-date">Added: ${new Date(thought.created).toLocaleDateString()}</div>
                <button onclick="app.deleteThought('${thought.id}')" class="delete-btn">Delete</button>
            </div>
        `).join('');
    }

    deleteThought(id) {
        if (!confirm('Delete this thought?')) return;
        
        this.thoughts = this.thoughts.filter(t => t.id.toString() !== id.toString());
        this.saveThoughts();
        this.updateStats();
        this.showAllThoughts();
        
        this.showNotification('Thought deleted! 🗑️');
    }

    saveThoughts() {
        localStorage.setItem('thoughtJarData', JSON.stringify(this.thoughts));
        console.log('Thoughts saved:', this.thoughts);
    }

    loadThoughts() {
        const saved = localStorage.getItem('thoughtJarData');
        const thoughts = saved ? JSON.parse(saved) : [];
        console.log('Thoughts loaded:', thoughts);
        return thoughts;
    }

    updateStats() {
        const count = this.thoughts.length;
        document.getElementById('thoughtsCount').textContent = `${count} thought${count !== 1 ? 's' : ''} stored`;
        document.getElementById('totalCount').textContent = count;
        document.getElementById('drawCount').textContent = this.drawCount;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #4CAF50;
            color: white; padding: 1rem; border-radius: 5px; z-index: 1000;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ThoughtJar();
});
