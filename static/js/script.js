document.addEventListener('DOMContentLoaded', function () {
    let moleculeIndex = 1;

    document.getElementById('addMoleculeButton').addEventListener('click', function() {
        addMoleculeForm();
    });

    function addMoleculeForm() {
        const formContainer = document.createElement('div');
        formContainer.classList.add('molecule-form');
        formContainer.innerHTML = `
            <div class="molecule-header" onclick="toggleMoleculeBody(${moleculeIndex})">
                <h3>Molécula ${moleculeIndex}</h3>
            </div>
            <div class="molecule-body" id="moleculeBody${moleculeIndex}">
                <label for="molecule_name_${moleculeIndex}">Nombre de la molécula:</label>
                <input type="text" id="molecule_name_${moleculeIndex}" name="molecule_name" required>
                <div id="atomPairsContainer${moleculeIndex}"></div>
                <button type="button" onclick="addAtomPair(${moleculeIndex})">Agregar Par de Átomos</button>
            </div>
        `;
        document.getElementById('moleculeFormsContainer').appendChild(formContainer);
        addAtomPair(moleculeIndex);
        moleculeIndex++;
    }

    window.addAtomPair = function(moleculeIndex) {
        const atomPairsContainer = document.getElementById(`atomPairsContainer${moleculeIndex}`);
        if (!atomPairsContainer) return;

        const atomPairIndex = atomPairsContainer.querySelectorAll('.atom-pair').length + 1;
        const atomPairContainer = document.createElement('div');
        atomPairContainer.classList.add('atom-pair');
        atomPairContainer.innerHTML = `
            <div class="atom-pair-header" onclick="toggleAtomPairBody(${moleculeIndex}, ${atomPairIndex})">
                <h4>Par de Átomos ${atomPairIndex}</h4>
            </div>
            <div class="atom-pair-body" id="atomPairBody${moleculeIndex}_${atomPairIndex}">
                <label for="type_${moleculeIndex}_${atomPairIndex}">Tipo de enlace:</label>
                <select id="type_${moleculeIndex}_${atomPairIndex}" name="type" required>
                    <option value="1JHC">1JHC</option>
                    <option value="2JHH">2JHH</option>
                    <option value="1JHN">1JHN</option>
                    <option value="2JHN">2JHN</option>
                    <option value="2JHC">2JHC</option>
                    <option value="3JHH">3JHH</option>
                    <option value="3JHC">3JHC</option>
                    <option value="3JHN">3JHN</option>
                </select>
                <div class="atom-header" onclick="toggleAtomBody(${moleculeIndex}, ${atomPairIndex}, 0)">
                    <h4>Átomo 1</h4>
                </div>
                <div class="atom-body" id="atomBody${moleculeIndex}_${atomPairIndex}_0">
                    <fieldset>
                    <label for="atom_0_${moleculeIndex}_${atomPairIndex}">Átomo:</label>
                    <input type="text" id="atom_0_${moleculeIndex}_${atomPairIndex}" name="atom_0" required>
                    <label for="x_0_${moleculeIndex}_${atomPairIndex}">Coordenada X:</label>
                    <input type="number" step="any" id="x_0_${moleculeIndex}_${atomPairIndex}" name="x_0" required>
                    <label for="y_0_${moleculeIndex}_${atomPairIndex}">Coordenada Y:</label>
                    <input type="number" step="any" id="y_0_${moleculeIndex}_${atomPairIndex}" name="y_0" required>
                    <label for="z_0_${moleculeIndex}_${atomPairIndex}">Coordenada Z:</label>
                    <input type="number" step="any" id="z_0_${moleculeIndex}_${atomPairIndex}" name="z_0" required>
                    <label for="mulliken_charge_0_${moleculeIndex}_${atomPairIndex}">Carga Mulliken:</label>
                    <input type="number" step="any" id="mulliken_charge_0_${moleculeIndex}_${atomPairIndex}" name="mulliken_charge_0" required>
                    <label class="tensor-label">Tensores de apantallamiento magnéticos:</label>
                    <label for="XX_0_${moleculeIndex}_${atomPairIndex}">XX:</label>
                    <input type="number" step="any" id="XX_0_${moleculeIndex}_${atomPairIndex}" name="XX_0" required>
                    <label for="YX_0_${moleculeIndex}_${atomPairIndex}">YX:</label>
                    <input type="number" step="any" id="YX_0_${moleculeIndex}_${atomPairIndex}" name="YX_0" required>
                    <label for="ZX_0_${moleculeIndex}_${atomPairIndex}">ZX:</label>
                    <input type="number" step="any" id="ZX_0_${moleculeIndex}_${atomPairIndex}" name="ZX_0" required>
                    <label for="XY_0_${moleculeIndex}_${atomPairIndex}">XY:</label>
                    <input type="number" step="any" id="XY_0_${moleculeIndex}_${atomPairIndex}" name="XY_0" required>
                    <label for="YY_0_${moleculeIndex}_${atomPairIndex}">YY:</label>
                    <input type="number" step="any" id="YY_0_${moleculeIndex}_${atomPairIndex}" name="YY_0" required>
                    <label for="ZY_0_${moleculeIndex}_${atomPairIndex}">ZY:</label>
                    <input type="number" step="any" id="ZY_0_${moleculeIndex}_${atomPairIndex}" name="ZY_0" required>
                    <label for="XZ_0_${moleculeIndex}_${atomPairIndex}">XZ:</label>
                    <input type="number" step="any" id="XZ_0_${moleculeIndex}_${atomPairIndex}" name="XZ_0" required>
                    <label for="YZ_0_${moleculeIndex}_${atomPairIndex}">YZ:</label>
                    <input type="number" step="any" id="YZ_0_${moleculeIndex}_${atomPairIndex}" name="YZ_0" required>
                    <label for="ZZ_0_${moleculeIndex}_${atomPairIndex}">ZZ:</label>
                    <input type="number" step="any" id="ZZ_0_${moleculeIndex}_${atomPairIndex}" name="ZZ_0" required>
                    </fieldset>
                </div>
                <div class="atom-header" onclick="toggleAtomBody(${moleculeIndex}, ${atomPairIndex}, 1)">
                    <h4>Átomo 2</h4>
                </div>
                <div class="atom-body" id="atomBody${moleculeIndex}_${atomPairIndex}_1">
                    <fieldset>
                    <label for="atom_1_${moleculeIndex}_${atomPairIndex}">Átomo:</label>
                    <input type="text" id="atom_1_${moleculeIndex}_${atomPairIndex}" name="atom_1" required>
                    <label for="x_1_${moleculeIndex}_${atomPairIndex}">Coordenada X:</label>
                    <input type="number" step="any" id="x_1_${moleculeIndex}_${atomPairIndex}" name="x_1" required>
                    <label for="y_1_${moleculeIndex}_${atomPairIndex}">Coordenada Y:</label>
                    <input type="number" step="any" id="y_1_${moleculeIndex}_${atomPairIndex}" name="y_1" required>
                    <label for="z_1_${moleculeIndex}_${atomPairIndex}">Coordenada Z:</label>
                    <input type="number" step="any" id="z_1_${moleculeIndex}_${atomPairIndex}" name="z_1" required>
                    <label for="mulliken_charge_1_${moleculeIndex}_${atomPairIndex}">Carga Mulliken:</label>
                    <input type="number" step="any" id="mulliken_charge_1_${moleculeIndex}_${atomPairIndex}" name="mulliken_charge_1" required>
                    <label class="tensor-label">Tensores de apantallamiento magnéticos:</label>
                    <label for="XX_1_${moleculeIndex}_${atomPairIndex}">XX:</label>
                    <input type="number" step="any" id="XX_1_${moleculeIndex}_${atomPairIndex}" name="XX_1" required>
                    <label for="YX_1_${moleculeIndex}_${atomPairIndex}">YX:</label>
                    <input type="number" step="any" id="YX_1_${moleculeIndex}_${atomPairIndex}" name="YX_1" required>
                    <label for="ZX_1_${moleculeIndex}_${atomPairIndex}">ZX:</label>
                    <input type="number" step="any" id="ZX_1_${moleculeIndex}_${atomPairIndex}" name="ZX_1" required>
                    <label for="XY_1_${moleculeIndex}_${atomPairIndex}">XY:</label>
                    <input type="number" step="any" id="XY_1_${moleculeIndex}_${atomPairIndex}" name="XY_1" required>
                    <label for="YY_1_${moleculeIndex}_${atomPairIndex}">YY:</label>
                    <input type="number" step="any" id="YY_1_${moleculeIndex}_${atomPairIndex}" name="YY_1" required>
                    <label for="ZY_1_${moleculeIndex}_${atomPairIndex}">ZY:</label>
                    <input type="number" step="any" id="ZY_1_${moleculeIndex}_${atomPairIndex}" name="ZY_1" required>
                    <label for="XZ_1_${moleculeIndex}_${atomPairIndex}">XZ:</label>
                    <input type="number" step="any" id="XZ_1_${moleculeIndex}_${atomPairIndex}" name="XZ_1" required>
                    <label for="YZ_1_${moleculeIndex}_${atomPairIndex}">YZ:</label>
                    <input type="number" step="any" id="YZ_1_${moleculeIndex}_${atomPairIndex}" name="YZ_1" required>
                    <label for="ZZ_1_${moleculeIndex}_${atomPairIndex}">ZZ:</label>
                    <input type="number" step="any" id="ZZ_1_${moleculeIndex}_${atomPairIndex}" name="ZZ_1" required>
                    </fieldset>
                </div>
            </div>
        `;
        atomPairsContainer.appendChild(atomPairContainer);
    }

    window.toggleMoleculeBody = function(index) {
        const body = document.getElementById(`moleculeBody${index}`);
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
    }

    window.toggleAtomPairBody = function(moleculeIndex, atomPairIndex) {
        const body = document.getElementById(`atomPairBody${moleculeIndex}_${atomPairIndex}`);
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
    }

    window.toggleAtomBody = function(moleculeIndex, atomPairIndex, atomIndex) {
        const body = document.getElementById(`atomBody${moleculeIndex}_${atomPairIndex}_${atomIndex}`);
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
    }

    document.getElementById('moleculesForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const moleculeForms = document.querySelectorAll('.molecule-form');
        const data = [];

        moleculeForms.forEach(form => {
            const moleculeData = {
                molecule_name: form.querySelector('input[name="molecule_name"]').value,
                atom_pairs: []
            };
            const atomPairs = form.querySelectorAll('.atom-pair');
            atomPairs.forEach(pair => {
                const pairData = {};
                pair.querySelectorAll('input, select').forEach(input => {
                    pairData[input.name] = input.value;
                });
                moleculeData.atom_pairs.push(pairData);
            });
            data.push(moleculeData);
        });

        try {
            document.getElementById('loader').style.display = 'block'; // Mostrar loader
            console.log(data)
            const response = await fetch('predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            document.getElementById('result').innerHTML = `
                <p>Predicción completada. <a href="/download/${result.csv_file.split('/').pop()}" target="_blank">Descargar CSV</a></p>
            `;
        } catch (error) {
            document.getElementById('result').innerText = 'Error: ' + error;
        } finally {
            document.getElementById('loader').style.display = 'none'; // Ocultar loader
        }
    });

    // Añadir el primer formulario de molécula por defecto
    addMoleculeForm();
});
