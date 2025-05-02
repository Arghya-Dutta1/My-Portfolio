// skills.js

class SkillsGlobe {
    constructor() {
      this.container = document.getElementById('skills-globe-container');
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.controls = null;
      this.sphere = null;
      
      // Define all skills with their positions on the globe
      this.skills = [
        // Core Languages (Middle band: -30° to 30° latitude)
        { name: 'JavaScript', icon: 'devicon-javascript-plain colored', lat: 0, lng: 0 },
        { name: 'Python', icon: 'devicon-python-plain colored', lat: 15, lng: -60 },
        { name: 'Java', icon: 'devicon-java-plain colored', lat: -15, lng: 60 },
        { name: 'TypeScript', icon: 'devicon-typescript-plain colored', lat: 5, lng: 120 },
        { name: 'C++', icon: 'devicon-cplusplus-plain colored', lat: -20, lng: -120 },
        { name: 'C', icon: 'devicon-c-plain colored', lat: -25, lng: -180 },
      
        // Web Technologies (Middle-upper band: 15° to 45° latitude)
        { name: 'HTML5', icon: 'devicon-html5-plain colored', lat: 30, lng: -30 },
        { name: 'CSS3', icon: 'devicon-css3-plain colored', lat: 30, lng: 30 },
        { name: 'React', icon: 'devicon-react-original colored', lat: 45, lng: 0 },
        { name: 'Next.js', icon: 'devicon-nextjs-original colored', lat: 45, lng: 180 },
        { name: 'Node.js', icon: 'devicon-nodejs-plain colored', lat: 30, lng: -90 },
        { name: 'Express.js', icon: 'devicon-express-original colored', lat: 45, lng: -90 },
      
        // Databases (Middle-lower band: -45° to -15° latitude)
        { name: 'MySQL', icon: 'devicon-mysql-plain colored', lat: -30, lng: -30 },
        { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored', lat: -30, lng: 30 },
        { name: 'MongoDB', icon: 'devicon-mongodb-plain colored', lat: -45, lng: 0 },
      
        // Styling Frameworks (Upper band: 45° to 75° latitude)
        { name: 'Tailwind', icon: 'devicon-tailwindcss-plain colored', lat: 60, lng: 45 },
        { name: 'Bootstrap', icon: 'devicon-bootstrap-plain colored', lat: -60, lng: -180 },
      
        // Cloud & DevOps (Lower band: -75° to -45° latitude)
        { name: 'Docker', icon: 'devicon-docker-plain colored', lat: -40, lng: -60 },
        { name: 'Kubernetes', icon: 'devicon-kubernetes-plain colored', lat: -40, lng: -120 },
        { name: 'Git', icon: 'devicon-git-plain colored', lat: 0, lng: -90 },
        { name: 'GitHub', icon: 'devicon-github-original colored', lat: -45, lng: 90 },
      
        // Cloud Providers (Outer bands: ±60° to ±75° latitude)
        { name: 'AWS', icon: 'devicon-amazonwebservices-plain colored', lat: 30, lng: 120 },
        { name: 'GCP', icon: 'devicon-googlecloud-plain colored', lat: 75, lng: 120 },
        { name: 'Azure', icon: 'devicon-azure-plain colored', lat: 55, lng: -120 }
      ];
      
      this.init();
    }
  
    init() {
      // Setup renderer
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.container.appendChild(this.renderer.domElement);
  
      // Setup camera
      this.camera.position.z = 4;
  
      // Create simple solid globe
      const geometry = new THREE.SphereGeometry(2, 64, 64);
      const material = new THREE.MeshBasicMaterial({
        color: 0x7aa2f7,
        transparent: true,
        opacity: 0.8
      });
      this.sphere = new THREE.Mesh(geometry, material);
      this.scene.add(this.sphere);
  
      // Add simple lighting
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 3, 5);
      this.scene.add(light);
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  
      // Add controls
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.rotateSpeed = 0.5;
      this.controls.enableZoom = false;
  
      // Add skill icons
      this.addSkillIcons();
  
      // Start animation
      this.animate();
  
      // Handle window resize
      window.addEventListener('resize', () => this.onWindowResize());
    }
  
    addSkillIcons() {
      this.skills.forEach(skill => {
        const icon = document.createElement('i');
        icon.className = `skill-icon ${skill.icon}`;
        icon.setAttribute('data-name', skill.name);
        this.container.appendChild(icon);
        
        const position = this.latLngToVector3(skill.lat, skill.lng);
        skill.position = position;
      });
    }
  
    latLngToVector3(lat, lng) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(Math.sin(phi) * Math.cos(theta));
      const z = (Math.sin(phi) * Math.sin(theta));
      const y = Math.cos(phi);
      return new THREE.Vector3(x, y, z).multiplyScalar(2);
    }
  
    updateSkillIconsPosition() {
      this.skills.forEach(skill => {
        const position = skill.position.clone();
        position.applyMatrix4(this.sphere.matrixWorld);
        const coords = this.toScreenPosition(position);
        
        const icon = this.container.querySelector(`.${skill.icon.replace(/ /g, '.')}`);
        if (icon) {
          icon.style.left = `${coords.x}px`;
          icon.style.top = `${coords.y}px`;
          // Fade icons based on position
          const opacity = position.z > 0 ? 1 : 0;
          icon.style.opacity = opacity;
        }
      });
    }
  
    toScreenPosition(vector) {
      vector.project(this.camera);
      return {
        x: (vector.x * 0.5 + 0.5) * this.container.clientWidth,
        y: (-vector.y * 0.5 + 0.5) * this.container.clientHeight
      };
    }
  
    onWindowResize() {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
  
    animate() {
      requestAnimationFrame(() => this.animate());
      this.sphere.rotation.y += 0.001;
      this.controls.update();
      this.updateSkillIconsPosition();
      this.renderer.render(this.scene, this.camera);
    }
  }
  
  // Skills Progress Bar Animation
//   function animateSkills() {
//     const skillBars = document.querySelectorAll('.skill-progress');
    
//     const animateBar = (bar) => {
//       const target = bar.getAttribute('data-progress');
//       let width = 0;
//       const interval = setInterval(() => {
//         if (width >= target) {
//           clearInterval(interval);
//         } else {
//           width++;
//           bar.style.width = width + '%';
//         }
//       }, 10);
//     };
  
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           skillBars.forEach(bar => animateBar(bar));
//           observer.unobserve(entry.target);
//         }
//       });
//     }, { threshold: 0.1 });
  
//     const skillsSection = document.querySelector('.skills');
//     if (skillsSection) {
//       observer.observe(skillsSection);
//     }
//   }
  
  // Initialize everything when the page loads
  window.addEventListener('load', () => {
    const globe = new SkillsGlobe();
    animateSkills();
  });