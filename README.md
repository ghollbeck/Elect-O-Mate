
# Elect-O-Mate

Build Your Opinion for the upcoming EU Elections. This tool offers you additional information. Additionally, you can have a chat with an expert AI ChatBot or just voice call with the database & web.

## Demo

Demo Screen recording - Coming soon

## Safety

We acknowledge the dangers a political advisory tool can have. LLMs are proven to hallucinate, show bias, or also deliver wrong sources.

We decided to be fully transparent to provide a basis of trust in this uncertain realm of AI application and societal acceptance.

With Wahl-O-Smart, we have developed an election tool with an AI chatbot integration and are deeply conscious of the ethical implications this entails. Recognizing the potential risks, such as misinformation and bias, inherent in AI technologies, we are committed to transparency and responsibility. Here’s how we're approaching this:

* **Transparency:** We Open Source everything
* **Accuracy and Fairness:** Advanced RAG-Pipeline for frontier source accuracy and LLM rule checkers for fairness maximization
* **Ethical Engagement:** We supervised the preferred sources by political experts and openly take part in the global discussion around AI Safety and Alignment

In navigating the intersection of technology and democracy, Wahl-O-Mat pledges to uphold the highest standards, ensuring our AI tools enhance informed opinion building, decision making, decrease political apathy, and make the existing tools shorter as well as more accessible.

## Production

> :warning: **Test before pushing to production**: run `make test` and check whether everything works by going to `http://localhost` before pushing to production

## Backend Structure

The backend of Elect-O-Mate is organized into several key directories and files, each serving a specific purpose. Below is an overview of the structure and functionality of each component:

### Main Directories and Files

- **Backend/**
  - `.DS_Store`
  - `metadata.py`: Script for loading and processing metadata from various sources.
  - `requirements.txt`: List of dependencies required to run the backend.
  - `Dockerfile`: Docker configuration file for containerizing the application.
  - `prompts.py`: Contains templates for prompts used by the AI.
  - `README.md`: Documentation file for the backend.
  - `sources.py`: Script for loading and processing source documents.
  - `.env`: Environment variables configuration file.
  - `main.py`: Main entry point for the backend application.
  - `Final_Result_Party_Overlap_List.json`: JSON file containing the final results of party overlaps.
  - **cache/**: Directory containing cached files for various processed documents and metadata.
  - **Score_Evaluation/**: Directory containing scripts and data for evaluating scores.
    - `calculation.py`, `calculation1.py`: Scripts for calculating scores.
    - `creation_Pro_Con.py`: Script for creating pro/con evaluations.
    - `OptionalGraphs/`: Directory containing scripts and data for generating optional graphs.
  - **Sources/**: Directory containing source files and scripts for interpreting them.
    - `Wahlomat/`: Subdirectory for Wahlomat-specific data.
    - `ActiveSources/`: Subdirectory for active source documents by country.
    - `IPCC/`: Subdirectory for IPCC-related documents.
    - `Quellen GPT-4-Elections/`: Subdirectory for GPT-4 election sources.
    - `URLS/`: Subdirectory for URL lists of various documents.
    - `PDFs/`: Subdirectory for PDF documents.

### Key Scripts and Functions

- `metadata.py`: Functions to load PDF and web documents, generate metadata, count tokens, and split strings into chunks.
- `sources.py`: Functions to retrieve URLs from files, load web content, get PDF links by country, and build data structures for URLs and PDFs.
- `main.py`: Main application script using FastAPI, defining endpoints for evaluating user answers and initializing retrievers and chains for different countries.

## Evaluation

The evaluation process involves comparing user answers to the party answers stored in JSON files. The `calculation.py` and `calculation1.py` scripts are used to process the answers, calculate differences, and generate visualizations.

## Install

To install and run the backend, follow these steps:

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd Backend
   ```

2. Install the dependencies:
   ```sh
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the `Backend` directory with the necessary environment variables, including `OPENAI_API_KEY`.

4. Run the application:
   ```sh
   python main.py
   ```

## References and Acknowledgment

We would like to acknowledge the following projects and resources that inspired and supported the development of Elect-O-Mate:

* **ChatClimate**
* **Wahl-O-Mat**
* **SmartVote**
* **Papers:**
  * RAG
  * Enhanced RAG
  * Evaluation

Thank you for using Elect-O-Mate! We hope it helps you make informed decisions in the upcoming EU elections. For any issues or contributions, please feel free to open an issue or pull request on our GitHub repository.
