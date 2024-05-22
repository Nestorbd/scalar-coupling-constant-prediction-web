from flask import Flask, request, jsonify, render_template, send_from_directory
import h2o
import pandas as pd
import os
import uuid
import pickle
from sklearn.preprocessing import LabelEncoder, StandardScaler

# Iniciar H2O
h2o.init()

# Cargar el modelo guardado
model_path = "model_trained/modelo_entrenado"
model = h2o.load_model(model_path)

# Crear una aplicación Flask
app = Flask(__name__)

# Definir la carpeta para guardar los archivos CSV
output_folder = 'outputs'
os.makedirs(output_folder, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    # Verificar si 'data' es una lista
    if isinstance(data, list):
        flat_data = []
        for molecule in data:
            molecule_name = molecule.get('molecule_name', '')
            for pair in molecule.get('atom_pairs', []):
                pair['molecule_name'] = molecule_name  # Añadir nombre de la molécula al par de átomos
                flat_data.append(pair)
    else:
        return jsonify({"error": "Formato de datos no válido"}), 400

    # Crear DataFrame de pandas
    data_df = pd.DataFrame(flat_data)

    # Imprimir una muestra de los datos antes de la conversión
    print("Datos antes de la conversión a numéricos:")
    print(data_df.head())

    # Convertir las columnas relevantes a tipos numéricos
    columns_to_convert = [
        'x_0', 'x_1', 'y_0', 'y_1', 'z_0', 'z_1', 'mulliken_charge_0', 
        'mulliken_charge_1', 'XX_0', 'YX_0', 'ZX_0', 'XY_0', 'YY_0', 
        'ZY_0', 'XZ_0', 'YZ_0', 'ZZ_0', 'XX_1', 'YX_1', 'ZX_1', 'XY_1', 
        'YY_1', 'ZY_1', 'XZ_1', 'YZ_1', 'ZZ_1'
    ]

    # Convertir cada columna a numérico y verificar conversiones
    for col in columns_to_convert:
        data_df[col] = pd.to_numeric(data_df[col], errors='coerce')
        # Verificar si hay valores NaN después de la conversión
        if data_df[col].isnull().any():
            print(f"Advertencia: La columna {col} contiene valores NaN después de la conversión.")

    # Imprimir una muestra de los datos después de la conversión
    print("Datos después de la conversión a numéricos:")
    print(data_df.head())

    # Lista de columnas a ignorar
    ignore_columns = ['atom_0', 'atom_1']

    # distance entre ejes de atomos
    data_df['x_dist'] = (data_df['x_0'] - data_df['x_1'])**2
    data_df['y_dist'] = (data_df['y_0'] - data_df['y_1'])**2
    data_df['z_dist'] = (data_df['z_0'] - data_df['z_1'])**2

    # distance entre atomos
    data_df['atom_dist'] = (data_df['x_dist'] + data_df['y_dist'] + data_df['z_dist'])**0.5

    data_df.drop(columns=['x_0', 'x_1', 'y_0', 'y_1', 'z_0', 'z_1'], inplace=True)
        
    # Encuentra las columnas con sufijo _0 y _1
    columns_0 = [col for col in data_df.columns if col.endswith('_0') and col not in ignore_columns]
    columns_1 = [col for col in data_df.columns if col.endswith('_1') and col.replace('_1', '_0') in columns_0]

    # Calcula la diferencia en valor absoluto y guárdala en nuevas columnas
    for col_0 in columns_0:
        col_1 = col_0.replace('_0', '_1')
        if col_1 in data_df.columns:
            data_df[f'diff_{col_0[:-2]}'] = (data_df[col_0] - data_df[col_1]).abs()

    # Eliminar las columnas _0 y _1 que se compararon
    data_df.drop(columns=columns_0 + columns_1, inplace=True)
    
    # Eliminar las columnas especificadas y guardarlas en una variable separada
    columns_to_remove = ['molecule_name', 'atom_0', 'atom_1']
    removed_columns = data_df[columns_to_remove]
    data_df = data_df.drop(columns=columns_to_remove)
    
    # Detectar columnas categóricas
    categorical_cols = data_df.select_dtypes(include=['object']).columns
    
    # Cargar los LabelEncoders guardados
    with open('label_encoders.pkl', 'rb') as file:
        label_encoders = pickle.load(file)

    # Aplicar las transformaciones a las columnas categóricas
    for col in categorical_cols:
        if col in label_encoders:
            le = label_encoders[col]
            data_df[col] = le.transform(data_df[col])
        else:
            raise ValueError(f"LabelEncoder for column {col} not found")
        
    # Estandarización
    scaler = StandardScaler()
    scaled_test_features = scaler.fit_transform(data_df)

    # Convertir de nuevo a DataFrame
    scaled_df = pd.DataFrame(scaled_test_features, columns=data_df.columns)

    # Convertir el DataFrame de pandas a un H2OFrame
    data_h2o = h2o.H2OFrame(scaled_df)

    # Realizar la predicción
    prediction = model.predict(data_h2o)

    # Convertir la predicción a un DataFrame de pandas
    prediction_df = prediction.as_data_frame()

    # Añadir las predicciones a los datos originales
    data_df['scalar_coupling_constant'] = prediction_df
    
    # Después del entrenamiento, vuelves a unir las columnas eliminadas al dataframe original
    data_df = pd.concat([removed_columns, data_df], axis=1)
    
    # Revertir las transformaciones
    for col in label_encoders:
        le = label_encoders[col]
        data_df[col] = le.inverse_transform(data_df[col])

    # Generar un nombre de archivo único usando UUID
    unique_filename = f'predicciones_{uuid.uuid4()}.csv'
    output_csv = os.path.join(output_folder, unique_filename)
    data_df.to_csv(output_csv, index=False)

    return jsonify({"message": "Predicción completada", "csv_file": unique_filename})

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(output_folder, filename, as_attachment=True)

if __name__ == '__main__':
    app.run()
