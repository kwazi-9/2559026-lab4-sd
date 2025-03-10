document.addEventListener('DOMContentLoaded', function() {
    const countryForm = document.getElementById('country-form');
    const countryInput = document.getElementById('country-input');
    const errorMessage = document.getElementById('error-message');
    const loadingMessage = document.getElementById('loading');
    const countryInfo = document.getElementById('country-info');
    const countryName = document.getElementById('country-name');
    const capital = document.getElementById('capital');
    const population = document.getElementById('population');
    const region = document.getElementById('region');
    const flag = document.getElementById('flag');
    const neighbors = document.getElementById('neighbors');
    const noBorders = document.getElementById('no-borders');

    countryForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const country = countryInput.value.trim();
        if (!country) return;

        searchCountry(country);
    });

    async function searchCountry(countryName) {
        errorMessage.textContent = '';
        loadingMessage.textContent = 'Loading...';
        countryInfo.style.display = 'none';
        neighbors.innerHTML = '';

        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

            if (!response.ok) {
                throw new Error('Country not found. Please check the spelling and try again.');
            }

            const data = await response.json();
            const country = data[0];

            displayCountryInfo(country);

            if (country.borders && country.borders.length > 0) {
                noBorders.style.display = 'none';
                await fetchBorderingCountries(country.borders);
            } else {
                noBorders.style.display = 'block';
            }

            countryInfo.style.display = 'block';
            loadingMessage.textContent = '';

        } catch (error) {
            errorMessage.textContent = error.message || 'An error occurred. Please try again.';
            loadingMessage.textContent = '';
        }
    }

    function displayCountryInfo(country) {
        countryName.textContent = country.name.common;
        capital.textContent = country.capital ? country.capital[0] : 'Not available';
        population.textContent = country.population.toLocaleString();
        region.textContent = country.region;
        flag.src = country.flags.png;
        flag.alt = `Flag of ${country.name.common}`;
    }

    async function fetchBorderingCountries(borderCodes) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(',')}`);

            if (!response.ok) {
                throw new Error('Failed to fetch bordering countries');
            }

            const borderCountries = await response.json();

            borderCountries.forEach(country => {
                const neighborRow = document.createElement('p');
                neighborRow.className = 'neighbor-row';

                const nameSpan = document.createElement('span');
                nameSpan.className = 'neighbor-name';
                nameSpan.textContent = country.name.common;

                const flagSpan = document.createElement('span');
                flagSpan.className = 'neighbor-flag';

                const flagImg = document.createElement('img');
                flagImg.src = country.flags.png;
                flagImg.alt = `Flag of ${country.name.common}`;

                flagSpan.appendChild(flagImg);
                neighborRow.appendChild(nameSpan);
                neighborRow.appendChild(flagSpan);
                neighbors.appendChild(neighborRow);
            });

        } catch (error) {
            console.error('Error fetching bordering countries:', error);
            const errorElem = document.createElement('p');
            errorElem.textContent = 'Failed to load bordering countries.';
            errorElem.style.color = 'red';
            neighbors.appendChild(errorElem);
        }
    }
}); 