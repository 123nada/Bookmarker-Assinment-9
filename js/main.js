let bookmarks = [];
        const siteNameInput = document.getElementById('siteName');
        const siteURLInput = document.getElementById('siteURL');
        const bookmarkForm = document.getElementById('bookmarkForm');
        const tableBody = document.getElementById('tableBody');
        const validationModal = new bootstrap.Modal(document.getElementById('validationModal'));

        // Load bookmarks from localStorage
        function loadBookmarks() {
            const stored = localStorage.getItem('bookmarks');
            if (stored) {
                bookmarks = JSON.parse(stored);
                displayBookmarks();
            } else {
                showEmptyState();
            }
        }

        // Save bookmarks to localStorage
        function saveBookmarks() {
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        }

        // Validate URL
        function isValidURL(url) {
            const pattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
            return pattern.test(url);
        }

        // Validate site name
        function isValidName(name) {
            return name.trim().length >= 3;
        }

        // Check for duplicate name
        function isDuplicateName(name) {
            return bookmarks.some(bookmark => 
                bookmark.name.toLowerCase() === name.trim().toLowerCase()
            );
        }

        // Add bookmark
        function addBookmark(name, url) {
            // Ensure URL has protocol
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }

            const bookmark = {
                id: Date.now(),
                name: name.trim(),
                url: url.trim()
            };

            bookmarks.push(bookmark);
            saveBookmarks();
            displayBookmarks();
            clearForm();
        }

        // Delete bookmark
        function deleteBookmark(id) {
            bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
            saveBookmarks();
            
            if (bookmarks.length === 0) {
                showEmptyState();
            } else {
                displayBookmarks();
            }
        }

        // Display bookmarks
        function displayBookmarks() {
            let content = '';
            
            bookmarks.forEach((bookmark, index) => {
                content += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${bookmark.name}</strong></td>
                        <td>
                            <a href="${bookmark.url}" target="_blank" class="btn-visit">
                                <i class="fas fa-eye"></i> Visit
                            </a>
                        </td>
                        <td>
                            <button onclick="deleteBookmark(${bookmark.id})" class="btn-delete">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `;
            });

            tableBody.innerHTML = content;
        }

        // Show empty state
        function showEmptyState() {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        <div class="empty-state">
                            <i class="fas fa-bookmark"></i>
                            <p>No bookmarks yet. Add your first bookmark!</p>
                        </div>
                    </td>
                </tr>
            `;
        }

        // Clear form
        function clearForm() {
            siteNameInput.value = '';
            siteURLInput.value = '';
            siteNameInput.classList.remove('is-valid', 'is-invalid');
            siteURLInput.classList.remove('is-valid', 'is-invalid');
        }

        // Real-time validation
        siteNameInput.addEventListener('input', function() {
            if (this.value.trim().length >= 3) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else if (this.value.trim().length > 0) {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-valid', 'is-invalid');
            }
        });

        siteURLInput.addEventListener('input', function() {
            if (isValidURL(this.value.trim())) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else if (this.value.trim().length > 0) {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-valid', 'is-invalid');
            }
        });

        // Form submit
        bookmarkForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = siteNameInput.value;
            const url = siteURLInput.value;

            // Validate
            if (!isValidName(name) || !isValidURL(url)) {
                validationModal.show();
                siteNameInput.classList.add('is-invalid');
                siteURLInput.classList.add('is-invalid');
                return;
            }

            // Check for duplicate
            if (isDuplicateName(name)) {
                validationModal.show();
                siteNameInput.classList.add('is-invalid');
                return;
            }

            // Add bookmark
            addBookmark(name, url);
        });

        // Load bookmarks on page load
        loadBookmarks();