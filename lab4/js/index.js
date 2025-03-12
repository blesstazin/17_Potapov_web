const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

let reviews = [
    { name: "Алексей", text: "Купил, жду миллионы. Пока только монеты липнут(", rating: 5 },
    { name: "Мария", text: "Теперь выгляжу как настоящий богач (наверное)", rating: 4 },
    { name: "Игорь", text: "Развод, не ведитесь (но ассистентка симпатичная)", rating: 3 }
];

function displayReviews(reviewArray) {
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    reviewArray.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');
        reviewItem.innerHTML = `<strong>${review.name}</strong> (${review.rating}/5 ⭐️): ${review.text}`;
        reviewList.appendChild(reviewItem);
    });
}

function sortReviews(reviews, sortBy) {
    if (sortBy === 'rating-desc') {
        return reviews.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'rating-asc') {
        return reviews.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'name') {
        return reviews.sort((a, b) => a.name.localeCompare(b.name));
    }
    return reviews;
}

function filterReviews(reviews, minRating) {
    if (!minRating) return reviews;
    return reviews.filter(review => review.rating >= minRating);
}

const reviewForm = document.getElementById('review-form');
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('review-name').value.trim();
    const text = document.getElementById('review-text').value.trim();
    const rating = parseFloat(document.getElementById('review-rating').value);

    if (!name || !text || isNaN(rating) || rating < 1 || rating > 5) {
        alert('Пожалуйста, заполните все поля корректно. Оценка должна быть от 1 до 5.');
        return;
    }

    reviews.push({ name, text, rating });

    const sortBy = document.getElementById('sort-reviews').value;
    const minRating = document.getElementById('filter-reviews').value;

    const filteredReviews = filterReviews(reviews, minRating);
    const sortedReviews = sortReviews(filteredReviews, sortBy);

    displayReviews(sortedReviews);

    reviewForm.reset();
});

document.getElementById('sort-reviews').addEventListener('change', (e) => {
    const filtered = filterReviews(reviews, document.getElementById('filter-reviews').value);
    displayReviews(sortReviews(filtered, e.target.value));
});

document.getElementById('filter-reviews').addEventListener('input', (e) => {
    const filtered = filterReviews(reviews, e.target.value);
    displayReviews(sortReviews(filtered, document.getElementById('sort-reviews').value));
});

displayReviews(reviews);