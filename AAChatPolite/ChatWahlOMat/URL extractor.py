# import os
# import re

# def extract_urls_from_file(file_path):
#     """Extracts URLs from an HTML file."""
#     url_pattern = re.compile(r'href="([^"]*)"')
#     with open(file_path, 'r', encoding='utf-8') as file:
#         contents = file.read()
#     return url_pattern.findall(contents)

# def find_html_files(directory):
#     """Generator function that yields HTML files from a directory and its subdirectories."""
#     for root, dirs, files in os.walk(directory):
#         for file in files:
#             if file.endswith('.html') or file.endswith('.htm'):
#                 yield os.path.join(root, file)

# def main():
#     directory = input("Enter the directory to search for HTML files: ")
#     base_url = "https://www.bpb.de"
#     output_file = 'extracted_urls.txt'
    
#     with open(output_file, 'w') as out:
#         for html_file in find_html_files(directory):
#             urls = extract_urls_from_file(html_file)
#             for url in urls:
#                 if url.startswith(base_url):
#                     out.write(url + '\n')

#     print(f"URLs have been extracted and stored in {output_file}")

# if __name__ == "__main__":
#     main()


import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

def get_suburls(url):
    """Extract sub-URLs from the given URL."""
    try:
        # Send a HTTP request to the given URL
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return []

    # Parse the HTML content of the page
    soup = BeautifulSoup(response.text, 'html.parser')
    suburls = set()  # Use a set to avoid duplicate URLs

    # Find all anchor tags and extract the href attribute
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        # Create absolute URL and ensure it's part of the same domain
        absolute_url = urljoin(url, href)
        if urlparse(absolute_url).netloc == urlparse(url).netloc:
            suburls.add(absolute_url)

    return list(suburls)

def main():
    url = input("Enter the URL to extract sub-URLs from: ")
    suburls = get_suburls(url)
    with open('suburls.txt', 'w') as f:
        for suburl in suburls:
            f.write(suburl + '\n')

if __name__ == "__main__":
    main()