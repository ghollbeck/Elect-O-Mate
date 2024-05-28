import pytesseract
from PIL import Image
import re

# Load the image
image_path = "/Users/gaborhollbeck/Desktop/Screenshots/Screenshot 2024-05-28 at 22.02.45.png"
image = Image.open(image_path)

# Use pytesseract to extract text from the image
text = pytesseract.image_to_string(image)

# Define a regular expression pattern to extract email addresses
email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'

# Find all email addresses in the extracted text
emails = re.findall(email_pattern, text)

# Print the extracted email addresses
print(emails)
