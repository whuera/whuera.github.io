import * as d3 from "d3"

document.addEventListener("DOMContentLoaded", () => {
  // Treemap data structure
  const data = {
    name: "Projects",
    children: [
      {
        name: "Ecuador",
        color: "#4e79a7",
        url: "ecuador.html",
        children: [
          {
            name: "Quito",
            value: 2,
            description: "Tarjeta Prepago & Core Banco Pichincha",
          },
          {
            name: "Guayaquil",
            value: 1,
            description: "Integración MoneyGram",
          },
        ],
      },
      {
        name: "Colombia",
        color: "#76b7b2",
        url: "colombia.html",
        children: [
          {
            name: "Bogotá",
            value: 1,
            description: "Módulo de autenticación Banco Davivienda",
          },
        ],
      },
      {
        name: "Panama",
        color: "#e15759",
        url: "panama.html",
        children: [
          {
            name: "Panama City",
            value: 1,
            description: "Módulo de autenticación Banco Davivienda",
          },
        ],
      },
      {
        name: "Spain",
        color: "#5470c6",
        url: "spain.html",
        children: [
          {
            name: "Madrid",
            value: 1,
            description: "Core Banco Pichincha España",
          },
        ],
      },
    ],
  }

  // Create the treemap
  createTreemap(data)

  // Country cards interaction
  const countryCards = document.querySelectorAll(".country-card")
  countryCards.forEach((card) => {
    card.addEventListener("click", function () {
      const countryCode = this.getAttribute("data-country")
      window.location.href = `${countryCode}.html`
    })
  })

  // Function to create the treemap
  function createTreemap(data) {
    const treemapContainer = document.getElementById('treemap');
    treemapContainer.innerHTML = ''; // Clear existing content

    const width = treemapContainer.clientWidth;
    const height = treemapContainer.clientHeight;

    if (width === 0 || height === 0) {
      console.error('El contenedor del treemap no tiene dimensiones definidas.');
      return;
    }

    // Calculate total value for proportional sizing
    let totalValue = 0;
    data.children.forEach(country => {
      country.totalValue = 0;
      country.children.forEach(city => {
        country.totalValue += city.value;
        totalValue += city.value;
      });
    });

    // Calculate country rectangles
    let currentY = 0;
    data.children.forEach(country => {
      const countryHeight = (country.totalValue / totalValue) * height;

      // Create country rectangle
      const countryDiv = document.createElement('div');
      countryDiv.className = 'treemap-node';
      countryDiv.style.backgroundColor = country.color;
      countryDiv.style.left = '0px';
      countryDiv.style.top = currentY + 'px';
      countryDiv.style.width = width + 'px';
      countryDiv.style.height = countryHeight + 'px';
      countryDiv.setAttribute('title', `${country.name}: ${country.totalValue} ${country.totalValue === 1 ? 'Project' : 'Projects'}`);
      countryDiv.addEventListener('click', function () {
        window.location.href = country.url;
      });

      // Add country label
      const countryLabel = document.createElement('div');
      countryLabel.className = 'treemap-label';
      countryLabel.textContent = country.name;
      countryDiv.appendChild(countryLabel);

      treemapContainer.appendChild(countryDiv);

      // Calculate city rectangles within country
      let currentX = 0;
      country.children.forEach(city => {
        const cityWidth = (city.value / country.totalValue) * width;

        // Create city rectangle
        const cityDiv = document.createElement('div');
        cityDiv.className = 'treemap-node';
        cityDiv.style.backgroundColor = adjustBrightness(country.color, 20);
        cityDiv.style.left = currentX + 'px';
        cityDiv.style.top = (currentY + countryHeight * 0.4) + 'px';
        cityDiv.style.width = cityWidth + 'px';
        cityDiv.style.height = (countryHeight * 0.6) + 'px';
        cityDiv.setAttribute('title', `${city.name}: ${city.description}`);
        cityDiv.addEventListener('click', function () {
          window.location.href = country.url;
        });

        // Add city label
        const cityLabel = document.createElement('div');
        cityLabel.className = 'treemap-label';
        cityLabel.textContent = city.name;
        cityDiv.appendChild(cityLabel);

        treemapContainer.appendChild(cityDiv);

        currentX += cityWidth;
      });

      currentY += countryHeight;
    });
  }

  // Helper function to adjust color brightness
  function adjustBrightness(hex, percent) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.min(255, r + percent);
    g = Math.min(255, g + percent);
    b = Math.min(255, b + percent);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    createTreemap(data)
  })
})
