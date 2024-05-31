FROM python:3.11

LABEL MAINTAINER="Lorin Urbantat"
LABEL org.opencontainers.image.source https://github.com/ghollbeck/Elect-O-Mate/


WORKDIR /app

COPY main.py /app
COPY requirements.txt /app
COPY cache /app/cache
COPY Sources/ActiveSources /app/Sources/ActiveSources
COPY Score_Evaluation /app/Score_Evaluation
COPY sources.py /app/sources.py
COPY prompts.py /app/prompts.py
COPY metadata.py /app/metadata.py

RUN pip install -r requirements.txt


EXPOSE 8000
CMD ["python", "main.py"]