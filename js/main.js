// Initialize AOS
AOS.init();

// Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Project Loading
async function loadProjects() {
    try {
        const response = await fetch('js/data.json');
        const data = await response.json();
        const projectsContainer = document.getElementById('projects-container');
        
        data.projects.forEach(project => {
            const projectCard = `
                <div class="project-card" data-aos="fade-up">
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-links">
                            <a href="${project.github}" target="_blank">GitHub</a>
                            <a href="${project.demo}" target="_blank">Live Demo</a>
                        </div>
                    </div>
                </div>
            `;
            projectsContainer.innerHTML += projectCard;
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Skills Animation
// function animateSkills() {
//     const skillBars = document.querySelectorAll('.skill-progress');
//     skillBars.forEach(bar => {
//         const target = bar.getAttribute('data-progress');
//         bar.style.width = target + '%';
//     });
// }

// Contact Form
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your form submission logic here
});

// Coding Profiles Graph
function drawRatingGraph(canvas, data) {
    const ctx = canvas.getContext('2d');
    // Add your graph drawing logic here
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    animateSkills();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Typewriter effect
class TypeWriter {
    constructor(element, words, waitTime = 3000) {
        this.element = element;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.waitTime = parseInt(waitTime, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // Current word index
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if(this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element
        this.element.innerHTML = `<span class="txt">${this.txt}</span>`;

        // Initial Type Speed
        let typeSpeed = 200;

        if(this.isDeleting) {
            typeSpeed /= 2; // Faster delete speed
        }

        // If word is complete
        if(!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.waitTime;
            // Set delete to true
            this.isDeleting = true;
        } else if(this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Init On DOM Load
document.addEventListener('DOMContentLoaded', init);

// Init App
function init() {
    const typewriter = document.querySelector('.typewriter');
    const words = ['Arghya Dutta', 'a Developer', 'a Problem Solver']; // You can add more variations
    
    new TypeWriter(typewriter, words);
}

VanillaTilt.init(document.querySelectorAll(".project-card"), {
    max: 25,
    speed: 400,
    glare: true,
    "max-glare": 0.5,
});
