from flask import Flask, request, send_file
from rembg import remove
from PIL import Image
import io
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)
@app.route('/generate_pfp', methods=['POST'])
def generate_pfp():
    if 'image' not in request.files:
        return 'No file part', 400
    
    file = request.files['image']
    if file.filename == '':
        return 'No selected file', 400

    # Process the image to remove the background
    input_image = file.read()  # Read the file as bytes
    output_image = remove(input_image)  # Remove background using rembg

    # Convert the output image to a PIL Image
    image = Image.open(io.BytesIO(output_image)).convert("RGBA")

    # Get image size and create a green background
    width, height = image.size
    green_bg = Image.new("RGBA", (width, height), (3, 253, 17))  # Green background

    # Composite the green background with the processed image
    final_image = Image.alpha_composite(green_bg, image)

    # Save the resulting image to a BytesIO object
    img_byte_arr = io.BytesIO()
    final_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    # Return the processed image as a downloadable file
    return send_file(img_byte_arr, mimetype='image/png', as_attachment=True, download_name='generated_pfp.png')

if __name__ == '__main__':
    app.run(debug=True)
